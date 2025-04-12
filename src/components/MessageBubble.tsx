
import React from 'react';
import TypingAnimation from './TypingAnimation';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Bot, Sparkles } from 'lucide-react';

export type MessageType = 'user' | 'ai';

interface MessageBubbleProps {
  type: MessageType;
  content: string;
  isTyping?: boolean;
  onTypingComplete?: () => void;
  timestamp?: Date;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({
  type,
  content,
  isTyping = false,
  onTypingComplete,
  timestamp = new Date(),
}) => {
  // Different styling for user and AI bubbles
  const bubbleClass = cn(
    'px-4 py-2 rounded-t-xl break-words', 
    type === 'user' 
      ? 'bg-primary text-white rounded-bl-xl ml-auto max-w-[90%]' 
      : 'bg-secondary text-foreground rounded-br-xl mr-auto max-w-[75%] relative overflow-hidden'
  );
  
  const containerClass = cn(
    'flex w-full mb-4 items-start gap-2', 
    type === 'user' ? 'justify-end' : 'justify-start'
  );

  const formattedTime = timestamp.toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  });

  return (
    <div className={containerClass}>
      {type === 'ai' && (
        <Avatar className="mt-1">
          <AvatarImage src="/ai-avatar.png" alt="AI" />
          <AvatarFallback className="bg-primary/10 text-primary">
            <Bot size={18} />
          </AvatarFallback>
        </Avatar>
      )}
      
      <div className="flex flex-col items-start">
        <div className={bubbleClass}>
          {type === 'ai' && (
            <div className="absolute inset-0 bg-gradient-to-br from-secondary to-secondary/80 opacity-80 pointer-events-none"></div>
          )}
          
          <div className="relative">
            {type === 'ai' && isTyping ? (
              <TypingAnimation 
                text={content} 
                onComplete={onTypingComplete}
              />
            ) : (
              <span>{content}</span>
            )}
            
            {type === 'ai' && (
              <span className="absolute -top-1 -right-1">
                <Sparkles size={14} className="text-primary/70" />
              </span>
            )}
          </div>
        </div>
        
        <span className={`text-xs text-muted-foreground mt-1 ${type === 'user' ? 'ml-auto' : 'mr-auto'}`}>
          {formattedTime}
        </span>
      </div>
      
      {type === 'user' && (
        <Avatar className="mt-1">
          <AvatarImage src="/user-avatar.png" alt="User" />
          <AvatarFallback className="bg-accent/10 text-accent">
            <User size={18} />
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
};

export default MessageBubble;
