import { useState, useEffect, useRef } from 'react';

interface UseTypingEffectProps {
  text: string;
  speed?: number;
  startDelay?: number;
}

export const useTypingEffect = ({ text, speed = 20, startDelay = 0 }: UseTypingEffectProps) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const indexRef = useRef(0);
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    setDisplayedText('');
    setIsTyping(false);
    setIsComplete(false);
    indexRef.current = 0;

    if (!text) return;

    const startTyping = () => {
      setIsTyping(true);
      
      const typeChar = () => {
        if (indexRef.current < text.length) {
          setDisplayedText(text.slice(0, indexRef.current + 1));
          indexRef.current++;
          timeoutRef.current = setTimeout(typeChar, speed);
        } else {
          setIsTyping(false);
          setIsComplete(true);
        }
      };

      typeChar();
    };

    timeoutRef.current = setTimeout(startTyping, startDelay);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [text, speed, startDelay]);

  return { displayedText, isTyping, isComplete };
};