
import { useContext } from 'react';
import { TalentContext } from '../contexts/TalentContext';
import { Talent, PortfolioItem } from '../types'; // Added PortfolioItem

interface TalentContextValue {
  talents: Talent[];
  loading: boolean;
  error: string | null;
  fetchTalentsList: () => Promise<void>;
  getTalentById: (id: string) => Promise<Talent | undefined>;
  addTalent: (talentData: Omit<Talent, 'id' | 'userId' | 'portfolio'>, userId: string) => Promise<Talent | null>; // Corrected signature
  updateTalent: (talentData: Talent) => Promise<Talent | null>;
  deleteTalent: (id: string) => Promise<boolean>;
  // Portfolio functions
  addPortfolioItem: (talentId: string, itemData: Omit<PortfolioItem, 'id' | 'talentId' | 'createdAt'>) => Promise<PortfolioItem | null>;
  updatePortfolioItem: (talentId: string, itemData: PortfolioItem) => Promise<PortfolioItem | null>;
  deletePortfolioItem: (talentId: string, itemId: string) => Promise<boolean>;
}

export const useTalent = (): TalentContextValue => {
  const context = useContext(TalentContext);
  if (context === undefined) {
    throw new Error('useTalent must be used within a TalentProvider');
  }
  return context;
};