import { useState, useCallback, useRef } from 'react';

function speakWithBrowser(text: string, onEnd: () => void): () => void {
  if (!window.speechSynthesis) { onEnd(); return () => {}; }
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 1.0;
  utterance.pitch = 1.0;
  utterance.onend = onEnd;
  utterance.onerror = onEnd;
  window.speechSynthesis.speak(utterance);
  return () => window.speechSynthesis.cancel();
}

export function useTextToSpeech() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const cancelBrowserRef = useRef<(() => void) | null>(null);
  const cache = useRef<Map<string, string>>(new Map());

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    if (cancelBrowserRef.current) {
      cancelBrowserRef.current();
      cancelBrowserRef.current = null;
    }
    setIsSpeaking(false);
  }, []);

  const fetchAndCache = useCallback(async (text: string): Promise<string | null> => {
    try {
      const res = await fetch('/api/interviews/speak', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, voice: 'alloy' }),
      });
      if (!res.ok) return null;
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      cache.current.set(text, url);
      return url;
    } catch {
      return null;
    }
  }, []);

  // Call this when a question becomes visible — fires in background so speak() is instant
  const preload = useCallback((text: string) => {
    if (cache.current.has(text)) return;
    fetchAndCache(text);
  }, [fetchAndCache]);

  const speak = useCallback(async (text: string) => {
    stop();
    setIsSpeaking(true);

    const url = cache.current.get(text) ?? await fetchAndCache(text);

    if (url) {
      const audio = new Audio(url);
      audioRef.current = audio;
      audio.onended = () => setIsSpeaking(false);
      audio.onerror = () => {
        cancelBrowserRef.current = speakWithBrowser(text, () => setIsSpeaking(false));
      };
      await audio.play();
    } else {
      cancelBrowserRef.current = speakWithBrowser(text, () => setIsSpeaking(false));
    }
  }, [stop, fetchAndCache]);

  return { speak, stop, isSpeaking, preload };
}
