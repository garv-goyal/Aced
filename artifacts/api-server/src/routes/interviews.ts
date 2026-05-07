import { Router } from "express";
import { createRequire } from "node:module";
import multer from "multer";
import { getAuth, clerkClient } from "@clerk/express";
import { db } from "@workspace/db";
import {
  interviewSessions,
  interviewQuestions,
  interviewAnswers,
  interviewScorecards,
  type QuestionFeedback,
} from "@workspace/db";
import { eq, desc, gte, and, count } from "drizzle-orm";
import {
  CreateInterviewBody,
  SubmitAnswerBody,
  SubmitAnswerParams,
  GetInterviewParams,
  DeleteInterviewParams,
  ScoreInterviewParams,
  GetScorecardParams,
  SpeakTextBody,
  UpdateQuestionParams,
  UpdateQuestionBody,
} from "@workspace/api-zod";
import { openai } from "@workspace/integrations-openai-ai-server";

const _require = createRequire(import.meta.url);
const pdfParse = _require("pdf-parse") as (buf: Buffer) => Promise<{ text: string }>;
const mammoth = _require("mammoth") as {
  extractRawText: (opts: { buffer: Buffer }) => Promise<{ value: string }>;
};

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
});

const router = Router();

type InterviewType = "mixed" | "behavioral" | "technical" | "case_study" | "culture_fit";

interface GeneratedQuestion {
  questionText: string;
  category: "technical" | "behavioral";
  gapArea: string;
}

const TYPE_INSTRUCTIONS: Record<InterviewType, string> = {
  mixed: "Generate a balanced mix of technical and behavioral questions targeting the most critical skill and experience gaps.",
  behavioral: "Focus exclusively on behavioral questions using the STAR method (Situation, Task, Action, Result). Ask about past experiences, team dynamics, conflict resolution, and leadership moments.",
  technical: "Focus exclusively on technical questions about skills, architecture, system design, and problem-solving approaches explicitly mentioned in the job description.",
  case_study: "Focus on case study style questions that present realistic business problems, analytical scenarios, and strategic thinking challenges relevant to the role.",
  culture_fit: "Focus on questions about values, work style, team collaboration, company culture alignment, and motivations. Avoid technical and STAR behavioral questions.",
};

const QUESTION_SYSTEM_PROMPT = (typeInstruction: string) =>
  `You are an expert technical recruiter and interviewer. Analyze the candidate's resume and the job description to identify the top 5 gap areas — skills, experience, or competencies that the candidate may lack or where there is a mismatch. Generate one targeted interview question per gap area.

Interview focus: ${typeInstruction}

Return ONLY a valid JSON array of exactly 5 objects with this shape:
[
  {
    "questionText": "...",
    "category": "technical" | "behavioral",
    "gapArea": "short label for the gap, e.g. 'System Design Experience'"
  }
]

Rules:
- Questions must be specific to the gap identified and aligned with the interview type focus
- Questions should be open-ended and designed to reveal depth
- Do not include any text outside the JSON array`;

