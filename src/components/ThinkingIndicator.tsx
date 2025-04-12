
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Bot } from 'lucide-react';

const ThinkingIndicator: React.FC = () => {
  return (
    <div className="flex items-start py-2 gap-2 w-full mb-4">
      <Avatar className="mt-1">
        <AvatarImage src="/ai-avatar.png" alt="AI" />
        <AvatarFallback className="bg-primary/10 text-primary">
          <Bot size={18} />
        </AvatarFallback>
      </Avatar>
      
      <div className="flex items-center py-2 px-3 bg-secondary rounded-t-xl rounded-br-xl max-w-[75%]">
        <span className="thinking-dot"></span>
        <span className="thinking-dot"></span>
        <span className="thinking-dot"></span>
      </div>
    </div>
  );
};

export default ThinkingIndicator;
