import React from 'react';
import { Card } from '@/components/ui/card';
import SanityLevel from './SanityLevel';
import DebugPanel from './DebugPanel';

interface RightPanelProps {
  sanityLevel: number;
  onSanityLevelChange: (level: number) => void;
}

const RightPanel: React.FC<RightPanelProps> = ({ sanityLevel, onSanityLevelChange }) => {
  const getStatusMessage = () => {
    if (sanityLevel >= 80) return 'Critical - Immediate attention required!';
    if (sanityLevel >= 60) return 'Unstable - Needs calming influence';
    if (sanityLevel >= 40) return 'Stressed - Could use some support';
    if (sanityLevel >= 20) return 'Stable - Maintaining composure';
    return 'Great - Feeling balanced and focused';
  };

  const getImageBasedOnSanity = () => {
    if (sanityLevel >= 80) return '/images/5.png';
    if (sanityLevel >= 60) return '/images/4.png';
    if (sanityLevel >= 40) return '/images/3.png';
    if (sanityLevel >= 20) return '/images/2.png';
    return '/images/1.png';
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4">AI Sanity Level</h2>
        <div className="flex items-center gap-6">
          <div className="flex-shrink-0 mr-10">
            <img src={getImageBasedOnSanity()} alt="AI" className="w-[35rem]" />
          </div>
          <div className="flex-1">
            <SanityLevel level={sanityLevel} />
          </div>
        </div>
        <div className="mt-4 text-sm text-muted-foreground text-right">
          <p>Current Level: {sanityLevel}%</p>
        </div>
      </Card>
      <DebugPanel level={sanityLevel} onLevelChange={onSanityLevelChange} />
    </div>
  );
};

export default RightPanel; 