// Streams questions from OpenAI one-by-one, saving each to DB as it completes.
// Called as fire-and-forget from POST /interviews so the response returns immediately.
async function streamGenerateAndSaveQuestions(
  sessionId: number,
  jobTitle: string,
  jobDescription: string,
  resumeText: string,
  interviewType: InterviewType
) {
  const typeInstruction = TYPE_INSTRUCTIONS[interviewType] ?? TYPE_INSTRUCTIONS.mixed;
  const stream = await openai.chat.completions.create({
    model: "gpt-4o",
    max_completion_tokens: 2048,
    stream: true,
    messages: [
      { role: "system", content: QUESTION_SYSTEM_PROMPT(typeInstruction) },
      { role: "user", content: `Job Title: ${jobTitle}\nInterview Type: ${interviewType}\n\nJob Description:\n${jobDescription}\n\nCandidate Resume:\n${resumeText}` },
    ],
  });

  let depth = 0, inString = false, escape = false, inside = false, objBuffer = "", orderIndex = 0;

  for await (const chunk of stream) {
    const token = chunk.choices[0]?.delta?.content ?? "";
    for (let ci = 0; ci < token.length; ci++) {
      const char = token[ci];
      if (escape) { escape = false; if (inside) objBuffer += char; continue; }
      if (char === "\\" && inString) { escape = true; if (inside) objBuffer += char; continue; }
      if (char === '"') { inString = !inString; if (inside) objBuffer += char; continue; }
      if (inString) { if (inside) objBuffer += char; continue; }
      if (char === "{") {
        depth++;
        if (depth === 1) { inside = true; objBuffer = "{"; }
        else if (inside) objBuffer += char;
      } else if (char === "}") {
        if (inside) objBuffer += char;
        depth--;
        if (depth === 0 && inside) {
          inside = false;
          try {
            const q = JSON.parse(objBuffer) as GeneratedQuestion;
            await db.insert(interviewQuestions).values({
              sessionId,
              orderIndex: orderIndex++,
              questionText: q.questionText,
              category: q.category as "technical" | "behavioral",
              gapArea: q.gapArea,
              isCustom: false,
            });
          } catch { /* malformed fragment */ }
          objBuffer = "";
        }
      } else if (inside) {
        objBuffer += char;
      }
    }
  }
}

async function scoreInterviewAnswers(
  sessionId: number
): Promise<{
  overallScore: number;
  clarityScore: number;
  starScore: number;
  sentimentScore: number;
  confidenceLevel: "low" | "medium" | "high";
  overallFeedback: string;
  strengthPoints: string[];
  improvementPoints: string[];
  questionFeedbacks: QuestionFeedback[];
}> {
  const session = await db.query.interviewSessions.findFirst({
    where: eq(interviewSessions.id, sessionId),
  });
  if (!session) throw new Error("Session not found");

  const questions = await db
    .select()
    .from(interviewQuestions)
    .where(eq(interviewQuestions.sessionId, sessionId))
    .orderBy(interviewQuestions.orderIndex);

  const qWithAnswers = await Promise.all(
    questions.map(async (q) => {
      const [answer] = await db
        .select()
        .from(interviewAnswers)
        .where(eq(interviewAnswers.questionId, q.id))
        .limit(1);
      return { question: q, answer };
    })
  );

  const systemPrompt = `You are an expert interview coach. Evaluate the candidate's interview responses and provide detailed, actionable feedback.

Score each dimension on a scale of 0–100:
- Clarity Score: How clearly and concisely the candidate communicated their points
- STAR Score: How well they used Situation, Task, Action, Result structure in behavioral answers
- Sentiment Score: Confidence and positivity (100 = very confident, 0 = very hesitant)

Also evaluate each individual question response.

Return ONLY valid JSON with this exact shape:
{
  "overallScore": number (0–100, weighted average),
  "clarityScore": number (0–100),
  "starScore": number (0–100),
  "sentimentScore": number (0–100),
  "confidenceLevel": "low" | "medium" | "high",
  "overallFeedback": "2–3 sentence overall assessment",
  "strengthPoints": ["strength 1", "strength 2", "strength 3"],
  "improvementPoints": ["improvement 1", "improvement 2", "improvement 3"],
  "questionFeedbacks": [
    {
      "questionId": number,
      "questionText": "...",
      "transcript": "...",
      "clarityScore": number,
      "starScore": number,
      "sentimentScore": number,
      "feedback": "1–2 sentence specific feedback",
      "hasSituation": boolean,
      "hasTask": boolean,
      "hasAction": boolean,
      "hasResult": boolean
    }
  ]
}`;

  const qaWithIds = qWithAnswers
    .map(
      ({ question, answer }, i) =>
        `Q${i + 1} [ID:${question.id}] [${question.category}] (Gap: ${question.gapArea}): ${question.questionText}\nAnswer: ${answer?.transcript ?? "(no answer provided)"}`
    )
    .join("\n\n");

  const response = await openai.chat.completions.create({
    model: "gpt-5.4",
    max_completion_tokens: 4096,
    messages: [
      { role: "system", content: systemPrompt },
      {
        role: "user",
        content: `Job: ${session.jobTitle}\n\nInterview Q&A:\n${qaWithIds}`,
      },
    ],
  });

  const content = response.choices[0]?.message?.content ?? "{}";
  const jsonMatch = content.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error("Failed to parse scorecard from AI");

  const result = JSON.parse(jsonMatch[0]);

  result.questionFeedbacks = result.questionFeedbacks.map(
    (qf: QuestionFeedback & { questionId: number }) => {
      const match = qWithAnswers.find((q) => q.question.id === qf.questionId);
      return {
        ...qf,
        transcript: match?.answer?.transcript ?? "(no answer)",
        questionText: match?.question.questionText ?? qf.questionText,
      };
    }
  );

  return result;
}

