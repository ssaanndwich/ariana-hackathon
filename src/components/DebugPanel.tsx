import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface DebugPanelProps {
  level: number;
  onLevelChange: (newLevel: number) => void;
}

const DebugPanel: React.FC<DebugPanelProps> = ({ level, onLevelChange }) => {
  return (
    <Card className="p-4">
      <div className="space-y-2">
        <div className="text-sm font-medium mb-2">Debug Controls</div>
        <div className="grid grid-cols-2 gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onLevelChange(Math.min(100, level + 10))}
          >
            +10
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onLevelChange(Math.max(0, level - 10))}
          >
            -10
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onLevelChange(100)}
          >
            Max
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onLevelChange(0)}
          >
            Min
          </Button>
        </div>
        <div className="text-xs text-muted-foreground mt-2">
          Current Level: {level}%
        </div>
      </div>
    </Card>
  );
};

export default DebugPanel; 