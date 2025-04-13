import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Bot } from 'lucide-react';

interface ThinkingIndicatorProps {
  sanityLevel?: number;
}

const getAssistantAvatar = (sanityLevel: number) => {
  if (sanityLevel >= 80) return '/images/5.png';
  if (sanityLevel >= 60) return '/images/4.png';
  if (sanityLevel >= 40) return '/images/3.png';
  if (sanityLevel >= 20) return '/images/2.png';
  return '/images/1.png';
};

const ThinkingIndicator: React.FC<ThinkingIndicatorProps> = ({ sanityLevel = 75 }) => {
  return (
    <div className="flex items-start py-2 gap-2 w-full mb-4">
      <Avatar className="mt-1 h-16 w-16">
        <AvatarImage src={getAssistantAvatar(sanityLevel)} alt="AI" />
        <AvatarFallback className="bg-primary/10 text-primary">
          <Bot size={32} />
        </AvatarFallback>
      </Avatar>
      
      <div className="flex items-center py-2 px-3 bg-secondary rounded-t-xl rounded-br-xl w-full max-w-[90%] relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-secondary/80 to-secondary opacity-50"></div>
        <div className="relative z-10 flex">
          <span className="thinking-dot"></span>
          <span className="thinking-dot"></span>
          <span className="thinking-dot"></span>
        </div>
      </div>
    </div>
  );
};

export default ThinkingIndicator;
