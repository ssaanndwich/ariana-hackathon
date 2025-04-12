import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Mic, MicOff, Send } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import MessageBubble, { MessageType } from './MessageBubble';
import ThinkingIndicator from './ThinkingIndicator';
import NarratorThinkingIndicator from './NarratorThinkingIndicator';
import useSpeechRecognition from '@/hooks/useSpeechRecognition';
import { getGrokResponse, GrokMessage } from '@/lib/grok';

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'narrator';
  content: string;
  timestamp: Date;
  type: MessageType;
}

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'narrator',
      content: 'The scene opens in a quiet coffee shop...',
      timestamp: new Date(),
      type: 'ai'
    },
    {
      id: '2',
      role: 'user',
      content: 'Hey, what station do I need to take to get to that party place?',
      timestamp: new Date(),
      type: 'ai'
    },
    {
      id: '3',
      role: 'assistant',
      content: 'What are you doing?',
      timestamp: new Date(),
      type: 'ai'
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
    
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date(),
      type: 'user'
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    
    // Simulate AI thinking
    setIsAiThinking(true);
    
    try {
      // Prepare messages for Grok
      const grokMessages: GrokMessage[] = messages
        .filter(msg => msg.role !== 'narrator')
        .map(msg => ({
          role: msg.role as 'user' | 'assistant',
          content: msg.content
        }));
      
      grokMessages.push({
        role: 'user',
        content: inputValue
      });
      
      // Get response from Grok
      const response = await getGrokResponse(grokMessages);
      
      setIsAiThinking(false);
      setIsAiTyping(true);
      
      // Check if user wants to narrate
      if (inputValue.toLowerCase().includes('narrate')) {
        const narratorResponse: Message = {
          id: (Date.now() + 1).toString(),
          role: 'narrator',
          content: getNarratorResponse(inputValue),
          timestamp: new Date(),
          type: 'ai'
        };
        setMessages(prev => [...prev, narratorResponse]);
        setIsAiTyping(false);
      } else {
        // Add AI response
        const aiResponse: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: response,
          timestamp: new Date(),
          type: 'ai'
        };
        setMessages(prev => [...prev, aiResponse]);
        setIsAiTyping(false);
      }
    } catch (error) {
      console.error('Error getting Grok response:', error);
      toast({
        title: 'Error',
        description: 'Failed to get response from AI. Please try again.',
        variant: 'destructive',
      });
      setIsAiThinking(false);
    }
  };

  // Mock narrator response generator (kept for backward compatibility)
  const getNarratorResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    if (input.includes('forest')) {
      return 'The trees rustle in the wind as a mysterious figure emerges from the shadows...';
    } else if (input.includes('city')) {
      return 'The neon lights of the city flicker as rain begins to fall on the empty streets...';
    } else if (input.includes('beach')) {
      return 'Waves crash against the shore as the sun begins to set over the horizon...';
    } else if (input.includes('space')) {
      return 'Stars twinkle in the vast emptiness of space as a lone spaceship drifts by...';
    } else {
      return 'The scene shifts to a new location, filled with possibilities...';
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
            role={message.role}
            content={message.content}
            isTyping={message.type === 'ai' && isAiTyping && message.id === messages[messages.length - 1].id && message.role !== 'narrator'}
            onTypingComplete={() => setIsAiTyping(false)}
            timestamp={message.timestamp}
          />
        ))}
        {isAiThinking && messages[messages.length - 1]?.role === 'narrator' ? (
          <NarratorThinkingIndicator />
        ) : isAiThinking ? (
          <div className="self-start">
            <ThinkingIndicator />
          </div>
        ) : null}
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