// POST /interviews/import-linkedin
router.post("/interviews/import-linkedin", async (req, res) => {
  const { url } = req.body ?? {};
  if (!url || typeof url !== "string") {
    res.status(400).json({ error: "Invalid URL" });
    return;
  }

  if (!url.includes("linkedin.com/in/")) {
    res.status(400).json({ error: "Please provide a valid LinkedIn profile URL (linkedin.com/in/...)" });
    return;
  }

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
        "Cache-Control": "no-cache",
      },
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      res.status(422).json({
        error: "LinkedIn blocked the request. Please copy-paste your profile text instead.",
      });
      return;
    }

    const html = await response.text();

    // Extract JSON-LD structured data
    let name: string | undefined;
    let headline: string | undefined;
    const parts: string[] = [];

    const jsonLdMatches = html.matchAll(/<script[^>]+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi);
    for (const match of jsonLdMatches) {
      try {
        const data = JSON.parse(match[1]) as {
          "@type"?: string;
          name?: string;
          jobTitle?: string;
          description?: string;
          alumniOf?: Array<{ name?: string }>;
          worksFor?: { name?: string };
        };
        if (data["@type"] === "Person") {
          name = data.name;
          headline = data.jobTitle ?? data.description?.slice(0, 120);
          if (data.name) parts.push(`Name: ${data.name}`);
          if (data.jobTitle) parts.push(`Current Role: ${data.jobTitle}`);
          if (data.description) parts.push(`About: ${data.description}`);
          if (Array.isArray(data.alumniOf)) {
            const edu = data.alumniOf.map((a) => a.name).filter(Boolean).join(", ");
            if (edu) parts.push(`Education: ${edu}`);
          }
          if (data.worksFor?.name) parts.push(`Company: ${data.worksFor.name}`);
        }
      } catch {
        // not valid JSON, skip
      }
    }

    // If we found structured data, return it
    if (parts.length > 0) {
      res.json({ text: parts.join("\n"), name, headline });
      return;
    }

    // Fall back: try to extract visible text from key sections
    const stripped = html
      .replace(/<script[\s\S]*?<\/script>/gi, "")
      .replace(/<style[\s\S]*?<\/style>/gi, "")
      .replace(/<[^>]+>/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&nbsp;/g, " ")
      .replace(/\s{2,}/g, " ")
      .trim();

    // Check if we got something meaningful (not just a login page)
    if (stripped.length < 500 || stripped.toLowerCase().includes("join to see")) {
      res.status(422).json({
        error: "This LinkedIn profile is private or requires login. Please copy-paste your profile text instead.",
      });
      return;
    }

    // Extract the username to form a basic intro
    const usernameMatch = url.match(/linkedin\.com\/in\/([^/?#]+)/);
    const username = usernameMatch?.[1]?.replace(/-/g, " ") ?? "";

    res.json({
      text: `LinkedIn Profile: ${username ? username.replace(/\b\w/g, (c) => c.toUpperCase()) : "User"}\n\n${stripped.slice(0, 3000)}`,
      name: username ? username.replace(/\b\w/g, (c) => c.toUpperCase()) : undefined,
    });
  } catch (err: unknown) {
    req.log.error({ err }, "LinkedIn import failed");
    const msg = err instanceof Error ? err.message : "Unknown error";
    if (msg.includes("timeout") || msg.includes("abort")) {
      res.status(422).json({ error: "LinkedIn took too long to respond. Please copy-paste your profile text instead." });
    } else {
      res.status(422).json({ error: "Could not fetch LinkedIn profile. Please copy-paste your profile text instead." });
    }
  }
});

