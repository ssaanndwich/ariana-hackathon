
import React from 'react';
import TypingAnimation from './TypingAnimation';

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
  const bubbleClass = type === 'user' ? 'chat-bubble-user' : 'chat-bubble-ai';
  const alignmentClass = type === 'user' ? 'self-end' : 'self-start';
  
  const formattedTime = timestamp.toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  });

  return (
    <div className={`flex flex-col ${alignmentClass} mb-4 max-w-[80%]`}>
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
      <span className="text-xs text-muted-foreground mt-1 px-1">
        {formattedTime}
      </span>
    </div>
  );
};

export default MessageBubble;
