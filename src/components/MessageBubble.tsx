import React from 'react';
import TypingAnimation from './TypingAnimation';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Bot, Sparkles, Settings } from 'lucide-react';

export type MessageType = 'user' | 'ai';
export type MessageRole = 'user' | 'assistant' | 'narrator';

// Function to get a random assistant avatar
const getRandomAssistantAvatar = () => {
  const randomNum = Math.floor(Math.random() * 5) + 1;
  return `/images/${randomNum}.png`;
};

interface MessageBubbleProps {
  type: MessageType;
  role: MessageRole;
  content: string;
  isTyping?: boolean;
  onTypingComplete?: () => void;
  timestamp?: Date;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({
  type,
  role,
  content,
  isTyping = false,
  onTypingComplete,
  timestamp = new Date(),
}) => {
  // Different styling based on role
  const bubbleClass = cn(
    'px-4 py-2 rounded-t-xl break-words', 
    role === 'user' 
      ? 'bg-primary text-white rounded-bl-xl ml-auto w-full max-w-[90%]' 
      : role === 'assistant'
      ? 'bg-secondary text-foreground rounded-br-xl mr-auto w-full max-w-[90%] relative overflow-hidden'
      : role === 'narrator'
      ? 'text-muted-foreground w-full'
      : 'bg-muted text-muted-foreground rounded-xl mx-auto w-full max-w-[90%] text-center'
  );
  
  const containerClass = cn(
    'flex w-full mb-4 items-start gap-2', 
    role === 'user' 
      ? 'justify-end' 
      : role === 'assistant'
      ? 'justify-start'
      : 'justify-start'
  );

  const formattedTime = timestamp.toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  });

  // For narrator messages, we don't want to show avatars or bubbles
  if (role === 'narrator') {
    return (
      <div className={containerClass}>
        <div className={bubbleClass}>
          {isTyping ? (
            <div className="flex justify-center gap-2">
              <span className="thinking-dot"></span>
              <span className="thinking-dot"></span>
              <span className="thinking-dot"></span>
            </div>
          ) : (
            <span>{content}</span>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={containerClass}>
      {role === 'assistant' && !isTyping && (
        <Avatar className="mt-1 h-20 w-20">
          <AvatarImage src={getRandomAssistantAvatar()} alt="AI" />
          <AvatarFallback className="bg-primary/10 text-primary">
            <Bot size={32} />
          </AvatarFallback>
        </Avatar>
      )}
      
      <div className="flex flex-col items-start">
        <div className={bubbleClass}>
          {role === 'assistant' && (
            <div className="absolute inset-0 bg-gradient-to-br from-secondary to-secondary/80 opacity-50 pointer-events-none"></div>
          )}
          
          <div className="relative z-10">
            {role === 'assistant' && isTyping ? (
              <TypingAnimation 
                text={content} 
                onComplete={onTypingComplete}
              />
            ) : (
              <span>{content}</span>
            )}
            
            {role === 'assistant' && (
              <span className="absolute -top-1 -right-1">
                <Sparkles size={14} className="text-primary/70" />
              </span>
            )}
          </div>
        </div>
        
        {(role === 'user' || role === 'assistant') && (
          <span className={`text-xs text-muted-foreground mt-1 ${role === 'user' ? 'ml-auto' : 'mr-auto'}`}>
            {formattedTime}
          </span>
        )}
      </div>
      
      {role === 'user' && (
        <Avatar className="mt-1 h-16 w-16">
          <AvatarImage src="/user-avatar.png" alt="User" />
          <AvatarFallback className="bg-accent/10 text-accent">
            <User size={32} />
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
};

export default MessageBubble;