// POST /interviews/speak - Text to speech
router.post("/interviews/speak", async (req, res) => {
  const parsed = SpeakTextBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid request body" });
    return;
  }

  const { text, voice = "alloy" } = parsed.data;

  try {
    const mp3 = await openai.audio.speech.create({
      model: "tts-1",
      voice: voice as "alloy" | "echo" | "fable" | "onyx" | "nova" | "shimmer",
      input: text,
    });

    const buffer = Buffer.from(await mp3.arrayBuffer());
    res.setHeader("Content-Type", "audio/mpeg");
    res.setHeader("Content-Length", buffer.length);
    res.end(buffer);
  } catch (err) {
    req.log.error({ err }, "TTS error");
    res.status(500).json({ error: "Failed to generate speech" });
  }
});

// GET /interviews - list sessions for authenticated user
router.get("/interviews", async (req, res) => {
  try {
    const { userId } = getAuth(req);

    if (!userId) {
      res.json([]);
      return;
    }

    const sessions = await db
      .select()
      .from(interviewSessions)
      .where(eq(interviewSessions.userId, userId))
      .orderBy(desc(interviewSessions.createdAt));

    const withCount = await Promise.all(
      sessions.map(async (s) => {
        const questions = await db
          .select()
          .from(interviewQuestions)
          .where(eq(interviewQuestions.sessionId, s.id));
        return {
          id: s.id,
          jobTitle: s.jobTitle,
          status: s.status,
          questionCount: questions.length,
          createdAt: s.createdAt,
        };
      })
    );

    res.json(withCount);
  } catch (err) {
    req.log.error({ err }, "Failed to list interviews");
    res.status(500).json({ error: "Failed to list interviews" });
  }
});

// POST /interviews
router.post("/interviews", async (req, res) => {
  const parsed = CreateInterviewBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid request body" });
    return;
  }

  const { resumeText, jobDescription, jobTitle, interviewType = "mixed" } = parsed.data;

  try {
    const { userId } = getAuth(req);

    if (userId) {
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);
      const [{ total }] = await db
        .select({ total: count() })
        .from(interviewSessions)
        .where(and(eq(interviewSessions.userId, userId), gte(interviewSessions.createdAt, startOfDay)));
      if (total >= 5) {
        res.status(429).json({ error: "Daily limit reached. You can start up to 5 interviews per day — come back tomorrow!" });
        return;
      }
    }

    let userName: string | null = null;
    let userEmail: string | null = null;
    if (userId) {
      try {
        const user = await clerkClient.users.getUser(userId);
        userName = [user.firstName, user.lastName].filter(Boolean).join(" ") || user.username || null;
        userEmail = user.emailAddresses?.[0]?.emailAddress ?? null;
      } catch {
        // non-fatal — session still saves without user info
      }
    }

    const [session] = await db
      .insert(interviewSessions)
      .values({ userId: userId ?? null, userName, userEmail, jobTitle, resumeText, jobDescription, interviewType, status: "active" })
      .returning();

    // Fire-and-forget: generate + save questions in background so the response returns immediately
    streamGenerateAndSaveQuestions(session.id, jobTitle, jobDescription, resumeText, interviewType as InterviewType)
      .catch(err => req.log.error({ err }, "Background question generation failed"));

    res.status(201).json({
      id: session.id,
      jobTitle: session.jobTitle,
      status: session.status,
      createdAt: session.createdAt,
      questions: [],
    });
  } catch (err) {
    req.log.error({ err }, "Failed to create interview");
    res.status(500).json({ error: "Failed to create interview" });
  }
});

