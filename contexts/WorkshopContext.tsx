import React, { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Workshop, Talent } from '../types';
import * as mockWorkshopService from '../services/mockWorkshopService';
import { useAuth } from '../hooks/useAuth';

interface WorkshopContextType {
  workshops: Workshop[];
  loading: boolean;
  error: string | null;
  fetchWorkshops: () => Promise<void>;
  getWorkshopById: (id: string) => Promise<Workshop | undefined>;
  addWorkshop: (workshopData: Omit<Workshop, 'id' | 'registeredTalents'>) => Promise<Workshop | null>;
  updateWorkshop: (workshopData: Workshop) => Promise<Workshop | null>;
  deleteWorkshop: (id: string) => Promise<boolean>;
  registerForWorkshop: (workshopId: string) => Promise<boolean>;
  unregisterFromWorkshop: (workshopId: string) => Promise<boolean>;
}

export const WorkshopContext = createContext<WorkshopContextType | undefined>(undefined);

export const WorkshopProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth(); // To get current user for registration

  const fetchWorkshops = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await mockWorkshopService.getWorkshops();
      setWorkshops(data);
    } catch (err) {
      setError((err as Error).message || 'Failed to fetch workshops');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWorkshops();
  }, [fetchWorkshops]);

  const getWorkshopById = async (id: string): Promise<Workshop | undefined> => {
    const existing = workshops.find(w => w.id === id);
    if(existing) return {...existing};

    setLoading(true);
    try {
      const data = await mockWorkshopService.getWorkshopById(id);
       if (data && !workshops.some(w => w.id === data.id)) {
         setWorkshops(prev => [...prev, data]);
      }
      return data;
    } catch (err) {
      setError((err as Error).message || `Failed to fetch workshop ${id}`);
      return undefined;
    } finally {
      setLoading(false);
    }
  };

  const addWorkshop = async (workshopData: Omit<Workshop, 'id' | 'registeredTalents'>): Promise<Workshop | null> => {
     if (user?.role !== 'admin') {
      setError("Only admins can add workshops.");
      return null;
    }
    setLoading(true);
    try {
      const newWorkshop = await mockWorkshopService.addWorkshop(workshopData);
      setWorkshops(prev => [...prev, newWorkshop]);
      return newWorkshop;
    } catch (err) {
      setError((err as Error).message || 'Failed to add workshop');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateWorkshop = async (workshopData: Workshop): Promise<Workshop | null> => {
    if (user?.role !== 'admin') {
      setError("Only admins can update workshops.");
      return null;
    }
    setLoading(true);
    try {
      const updatedWorkshop = await mockWorkshopService.updateWorkshop(workshopData);
      setWorkshops(prev => prev.map(w => w.id === updatedWorkshop.id ? updatedWorkshop : w));
      return updatedWorkshop;
    } catch (err) {
      setError((err as Error).message || 'Failed to update workshop');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteWorkshop = async (id: string): Promise<boolean> => {
    if (user?.role !== 'admin') {
      setError("Only admins can delete workshops.");
      return false;
    }
    setLoading(true);
    try {
      await mockWorkshopService.deleteWorkshop(id);
      setWorkshops(prev => prev.filter(w => w.id !== id));
      return true;
    } catch (err) {
      setError((err as Error).message || 'Failed to delete workshop');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const registerForWorkshop = async (workshopId: string): Promise<boolean> => {
    if (!user) {
      setError("You must be logged in to register for a workshop.");
      return false;
    }
    setLoading(true);
    try {
      const success = await mockWorkshopService.registerForWorkshop(workshopId, user.id, user.name || 'Registered User');
      if (success) {
        // Refetch or update local state
        const updatedWorkshop = await mockWorkshopService.getWorkshopById(workshopId); // Or update client-side
        if (updatedWorkshop) {
            setWorkshops(prev => prev.map(w => w.id === workshopId ? updatedWorkshop : w));
        }
        return true;
      }
      return false;
    } catch (err) {
      setError((err as Error).message || 'Failed to register for workshop');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const unregisterFromWorkshop = async (workshopId: string): Promise<boolean> => {
    if (!user) {
      setError("User not found.");
      return false;
    }
    setLoading(true);
    try {
      const success = await mockWorkshopService.unregisterFromWorkshop(workshopId, user.id);
      if (success) {
        const updatedWorkshop = await mockWorkshopService.getWorkshopById(workshopId);
         if (updatedWorkshop) {
            setWorkshops(prev => prev.map(w => w.id === workshopId ? updatedWorkshop : w));
        }
        return true;
      }
      return false;
    } catch (err) {
      setError((err as Error).message || 'Failed to unregister from workshop');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return (
    <WorkshopContext.Provider value={{ workshops, loading, error, fetchWorkshops, getWorkshopById, addWorkshop, updateWorkshop, deleteWorkshop, registerForWorkshop, unregisterFromWorkshop }}>
      {children}
    </WorkshopContext.Provider>
  );
};