import React, { useState } from 'react';
import ChatInterface from '@/components/ChatInterface';
import RightPanel from '@/components/RightPanel';

const Index = () => {
  const [sanityLevel, setSanityLevel] = useState(75);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Cooldown
          </h1>
          <p className="mt-2 text-muted-foreground">
            A voice de-escalation game
          </p>
        </div>
        
        <div className="flex gap-4">
          <div className="w-2/4">
            <ChatInterface sanityLevel={sanityLevel} onSanityLevelChange={setSanityLevel} />
          </div>
          <div className="w-3/4">
            <RightPanel sanityLevel={sanityLevel} onSanityLevelChange={setSanityLevel} />
          </div>
        </div>
        
        <footer className="mt-8 text-sm text-muted-foreground text-center">
          <p>© 2025 Ariana dev</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
