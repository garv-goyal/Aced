import { useState, useEffect, useRef, useCallback } from 'react';

export function useSpeechRecognition() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;

        recognitionRef.current.onresult = (event: any) => {
          let currentTranscript = '';
          let currentInterim = '';
          
          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcriptSegment = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              currentTranscript += transcriptSegment;
            } else {
              currentInterim += transcriptSegment;
            }
          }
          
          if (currentTranscript) {
             setTranscript(prev => prev + (prev ? ' ' : '') + currentTranscript);
          }
          setInterimTranscript(currentInterim);
        };

        recognitionRef.current.onerror = (event: any) => {
          console.error('Speech recognition error', event.error);
          setIsListening(false);
        };

        recognitionRef.current.onend = () => {
          setIsListening(false);
          setInterimTranscript('');
        };
      }
    }
  }, []);

  const startListening = useCallback(() => {
    setTranscript('');
    setInterimTranscript('');
    setIsListening(true);
    try {
      recognitionRef.current?.start();
    } catch (e) {
      console.error(e);
    }
  }, []);

  const stopListening = useCallback(() => {
    setIsListening(false);
    recognitionRef.current?.stop();
  }, []);

  const resetTranscript = useCallback(() => {
    setTranscript('');
    setInterimTranscript('');
  }, []);

  return {
    isListening,
    transcript,
    interimTranscript,
    startListening,
    stopListening,
    resetTranscript,
    hasSupport: !!recognitionRef.current
  };
}
