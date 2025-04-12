
import React, { useState, useEffect } from 'react';

interface TypingAnimationProps {
  text: string;
  typingSpeed?: number;
  onComplete?: () => void;
}

const TypingAnimation: React.FC<TypingAnimationProps> = ({ 
  text, 
  typingSpeed = 30,
  onComplete
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    // Reset when text changes
    setDisplayedText('');
    setCurrentIndex(0);
    setIsComplete(false);
  }, [text]);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(prevText => prevText + text[currentIndex]);
        setCurrentIndex(prevIndex => prevIndex + 1);
      }, typingSpeed);
      
      return () => clearTimeout(timeout);
    } else if (!isComplete) {
      setIsComplete(true);
      onComplete?.();
    }
  }, [currentIndex, text, typingSpeed, isComplete, onComplete]);

  return <span>{displayedText}</span>;
};

export default TypingAnimation;
