
import React from 'react';

const ThinkingIndicator: React.FC = () => {
  return (
    <div className="flex items-center py-2 px-3 bg-secondary rounded-t-xl rounded-br-xl max-w-[80%]">
      <span className="thinking-dot"></span>
      <span className="thinking-dot"></span>
      <span className="thinking-dot"></span>
    </div>
  );
};

export default ThinkingIndicator;
