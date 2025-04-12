import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Mic, MicOff, Send } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import MessageBubble, { MessageType } from './MessageBubble';
import ThinkingIndicator from './ThinkingIndicator';
import useSpeechRecognition from '@/hooks/useSpeechRecognition';

interface Message {
  id: string;
  type: MessageType;
  content: string;
  timestamp: Date;
}

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: 'Hello! I\'m your AI assistant. How can I help you today?',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [isAiThinking, setIsAiThinking] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  const {
    transcript,
    isListening,
    startListening,
    stopListening,
    hasRecognitionSupport,
    error
  } = useSpeechRecognition();
  
  // Update input value with speech transcript
  useEffect(() => {
    if (transcript) {
      setInputValue(transcript);
    }
  }, [transcript]);
  
  // Show error toast if speech recognition fails
  useEffect(() => {
    if (error) {
      toast({
        title: 'Speech Recognition Error',
        description: error,
        variant: 'destructive',
      });
    }
  }, [error, toast]);
  
  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isAiThinking]);
  
  // Handle sending a message
  const handleSendMessage = async () => {
    if (inputValue.trim() === '') return;
    
    // Stop listening if active
    if (isListening) {
      stopListening();
    }
    
    const userMessage = {
      id: Date.now().toString(),
      type: 'user' as MessageType,
      content: inputValue,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    
    // Simulate AI thinking
    setIsAiThinking(true);
    
    // Simulate AI response delay
    setTimeout(() => {
      setIsAiThinking(false);
      setIsAiTyping(true);
      
      // Add AI response
      const aiResponse = {
        id: (Date.now() + 1).toString(),
        type: 'ai' as MessageType,
        content: getAIResponse(inputValue),
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, aiResponse]);
    }, 1500);
  };

  // Mock AI response generator
  const getAIResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    if (input.includes('hello') || input.includes('hi')) {
      return 'Hello there! How can I assist you today?';
    } else if (input.includes('how are you')) {
      return 'I\'m just a program, but I\'m functioning well! How can I help you?';
    } else if (input.includes('name')) {
      return 'I\'m an AI assistant created to help you with your questions and tasks.';
    } else if (input.includes('thank')) {
      return 'You\'re welcome! If you need anything else, just ask.';
    } else if (input.includes('weather')) {
      return 'I don\'t have access to real-time weather data, but I can recommend checking a weather app or website for the most accurate forecast.';
    } else if (input.includes('joke')) {
      return 'Why don\'t scientists trust atoms? Because they make up everything!';
    } else {
      return 'That\'s an interesting question. While I\'m just a simple demo at the moment, a more advanced AI could provide a detailed response to your query.';
    }
  };
  
  // Handle input key press (Enter to send)
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };
  
  // Handle microphone toggle
  const handleMicToggle = () => {
    if (isListening) {
      stopListening();
    } else {
      if (hasRecognitionSupport) {
        startListening();
      } else {
        toast({
          title: 'Speech Recognition Not Supported',
          description: 'Your browser does not support speech recognition.',
          variant: 'destructive',
        });
      }
    }
  };

  return (
    <Card className="flex flex-col h-[calc(100vh-12rem)] overflow-hidden">
      <div className="flex-1 overflow-y-auto p-4 space-y-2" style={{ scrollbarWidth: 'thin' }}>
        {messages.map((message) => (
          <MessageBubble
            key={message.id}
            type={message.type}
            content={message.content}
            isTyping={message.type === 'ai' && isAiTyping && message.id === messages[messages.length - 1].id}
            onTypingComplete={() => setIsAiTyping(false)}
            timestamp={message.timestamp}
          />
        ))}
        {isAiThinking && (
          <div className="self-start">
            <ThinkingIndicator />
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="p-4 border-t">
        <div className="flex space-x-2">
          <Input
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="flex-1"
            disabled={isAiThinking}
          />
          <Button
            variant="outline"
            size="icon"
            onClick={handleMicToggle}
            className={isListening ? 'bg-primary text-white' : ''}
            disabled={isAiThinking || !hasRecognitionSupport}
          >
            {isListening ? <MicOff size={18} /> : <Mic size={18} />}
          </Button>
          <Button
            onClick={handleSendMessage}
            disabled={inputValue.trim() === '' || isAiThinking}
          >
            <Send size={18} />
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ChatInterface;
