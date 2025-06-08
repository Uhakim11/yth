import React, { useState, useEffect } from 'react';

interface AnimatedTextProps {
  text: string;
  animationType?: 'letter-reveal' | 'word-slide-in' | 'typewriter';
  staggerDelay?: number; // ms, for letter-reveal or word-slide-in
  className?: string;
  wordClassName?: string; // For word-slide-in
  letterClassName?: string; // For letter-reveal
  speed?: number; // For typewriter
}

const AnimatedText: React.FC<AnimatedTextProps> = ({
  text,
  animationType = 'letter-reveal',
  staggerDelay = 50,
  className = '',
  wordClassName = '',
  letterClassName = '',
  speed = 70
}) => {
  if (animationType === 'typewriter') {
    // Basic Typewriter (can be enhanced from existing TypewriterText or use a library)
    // For simplicity, reusing the idea. If TypewriterText.tsx is complex, integrate it.
    const [currentDisplayedText, setCurrentDisplayedText] = useState(''); // Renamed to avoid conflict if React was also named displayedText
    useEffect(() => {
      let i = 0;
      setCurrentDisplayedText('');
      const interval = setInterval(() => {
        if (i < text.length) {
          setCurrentDisplayedText(prev => prev + text[i]);
          i++;
        } else {
          clearInterval(interval);
        }
      }, speed);
      return () => clearInterval(interval);
    }, [text, speed]);
    return <span className={className}>{currentDisplayedText}</span>;
  }

  const words = animationType === 'word-slide-in' ? text.split(' ') : [];
  const letters = animationType === 'letter-reveal' ? text.split('') : [];

  return (
    <span className={`${className} inline-block`} aria-label={text}>
      {animationType === 'word-slide-in' && words.map((word, wordIndex) => (
        <span
          key={`${word}-${wordIndex}`}
          className={`inline-block overflow-hidden ${wordClassName}`}
          aria-hidden="true"
        >
          <span
            className="inline-block animate-wordSlideIn"
            style={{ animationDelay: `${wordIndex * staggerDelay}ms` }}
          >
            {word}&nbsp; {/* Add space between words */}
          </span>
        </span>
      ))}
      {animationType === 'letter-reveal' && letters.map((letter, letterIndex) => (
        letter === ' ' ? <span key={`space-${letterIndex}`}>&nbsp;</span> :
        <span
          key={`${letter}-${letterIndex}`}
          className={`inline-block animate-letterReveal ${letterClassName}`}
          style={{ animationDelay: `${letterIndex * staggerDelay}ms` }}
          aria-hidden="true"
        >
          {letter}
        </span>
      ))}
    </span>
  );
};

export default AnimatedText;