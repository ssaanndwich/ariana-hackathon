
import { useState, useEffect, useCallback } from 'react';

// Define SpeechRecognition interface to fix TypeScript errors
interface SpeechRecognitionEvent {
  resultIndex: number;
  results: {
    [key: number]: {
      [key: number]: {
        transcript: string;
      };
    };
  };
}

interface SpeechRecognitionErrorEvent {
  error: string;
}

interface SpeechRecognitionInterface extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: SpeechRecognitionErrorEvent) => void;
  start: () => void;
  stop: () => void;
}

declare global {
  interface Window {
    SpeechRecognition?: new () => SpeechRecognitionInterface;
    webkitSpeechRecognition?: new () => SpeechRecognitionInterface;
  }
}

interface SpeechRecognitionHook {
  transcript: string;
  isListening: boolean;
  startListening: () => void;
  stopListening: () => void;
  hasRecognitionSupport: boolean;
  error: string | null;
}

const useSpeechRecognition = (): SpeechRecognitionHook => {
  const [transcript, setTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Check if browser supports speech recognition
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const hasRecognitionSupport = !!SpeechRecognition;
  
  let recognitionInstance: SpeechRecognitionInterface | null = null;
  
  // Initialize recognition
  useEffect(() => {
    if (!hasRecognitionSupport) return;
    
    recognitionInstance = new SpeechRecognition();
    recognitionInstance.continuous = true;
    recognitionInstance.interimResults = true;
    recognitionInstance.lang = 'en-US';
    
    recognitionInstance.onresult = (event: SpeechRecognitionEvent) => {
      const current = event.resultIndex;
      const transcriptText = event.results[current][0].transcript;
      setTranscript(transcriptText);
    };
    
    recognitionInstance.onerror = (event: SpeechRecognitionErrorEvent) => {
      setError(`Speech recognition error: ${event.error}`);
      setIsListening(false);
    };
    
    return () => {
      if (recognitionInstance) {
        recognitionInstance.stop();
      }
    };
  }, [hasRecognitionSupport]);
  
  const startListening = useCallback(() => {
    setError(null);
    setTranscript('');
    setIsListening(true);
    
    try {
      if (recognitionInstance) {
        recognitionInstance.start();
      } else if (hasRecognitionSupport) {
        // Reinitialize if needed
        const RecognitionConstructor = SpeechRecognition as new () => SpeechRecognitionInterface;
        recognitionInstance = new RecognitionConstructor();
        recognitionInstance.continuous = true;
        recognitionInstance.interimResults = true;
        recognitionInstance.lang = 'en-US';
        
        recognitionInstance.onresult = (event: SpeechRecognitionEvent) => {
          const current = event.resultIndex;
          const transcriptText = event.results[current][0].transcript;
          setTranscript(transcriptText);
        };
        
        recognitionInstance.onerror = (event: SpeechRecognitionErrorEvent) => {
          setError(`Speech recognition error: ${event.error}`);
          setIsListening(false);
        };
        
        recognitionInstance.start();
      }
    } catch (error) {
      setError(`Could not start speech recognition: ${error}`);
      setIsListening(false);
    }
  }, [hasRecognitionSupport]);
  
  const stopListening = useCallback(() => {
    setIsListening(false);
    
    if (recognitionInstance) {
      recognitionInstance.stop();
    }
  }, []);
  
  return {
    transcript,
    isListening,
    startListening,
    stopListening,
    hasRecognitionSupport,
    error
  };
};

export default useSpeechRecognition;
