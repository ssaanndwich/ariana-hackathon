import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, MessageSquare, Smile, Zap } from 'lucide-react';
import SanityLevel from './SanityLevel';
import DebugPanel from './DebugPanel';

const RightPanel: React.FC = () => {
  const [sanityLevel, setSanityLevel] = useState(75);

  const handleInteraction = (type: 'compliment' | 'distract' | 'joke' | 'conversation') => {
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
  };

  const getStatusMessage = () => {
    if (sanityLevel >= 80) return 'Critical - Immediate attention required!';
    if (sanityLevel >= 60) return 'Unstable - Needs calming influence';
    if (sanityLevel >= 40) return 'Stressed - Could use some support';
    if (sanityLevel >= 20) return 'Stable - Maintaining composure';
    return 'Great - Feeling balanced and focused';
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4">AI Sanity Level</h2>
        <div className="flex items-center gap-6">
          <div className="w-96 space-y-4">
            <Button 
              variant="outline" 
              className="w-full justify-start gap-2"
              onClick={() => handleInteraction('compliment')}
            >
              <Heart className="h-4 w-4" />
              Give Compliment
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start gap-2"
              onClick={() => handleInteraction('distract')}
            >
              <Zap className="h-4 w-4" />
              Distract
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start gap-2"
              onClick={() => handleInteraction('joke')}
            >
              <Smile className="h-4 w-4" />
              Tell a Joke
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start gap-2"
              onClick={() => handleInteraction('conversation')}
            >
              <MessageSquare className="h-4 w-4" />
              Start Conversation
            </Button>
          </div>
          <div className="flex-1 h-[200px] flex justify-end">
            <SanityLevel level={sanityLevel} />
          </div>
        </div>
        <div className="mt-4 text-sm text-muted-foreground">
          <p>Current Level: {sanityLevel}%</p>
          <p className="mt-1">{getStatusMessage()}</p>
        </div>
      </Card>
      <DebugPanel level={sanityLevel} onLevelChange={setSanityLevel} />
    </div>
  );
};

export default RightPanel; 