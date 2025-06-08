import React, { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { AccentColor, AccentColorContextType } from '../types';
import { ACCENT_COLORS } from '../constants';

const defaultAccent = ACCENT_COLORS.find(c => c.name === 'Default Blue') || ACCENT_COLORS[0];

export const AccentColorContext = createContext<AccentColorContextType | undefined>(undefined);

export const AccentColorProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [accentColor, setAccentColor] = useState<AccentColor>(() => {
    const storedAccentName = localStorage.getItem('accentColorName');
    return ACCENT_COLORS.find(c => c.name === storedAccentName) || defaultAccent;
  });

  const applyAccentColorToDOM = useCallback((color: AccentColor) => {
    const root = window.document.documentElement;
    root.style.setProperty('--color-primary-500', color.primary500);
    root.style.setProperty('--color-primary-600', color.primary600);
    root.style.setProperty('--color-primary-700', color.primary700);
    root.style.setProperty('--ring-color-primary', color.ring);
    
    // For Tailwind JIT to pick up dynamic classes if needed (might not be necessary with CSS vars)
    // root.classList.forEach(className => {
    //   if (className.startsWith('theme-accent-')) {
    //     root.classList.remove(className);
    //   }
    // });
    // root.classList.add(`theme-accent-${color.cssVariableSuffix}`);

  }, []);

  useEffect(() => {
    applyAccentColorToDOM(accentColor);
    localStorage.setItem('accentColorName', accentColor.name);
  }, [accentColor, applyAccentColorToDOM]);

  const setAccentColorByName = (name: string) => {
    const newAccent = ACCENT_COLORS.find(c => c.name === name);
    if (newAccent) {
      setAccentColor(newAccent);
    }
  };

  return (
    <AccentColorContext.Provider value={{ accentColor, setAccentColorByName }}>
      {children}
    </AccentColorContext.Provider>
  );
};