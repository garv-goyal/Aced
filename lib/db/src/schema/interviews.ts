import { pgTable, text, serial, integer, timestamp, jsonb, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const interviewSessions = pgTable("interview_sessions", {
  id: serial("id").primaryKey(),
  userId: text("user_id"),
  userName: text("user_name"),
  userEmail: text("user_email"),
  jobTitle: text("job_title").notNull(),
  resumeText: text("resume_text").notNull(),
  jobDescription: text("job_description").notNull(),
  interviewType: text("interview_type").notNull().default("mixed"),
  status: text("status").notNull().default("setup"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertInterviewSessionSchema = createInsertSchema(interviewSessions).omit({ id: true, createdAt: true });
export type InsertInterviewSession = z.infer<typeof insertInterviewSessionSchema>;
export type InterviewSession = typeof interviewSessions.$inferSelect;

export const interviewQuestions = pgTable("interview_questions", {
  id: serial("id").primaryKey(),
  sessionId: integer("session_id").notNull().references(() => interviewSessions.id, { onDelete: "cascade" }),
  orderIndex: integer("order_index").notNull(),
  questionText: text("question_text").notNull(),
  category: text("category").notNull(),
  gapArea: text("gap_area").notNull(),
  isCustom: boolean("is_custom").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertInterviewQuestionSchema = createInsertSchema(interviewQuestions).omit({ id: true, createdAt: true });
export type InsertInterviewQuestion = z.infer<typeof insertInterviewQuestionSchema>;
export type InterviewQuestion = typeof interviewQuestions.$inferSelect;

export const interviewAnswers = pgTable("interview_answers", {
  id: serial("id").primaryKey(),
  questionId: integer("question_id").notNull().references(() => interviewQuestions.id, { onDelete: "cascade" }),
  transcript: text("transcript").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertInterviewAnswerSchema = createInsertSchema(interviewAnswers).omit({ id: true, createdAt: true });
export type InsertInterviewAnswer = z.infer<typeof insertInterviewAnswerSchema>;
export type InterviewAnswer = typeof interviewAnswers.$inferSelect;

export const interviewScorecards = pgTable("interview_scorecards", {
  id: serial("id").primaryKey(),
  sessionId: integer("session_id").notNull().references(() => interviewSessions.id, { onDelete: "cascade" }),
  overallScore: integer("overall_score").notNull(),
  clarityScore: integer("clarity_score").notNull(),
  starScore: integer("star_score").notNull(),
  sentimentScore: integer("sentiment_score").notNull(),
  confidenceLevel: text("confidence_level").notNull(),
  overallFeedback: text("overall_feedback").notNull(),
  strengthPoints: jsonb("strength_points").notNull().$type<string[]>(),
  improvementPoints: jsonb("improvement_points").notNull().$type<string[]>(),
  questionFeedbacks: jsonb("question_feedbacks").notNull().$type<QuestionFeedback[]>(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export interface QuestionFeedback {
  questionId: number;
  questionText: string;
  transcript: string;
  clarityScore: number;
  starScore: number;
  sentimentScore: number;
  feedback: string;
  hasSituation: boolean;
  hasTask: boolean;
  hasAction: boolean;
  hasResult: boolean;
}

export const insertInterviewScorecardSchema = createInsertSchema(interviewScorecards).omit({ id: true, createdAt: true });
export type InsertInterviewScorecard = z.infer<typeof insertInterviewScorecardSchema>;
export type InterviewScorecard = typeof interviewScorecards.$inferSelect;
