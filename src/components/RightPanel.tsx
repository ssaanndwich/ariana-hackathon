import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, MessageSquare, Smile, Zap } from 'lucide-react';
import SanityLevel from './SanityLevel';
import DebugPanel from './DebugPanel';

const RightPanel: React.FC = () => {
  const [sanityLevel, setSanityLevel] = useState(75);
  const [responsePreviews, setResponsePreviews] = useState({
    compliment: "You're doing an amazing job! Keep up the great work!",
    distract: "Let's take a quick break and look at some cute cat pictures!",
    joke: "Why don't scientists trust atoms? Because they make up everything!",
    conversation: "I've been thinking about the future of AI. What are your thoughts on this topic?"
  });

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
        <div className="flex items-start gap-8">
          <div className="w-[600px] space-y-4">
            <Button 
              variant="outline" 
              className="w-full flex flex-col items-start gap-2 p-6 h-auto text-left hover:bg-gray-100"
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
              className="w-full flex flex-col items-start gap-2 p-6 h-auto text-left hover:bg-gray-100"
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
              className="w-full flex flex-col items-start gap-2 p-6 h-auto text-left hover:bg-gray-100"
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
              className="w-full flex flex-col items-start gap-2 p-6 h-auto text-left hover:bg-gray-100"
              onClick={() => handleInteraction('conversation')}
            >
              <div className="flex items-center gap-2 w-full">
                <MessageSquare className="h-5 w-5" />
                <span className="font-medium">Start Conversation</span>
              </div>
              <p className="text-sm text-muted-foreground pl-7 break-words whitespace-normal w-full">{responsePreviews.conversation}</p>
            </Button>
          </div>
          <div className="w-[200px] h-[200px] flex justify-end">
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