// GET /interviews/:id/stream-questions — SSE endpoint, streams questions one by one
router.get("/interviews/:id/stream-questions", async (req, res) => {
  const params = GetInterviewParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  const { id } = params.data;

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();

  const emit = (data: unknown) => res.write(`data: ${JSON.stringify(data)}\n\n`);

  try {
    const session = await db.query.interviewSessions.findFirst({
      where: eq(interviewSessions.id, id),
    });
    if (!session) {
      emit({ error: "Session not found" });
      res.end();
      return;
    }

    // Reconnection: questions already in DB — emit them immediately and close
    const existing = await db
      .select()
      .from(interviewQuestions)
      .where(eq(interviewQuestions.sessionId, id))
      .orderBy(interviewQuestions.orderIndex);

    if (existing.length > 0) {
      for (const q of existing) emit({ question: q });
      res.write(`event: done\ndata: {}\n\n`);
      res.end();
      return;
    }

    // Poll DB for questions as the background job saves them, emitting each one as it appears
    const emitted = new Set<number>();
    const deadline = Date.now() + 30_000;

    while (!res.writableEnded && Date.now() < deadline) {
      const current = await db
        .select()
        .from(interviewQuestions)
        .where(eq(interviewQuestions.sessionId, id))
        .orderBy(interviewQuestions.orderIndex);

      for (const q of current) {
        if (!emitted.has(q.id)) {
          emitted.add(q.id);
          emit({ question: q });
        }
      }

      if (current.length >= 5) break;
      await new Promise(r => setTimeout(r, 300));
    }

    if (!res.writableEnded) {
      res.write(`event: done\ndata: {}\n\n`);
      res.end();
    }
  } catch (err) {
    req.log.error({ err }, "Failed to stream questions");
    if (!res.writableEnded) {
      res.write(`event: error\ndata: ${JSON.stringify({ error: "Failed to generate questions" })}\n\n`);
      res.end();
    }
  }
});

// GET /interviews/:id
router.get("/interviews/:id", async (req, res) => {
  const params = GetInterviewParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }

  try {
    const session = await db.query.interviewSessions.findFirst({
      where: eq(interviewSessions.id, params.data.id),
    });

    if (!session) {
      res.status(404).json({ error: "Interview not found" });
      return;
    }

    const questions = await db
      .select()
      .from(interviewQuestions)
      .where(eq(interviewQuestions.sessionId, session.id))
      .orderBy(interviewQuestions.orderIndex);

    const qWithAnswers = await Promise.all(
      questions.map(async (q) => {
        const [answer] = await db
          .select()
          .from(interviewAnswers)
          .where(eq(interviewAnswers.questionId, q.id))
          .limit(1);
        return { ...q, answer: answer ?? undefined };
      })
    );

    const [scorecard] = await db
      .select()
      .from(interviewScorecards)
      .where(eq(interviewScorecards.sessionId, session.id))
      .limit(1);

    res.json({
      id: session.id,
      jobTitle: session.jobTitle,
      resumeText: session.resumeText,
      jobDescription: session.jobDescription,
      interviewType: session.interviewType,
      status: session.status,
      createdAt: session.createdAt,
      questions: qWithAnswers,
      scorecard: scorecard ?? undefined,
    });
  } catch (err) {
    req.log.error({ err }, "Failed to get interview");
    res.status(500).json({ error: "Failed to get interview" });
  }
});

// DELETE /interviews/:id
router.delete("/interviews/:id", async (req, res) => {
  const params = DeleteInterviewParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }

  try {
    const [deleted] = await db
      .delete(interviewSessions)
      .where(eq(interviewSessions.id, params.data.id))
      .returning();

    if (!deleted) {
      res.status(404).json({ error: "Interview not found" });
      return;
    }

    res.status(204).end();
  } catch (err) {
    req.log.error({ err }, "Failed to delete interview");
    res.status(500).json({ error: "Failed to delete interview" });
  }
});

