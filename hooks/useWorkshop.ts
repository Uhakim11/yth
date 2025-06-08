import { useContext } from 'react';
import { WorkshopContext } from '../contexts/WorkshopContext';

export const useWorkshop = () => {
  const context = useContext(WorkshopContext);
  if (context === undefined) {
    throw new Error('useWorkshop must be used within a WorkshopProvider');
  }
  return context;
};