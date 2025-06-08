
import { useContext } from 'react';
import { AccentColorContext } from '../contexts/AccentColorContext';
import { AccentColorContextType } from '../types'; // Corrected import path


export const useAccentColor = (): AccentColorContextType => {
  const context = useContext(AccentColorContext);
  if (context === undefined) {
    throw new Error('useAccentColor must be used within an AccentColorProvider');
  }
  return context;
};