// POST /interviews/:id/retry - clone session with same questions, no AI generation
router.post("/interviews/:id/retry", async (req, res) => {
  const params = GetInterviewParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }

  try {
    const { userId } = getAuth(req);

    const original = await db.query.interviewSessions.findFirst({
      where: eq(interviewSessions.id, params.data.id),
    });

    if (!original) {
      res.status(404).json({ error: "Interview not found" });
      return;
    }

    const originalQuestions = await db
      .select()
      .from(interviewQuestions)
      .where(eq(interviewQuestions.sessionId, original.id))
      .orderBy(interviewQuestions.orderIndex);

    let userName: string | null = null;
    let userEmail: string | null = null;
    if (userId) {
      try {
        const user = await clerkClient.users.getUser(userId);
        userName = [user.firstName, user.lastName].filter(Boolean).join(" ") || user.username || null;
        userEmail = user.emailAddresses?.[0]?.emailAddress ?? null;
      } catch {
        // non-fatal
      }
    }

    const [newSession] = await db
      .insert(interviewSessions)
      .values({
        userId: userId ?? null,
        userName,
        userEmail,
        jobTitle: original.jobTitle,
        resumeText: original.resumeText,
        jobDescription: original.jobDescription,
        interviewType: original.interviewType,
        status: "active",
      })
      .returning();

    const insertedQuestions = await db
      .insert(interviewQuestions)
      .values(
        originalQuestions.map((q) => ({
          sessionId: newSession.id,
          orderIndex: q.orderIndex,
          questionText: q.questionText,
          category: q.category,
          gapArea: q.gapArea,
          isCustom: q.isCustom,
        }))
      )
      .returning();

    res.status(201).json({
      id: newSession.id,
      jobTitle: newSession.jobTitle,
      status: newSession.status,
      createdAt: newSession.createdAt,
      questions: insertedQuestions.map((q) => ({
        id: q.id,
        sessionId: q.sessionId,
        orderIndex: q.orderIndex,
        questionText: q.questionText,
        category: q.category,
        gapArea: q.gapArea,
        isCustom: q.isCustom,
      })),
    });
  } catch (err) {
    req.log.error({ err }, "Failed to retry interview");
    res.status(500).json({ error: "Failed to retry interview" });
  }
});

// PATCH /interviews/:id/questions/:questionId - override a question
router.patch("/interviews/:id/questions/:questionId", async (req, res) => {
  const params = UpdateQuestionParams.safeParse(req.params);
  const body = UpdateQuestionBody.safeParse(req.body);

  if (!params.success || !body.success) {
    res.status(400).json({ error: "Invalid request" });
    return;
  }

  try {
    const question = await db.query.interviewQuestions.findFirst({
      where: eq(interviewQuestions.id, params.data.questionId),
    });

    if (!question || question.sessionId !== params.data.id) {
      res.status(404).json({ error: "Question not found" });
      return;
    }

    const [updated] = await db
      .update(interviewQuestions)
      .set({ questionText: body.data.questionText, isCustom: true })
      .where(eq(interviewQuestions.id, params.data.questionId))
      .returning();

    res.json({ id: updated.id, questionText: updated.questionText, isCustom: updated.isCustom });
  } catch (err) {
    req.log.error({ err }, "Failed to update question");
    res.status(500).json({ error: "Failed to update question" });
  }
});

// POST /interviews/:id/answers
router.post("/interviews/:id/answers", async (req, res) => {
  const params = SubmitAnswerParams.safeParse(req.params);
  const body = SubmitAnswerBody.safeParse(req.body);

  if (!params.success || !body.success) {
    res.status(400).json({ error: "Invalid request" });
    return;
  }

  try {
    const question = await db.query.interviewQuestions.findFirst({
      where: eq(interviewQuestions.id, body.data.questionId),
    });

    if (!question || question.sessionId !== params.data.id) {
      res.status(404).json({ error: "Question not found" });
      return;
    }

    const existing = await db
      .select()
      .from(interviewAnswers)
      .where(eq(interviewAnswers.questionId, body.data.questionId))
      .limit(1);

    let answer;
    if (existing.length > 0) {
      const [updated] = await db
        .update(interviewAnswers)
        .set({ transcript: body.data.transcript })
        .where(eq(interviewAnswers.questionId, body.data.questionId))
        .returning();
      answer = updated;
    } else {
      const [created] = await db
        .insert(interviewAnswers)
        .values({ questionId: body.data.questionId, transcript: body.data.transcript })
        .returning();
      answer = created;
    }

    res.json(answer);
  } catch (err) {
    req.log.error({ err }, "Failed to submit answer");
    res.status(500).json({ error: "Failed to submit answer" });
  }
});

