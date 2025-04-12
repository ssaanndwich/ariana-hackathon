import React from 'react';

const NarratorThinkingIndicator: React.FC = () => {
  return (
    <div className="w-full py-4">
      <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-muted/30">
        <div className="flex space-x-1">
          <div className="w-1.5 h-1.5 bg-primary/70 rounded-full animate-pulse" style={{ animationDelay: '0ms' }} />
          <div className="w-1.5 h-1.5 bg-primary/70 rounded-full animate-pulse" style={{ animationDelay: '200ms' }} />
          <div className="w-1.5 h-1.5 bg-primary/70 rounded-full animate-pulse" style={{ animationDelay: '400ms' }} />
        </div>
        <span className="text-sm text-muted-foreground italic">Setting the scene...</span>
      </div>
    </div>
  );
};

export default NarratorThinkingIndicator; 