import React, { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Talent, PortfolioItem } from '../types'; // Added PortfolioItem
import { 
    getTalents as fetchTalents, 
    addTalent as apiAddTalent, 
    updateTalent as apiUpdateTalent, 
    deleteTalent as apiDeleteTalent, 
    getTalentById as apiGetTalentById,
    addPortfolioItem as apiAddPortfolioItem, // New
    updatePortfolioItem as apiUpdatePortfolioItem, // New
    deletePortfolioItem as apiDeletePortfolioItem // New
} from '../services/mockTalentService';

interface TalentContextType {
  talents: Talent[];
  loading: boolean;
  error: string | null;
  fetchTalentsList: () => Promise<void>;
  getTalentById: (id: string) => Promise<Talent | undefined>;
  addTalent: (talentData: Omit<Talent, 'id' | 'userId' | 'portfolio'>, userId: string) => Promise<Talent | null>;
  updateTalent: (talentData: Talent) => Promise<Talent | null>;
  deleteTalent: (id: string) => Promise<boolean>;
  // Portfolio functions
  addPortfolioItem: (talentId: string, itemData: Omit<PortfolioItem, 'id' | 'talentId' | 'createdAt'>) => Promise<PortfolioItem | null>;
  updatePortfolioItem: (talentId: string, itemData: PortfolioItem) => Promise<PortfolioItem | null>;
  deletePortfolioItem: (talentId: string, itemId: string) => Promise<boolean>;
}

export const TalentContext = createContext<TalentContextType | undefined>(undefined);

export const TalentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [talents, setTalents] = useState<Talent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTalentsList = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchTalents();
      setTalents(data.map(t => ({...t, portfolio: t.portfolio || []})));
    } catch (err) {
      setError((err as Error).message || 'Failed to fetch talents');
      setTalents([]); 
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTalentsList();
  }, [fetchTalentsList]);

  const getTalentById = async (id: string): Promise<Talent | undefined> => {
    setLoading(true);
    try {
      const existingTalent = talents.find(t => t.id === id);
      if (existingTalent) {
        setLoading(false);
        return {...existingTalent, portfolio: existingTalent.portfolio || []};
      }
      const talent = await apiGetTalentById(id);
      if (talent) {
        // Optionally update local state if fetched fresh, though typically list has all
        // setTalents(prev => prev.map(t => t.id === talent.id ? {...talent, portfolio: talent.portfolio || []} : t));
      }
      setLoading(false);
      return talent ? {...talent, portfolio: talent.portfolio || []} : undefined;
    } catch (err) {
      setError((err as Error).message || `Failed to fetch talent ${id}`);
      setLoading(false);
      return undefined;
    }
  };

  const addTalent = async (talentData: Omit<Talent, 'id' | 'userId' | 'portfolio'>, userId: string): Promise<Talent | null> => {
    setLoading(true);
    setError(null);
    try {
      const newTalent = await apiAddTalent(talentData, userId);
      if (newTalent) {
        setTalents(prev => [...prev, {...newTalent, portfolio: newTalent.portfolio || []}]);
        return newTalent;
      }
      return null;
    } catch (err) {
      setError((err as Error).message || 'Failed to add talent');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateTalent = async (talentData: Talent): Promise<Talent | null> => {
    setLoading(true);
    setError(null);
    try {
      const updatedTalent = await apiUpdateTalent(talentData);
      if (updatedTalent) {
        setTalents(prev => prev.map(t => t.id === updatedTalent.id ? {...updatedTalent, portfolio: updatedTalent.portfolio || []} : t));
        return updatedTalent;
      }
      return null;
    } catch (err) {
      setError((err as Error).message || 'Failed to update talent');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteTalent = async (id: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const success = await apiDeleteTalent(id);
      if (success) {
        setTalents(prev => prev.filter(t => t.id !== id));
        return true;
      }
      return false;
    } catch (err) {
      setError((err as Error).message || 'Failed to delete talent');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Portfolio Item Functions Implementation
  const addPortfolioItem = async (talentId: string, itemData: Omit<PortfolioItem, 'id' | 'talentId' | 'createdAt'>): Promise<PortfolioItem | null> => {
    setLoading(true); setError(null);
    try {
      const newItem = await apiAddPortfolioItem(talentId, itemData);
      if (newItem) {
        setTalents(prevTalents => prevTalents.map(talent => 
          talent.id === talentId 
            ? { ...talent, portfolio: [...(talent.portfolio || []), newItem] } 
            : talent
        ));
        return newItem;
      }
      return null;
    } catch (err) {
      setError((err as Error).message || 'Failed to add portfolio item');
      return null;
    } finally { setLoading(false); }
  };

  const updatePortfolioItem = async (talentId: string, itemData: PortfolioItem): Promise<PortfolioItem | null> => {
    setLoading(true); setError(null);
    try {
      const updatedItem = await apiUpdatePortfolioItem(talentId, itemData);
      if (updatedItem) {
        setTalents(prevTalents => prevTalents.map(talent => 
          talent.id === talentId
            ? { ...talent, portfolio: (talent.portfolio || []).map(p => p.id === updatedItem.id ? updatedItem : p) }
            : talent
        ));
        return updatedItem;
      }
      return null;
    } catch (err) {
      setError((err as Error).message || 'Failed to update portfolio item');
      return null;
    } finally { setLoading(false); }
  };

  const deletePortfolioItem = async (talentId: string, itemId: string): Promise<boolean> => {
    setLoading(true); setError(null);
    try {
      const success = await apiDeletePortfolioItem(talentId, itemId);
      if (success) {
        setTalents(prevTalents => prevTalents.map(talent =>
          talent.id === talentId
            ? { ...talent, portfolio: (talent.portfolio || []).filter(p => p.id !== itemId) }
            : talent
        ));
        return true;
      }
      return false;
    } catch (err) {
      setError((err as Error).message || 'Failed to delete portfolio item');
      return false;
    } finally { setLoading(false); }
  };
  

  return (
    <TalentContext.Provider value={{ 
      talents, loading, error, fetchTalentsList, getTalentById, addTalent, updateTalent, deleteTalent,
      addPortfolioItem, updatePortfolioItem, deletePortfolioItem // Added portfolio functions
    }}>
      {children}
    </TalentContext.Provider>
  );
};