// POST /interviews/:id/score
router.post("/interviews/:id/score", async (req, res) => {
  const params = ScoreInterviewParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }

  try {
    const session = await db.query.interviewSessions.findFirst({
      where: eq(interviewSessions.id, params.data.id),
    });

    if (!session) {
      res.status(404).json({ error: "Interview not found" });
      return;
    }

    const scoreData = await scoreInterviewAnswers(params.data.id);

    await db
      .update(interviewSessions)
      .set({ status: "complete" })
      .where(eq(interviewSessions.id, params.data.id));

    await db
      .delete(interviewScorecards)
      .where(eq(interviewScorecards.sessionId, params.data.id));

    const [scorecard] = await db
      .insert(interviewScorecards)
      .values({
        sessionId: params.data.id,
        overallScore: scoreData.overallScore,
        clarityScore: scoreData.clarityScore,
        starScore: scoreData.starScore,
        sentimentScore: scoreData.sentimentScore,
        confidenceLevel: scoreData.confidenceLevel,
        overallFeedback: scoreData.overallFeedback,
        strengthPoints: scoreData.strengthPoints,
        improvementPoints: scoreData.improvementPoints,
        questionFeedbacks: scoreData.questionFeedbacks,
      })
      .returning();

    res.json(scorecard);
  } catch (err) {
    req.log.error({ err }, "Failed to score interview");
    res.status(500).json({ error: "Failed to score interview" });
  }
});

// GET /interviews/:id/scorecard
router.get("/interviews/:id/scorecard", async (req, res) => {
  const params = GetScorecardParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }

  try {
    const session = await db.query.interviewSessions.findFirst({
      where: eq(interviewSessions.id, params.data.id),
    });

    if (!session) {
      res.status(404).json({ error: "Session not found" });
      return;
    }

    const [scorecard] = await db
      .select()
      .from(interviewScorecards)
      .where(eq(interviewScorecards.sessionId, params.data.id))
      .limit(1);

    if (!scorecard) {
      res.status(404).json({ error: "Scorecard not found" });
      return;
    }

    res.json({
      ...scorecard,
      jobTitle: session.jobTitle,
      jobDescription: session.jobDescription,
      interviewType: session.interviewType,
      createdAt: session.createdAt,
    });
  } catch (err) {
    req.log.error({ err }, "Failed to get scorecard");
    res.status(500).json({ error: "Failed to get scorecard" });
  }
});

router.post("/interviews/parse-resume", upload.single("file"), async (req, res) => {
  const file = req.file;
  if (!file) {
    res.status(400).json({ error: "No file uploaded" });
    return;
  }

  const isPdf = file.mimetype === "application/pdf";
  const isDocx =
    file.mimetype ===
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

  if (!isPdf && !isDocx) {
    res
      .status(400)
      .json({ error: "Unsupported file type. Please upload a PDF or DOCX." });
    return;
  }

  try {
    let text = "";
    if (isPdf) {
      const data = await pdfParse(file.buffer);
      text = data.text;
    } else {
      const result = await mammoth.extractRawText({ buffer: file.buffer });
      text = result.value;
    }

    res.json({ text: text.trim() });
  } catch (err) {
    req.log.error({ err }, "Failed to parse resume file");
    res.status(500).json({ error: "Failed to parse file. Please try again." });
  }
});

export default router;
