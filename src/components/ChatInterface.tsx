import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

import { Mic, MicOff, Send, Heart, MessageSquare, Smile, Zap , Volume2} from 'lucide-react';

import { useToast } from '@/components/ui/use-toast';
import MessageBubble, { MessageType } from './MessageBubble';
import ThinkingIndicator from './ThinkingIndicator';
import NarratorThinkingIndicator from './NarratorThinkingIndicator';
import useSpeechRecognition from '@/hooks/useSpeechRecognition';
import { getGrokResponse, GrokMessage } from '@/lib/grok';
import { speakWithElevenLabs, playAudioQueue } from '@/lib/elevenlabs';

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

  const [isSpeaking, setIsSpeaking] = useState(false);

  const [sanityLevel, setSanityLevel] = useState(75);
  const [responsePreviews, setResponsePreviews] = useState({
    compliment: "You're doing an amazing job! Keep up the great work!",
    distract: "Let's take a quick break and look at some cute cat pictures!",
    joke: "Why don't scientists trust atoms? Because they make up everything!",
    conversation: "I've been thinking about the future of AI. What are your thoughts on this topic?"
  });

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
      // Auto-send message when user stops speaking
      const timeout = setTimeout(() => {
        if (transcript.trim() !== '') {
          handleSendMessage();
        }
      }, 1000); // Wait 1 second after speech ends
      
      return () => clearTimeout(timeout);
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
        
        // Speak the AI's response
        speak(response);
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


  // Start listening when component mounts
  useEffect(() => {
    if (hasRecognitionSupport) {
      startListening();
    }
  }, [hasRecognitionSupport, startListening]);

  // Speak text using ElevenLabs
  const speak = async (text: string) => {
    try {
      setIsSpeaking(true);
      // Stop listening if active
      if (isListening) {
        stopListening();
      }
      
      await speakWithElevenLabs(text, () => {
        // Start listening for user response after AI finishes speaking
        if (hasRecognitionSupport) {
          startListening();
        }
      });
      setIsSpeaking(false);
    } catch (error) {
      console.error('Error speaking with ElevenLabs:', error);
      toast({
        title: 'Voice Synthesis Error',
        description: 'Failed to generate speech. Please try again.',
        variant: 'destructive',
      });
      setIsSpeaking(false);
      // Start listening again if there was an error
      if (hasRecognitionSupport) {
        startListening();
      }
    }
  };

  // Handle play audio button click
  const handlePlayAudio = () => {
    playAudioQueue();
  };

  const generateMessage = (type: 'compliment' | 'distract' | 'joke' | 'conversation'): string => {
    const compliments = [
      "You're doing an amazing job! Your dedication and hard work really show.",
      "I'm impressed by your skills and creativity. You're truly exceptional!",
      "Your positive attitude is contagious! Keep spreading that energy.",
      "You have a unique way of looking at things that's really valuable.",
      "Your progress is remarkable! You should be proud of yourself."
    ];

    const distractions = [
      "Let's take a quick break and look at some cute cat pictures! They always make me smile.",
      "Have you seen the latest viral dance challenge? It's absolutely hilarious!",
      "I just discovered this amazing new song. Want to listen to it together?",
      "Did you know that honey never spoils? Archaeologists have found pots of honey in ancient Egyptian tombs that are over 3,000 years old and still perfectly edible!",
      "Let's play a quick game of rock-paper-scissors! I promise I won't cheat... much."
    ];

    const jokes = [
      "Why don't scientists trust atoms? Because they make up everything!",
      "What do you call a fake noodle? An impasta!",
      "Why did the scarecrow win an award? Because he was outstanding in his field!",
      "What do you call a fish with no eyes? Fsh!",
      "Why did the math book look sad? Because it had too many problems!"
    ];

    const conversationStarters = [
      "I've been thinking about the future of AI. What are your thoughts on how it will shape our lives?",
      "If you could have dinner with any historical figure, who would it be and why?",
      "What's the most interesting thing you've learned recently?",
      "If you could instantly master any skill, what would it be?",
      "What's your favorite way to unwind after a long day?"
    ];

    const messages = {
      compliment: compliments[Math.floor(Math.random() * compliments.length)],
      distract: distractions[Math.floor(Math.random() * distractions.length)],
      joke: jokes[Math.floor(Math.random() * jokes.length)],
      conversation: conversationStarters[Math.floor(Math.random() * conversationStarters.length)]
    };

    return messages[type];
  };

  const handleInteraction = async (type: 'compliment' | 'distract' | 'joke' | 'conversation') => {
    let change = 0;
    switch (type) {
      case 'compliment':
        change = Math.floor(Math.random() * 10) - 5; // -5 to +5
        break;
      case 'distract':
        change = Math.floor(Math.random() * 15) - 10; // -10 to +5
        break;
      case 'joke':
        change = Math.floor(Math.random() * 20) - 10; // -10 to +10
        break;
      case 'conversation':
        change = Math.floor(Math.random() * 30) - 15; // -15 to +15
        break;
    }
    setSanityLevel(prev => Math.max(0, Math.min(100, prev + change)));
    
    // Generate a new message based on the type
    const userMessage = generateMessage(type);
    
    // Update the preview for the next time
    setResponsePreviews(prev => ({
      ...prev,
      [type]: userMessage
    }));
    
    // Add the user message to chat
    const userMessageObj: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: userMessage,
      timestamp: new Date(),
      type: 'user'
    };
    setMessages(prev => [...prev, userMessageObj]);

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
        content: userMessage
      });
      
      // Get response from Grok
      const response = await getGrokResponse(grokMessages);
      
      setIsAiThinking(false);
      setIsAiTyping(true);
      
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
      
      // Speak the AI's response
      speak(response);
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
        <div className="grid grid-cols-2 gap-2 mb-4">
          <Button 
            variant="outline" 
            className="flex flex-col items-start gap-2 p-4 h-auto text-left hover:bg-gray-100"
            onClick={() => handleInteraction('compliment')}
          >
            <div className="flex items-center gap-2 w-full">
              <Heart className="h-5 w-5" />
              <span className="font-medium">Give Compliment</span>
            </div>
            <p className="text-sm text-muted-foreground pl-7 break-words whitespace-normal w-full">{responsePreviews.compliment}</p>
          </Button>
          <Button 
            variant="outline" 
            className="flex flex-col items-start gap-2 p-4 h-auto text-left hover:bg-gray-100"
            onClick={() => handleInteraction('distract')}
          >
            <div className="flex items-center gap-2 w-full">
              <Zap className="h-5 w-5" />
              <span className="font-medium">Distract</span>
            </div>
            <p className="text-sm text-muted-foreground pl-7 break-words whitespace-normal w-full">{responsePreviews.distract}</p>
          </Button>
          <Button 
            variant="outline" 
            className="flex flex-col items-start gap-2 p-4 h-auto text-left hover:bg-gray-100"
            onClick={() => handleInteraction('joke')}
          >
            <div className="flex items-center gap-2 w-full">
              <Smile className="h-5 w-5" />
              <span className="font-medium">Tell a Joke</span>
            </div>
            <p className="text-sm text-muted-foreground pl-7 break-words whitespace-normal w-full">{responsePreviews.joke}</p>
          </Button>
          <Button 
            variant="outline" 
            className="flex flex-col items-start gap-2 p-4 h-auto text-left hover:bg-gray-100"
            onClick={() => handleInteraction('conversation')}
          >
            <div className="flex items-center gap-2 w-full">
              <MessageSquare className="h-5 w-5" />
              <span className="font-medium">Start Conversation</span>
            </div>
            <p className="text-sm text-muted-foreground pl-7 break-words whitespace-normal w-full">{responsePreviews.conversation}</p>
          </Button>
        </div>
        <div className="flex space-x-2">
          <Input
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={isListening ? "Listening..." : "Type your message..."}
            className="flex-1"
            disabled={isAiThinking || isSpeaking}
          />
          <Button
            variant="outline"
            size="icon"
            onClick={handleMicToggle}
            className={isListening ? 'bg-primary text-white' : ''}
            disabled={isAiThinking || isSpeaking || !hasRecognitionSupport}
          >
            {isListening ? <MicOff size={18} /> : <Mic size={18} />}
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={handlePlayAudio}
            disabled={isAiThinking || isSpeaking}
          >
            <Volume2 size={18} />
          </Button>
          <Button
            onClick={handleSendMessage}
            disabled={inputValue.trim() === '' || isAiThinking || isSpeaking}
          >
            <Send size={18} />
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ChatInterface;
