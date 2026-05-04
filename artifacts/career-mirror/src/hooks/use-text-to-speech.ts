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

  const speak = useCallback(async (text: string) => {
    stop();
    setIsSpeaking(true);

    try {
      const response = await fetch('/api/interviews/speak', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, voice: 'alloy' })
      });

      if (!response.ok) throw new Error('TTS server unavailable');

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audioRef.current = audio;

      audio.onended = () => { setIsSpeaking(false); URL.revokeObjectURL(url); };
      audio.onerror = () => {
        URL.revokeObjectURL(url);
        cancelBrowserRef.current = speakWithBrowser(text, () => setIsSpeaking(false));
      };

      await audio.play();
    } catch {
      // Server TTS unavailable — fall back to browser SpeechSynthesis
      cancelBrowserRef.current = speakWithBrowser(text, () => setIsSpeaking(false));
    }
  }, [stop]);

  return { speak, stop, isSpeaking };
}
