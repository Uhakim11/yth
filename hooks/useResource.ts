import { useContext } from 'react';
import { ResourceContext } from '../contexts/ResourceContext';

export const useResource = () => {
  const context = useContext(ResourceContext);
  if (context === undefined) {
    throw new Error('useResource must be used within a ResourceProvider');
  }
  return context;
};