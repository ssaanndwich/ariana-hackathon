
import React from 'react';
import TypingAnimation from './TypingAnimation';
import { cn } from '@/lib/utils';

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
  const bubbleClass = cn(
    'max-w-[80%] px-4 py-2 rounded-t-xl break-words', 
    type === 'user' 
      ? 'bg-primary text-white rounded-bl-xl ml-auto' 
      : 'bg-secondary text-foreground rounded-br-xl mr-auto'
  );
  
  const containerClass = cn(
    'flex w-full mb-4', 
    type === 'user' ? 'justify-end' : 'justify-start'
  );

  const formattedTime = timestamp.toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  });

  return (
    <div className={containerClass}>
      <div className="flex flex-col items-start max-w-[80%]">
        <div className={bubbleClass}>
          {type === 'ai' && isTyping ? (
            <TypingAnimation 
              text={content} 
              onComplete={onTypingComplete}
            />
          ) : (
            <span>{content}</span>
          )}
        </div>
        <span className={`text-xs text-muted-foreground mt-1 ${type === 'user' ? 'ml-auto' : 'mr-auto'}`}>
          {formattedTime}
        </span>
      </div>
    </div>
  );
};

export default MessageBubble;
