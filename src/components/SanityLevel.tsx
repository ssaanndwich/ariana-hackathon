import React from 'react';
import { Card } from '@/components/ui/card';

interface SanityLevelProps {
  level: number; // 0 to 100
}

const SanityLevel: React.FC<SanityLevelProps> = ({ level }) => {
  const levels = [
    { color: 'bg-green-500', label: 'Critical', threshold: 20 },
    { color: 'bg-yellow-500', label: 'Stressed', threshold: 40 },
    { color: 'bg-orange-500', label: 'Unstable', threshold: 60 },
    { color: 'bg-red-500', label: 'Stable', threshold: 80 },
    { color: 'bg-red-700', label: 'Great', threshold: 100 },
  ];

  const currentLevel = levels.find(l => level <= l.threshold) || levels[levels.length - 1];
  const isCritical = level >= 80;
  const isUnstable = level >= 60;

  return (
    <div className="relative h-[200px] w-8">
      <div className="absolute inset-0 bg-gray-200 rounded-full" />
      <div className={`absolute inset-0 overflow-hidden rounded-full ${isCritical ? 'animate-shake' : ''}`}>
        <div 
          className={`absolute bottom-0 left-0 right-0 ${currentLevel.color} transition-all duration-300`}
          style={{ 
            height: `${level}%`,
          }}
        />
      </div>
      <div className="absolute -left-24 top-0 bottom-0 flex flex-col justify-between">
        {levels.map((level, index) => (
          <div 
            key={index} 
            className="text-xs text-muted-foreground whitespace-nowrap"
            style={{
              marginTop: index === 0 ? '0' : '-0.5rem',
              marginBottom: index === levels.length - 1 ? '0' : '-0.5rem',
            }}
          >
            {level.label}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SanityLevel; 