import { useContext } from 'react';
import { CompetitionContext } from '../contexts/CompetitionContext';

export const useCompetition = () => {
  const context = useContext(CompetitionContext);
  if (context === undefined) {
    throw new Error('useCompetition must be used within a CompetitionProvider');
  }
  return context;
};