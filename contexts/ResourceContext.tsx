import React, { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Resource } from '../types';
import * as mockResourceService from '../services/mockResourceService';
import { useAuth } from '../hooks/useAuth';

interface ResourceContextType {
  resources: Resource[];
  loading: boolean;
  error: string | null;
  fetchResources: () => Promise<void>;
  addResource: (resourceData: Omit<Resource, 'id' | 'createdAt' | 'addedByAdminId'>) => Promise<Resource | null>;
  updateResource: (resourceData: Resource) => Promise<Resource | null>;
  deleteResource: (id: string) => Promise<boolean>;
}

export const ResourceContext = createContext<ResourceContextType | undefined>(undefined);

export const ResourceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchResources = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await mockResourceService.getResources();
      setResources(data);
    } catch (err) {
      setError((err as Error).message || 'Failed to fetch resources');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchResources();
  }, [fetchResources]);

  const addResource = async (resourceData: Omit<Resource, 'id' | 'createdAt' | 'addedByAdminId'>): Promise<Resource | null> => {
    if (user?.role !== 'admin') {
      setError("Only admins can add resources.");
      return null;
    }
    setLoading(true);
    try {
      const newResource = await mockResourceService.addResource(resourceData, user.id);
      setResources(prev => [newResource, ...prev]); // Add to beginning for most recent
      return newResource;
    } catch (err) {
      setError((err as Error).message || 'Failed to add resource');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateResource = async (resourceData: Resource): Promise<Resource | null> => {
    if (user?.role !== 'admin') {
      setError("Only admins can update resources.");
      return null;
    }
    setLoading(true);
    try {
      const updatedResource = await mockResourceService.updateResource(resourceData);
      setResources(prev => prev.map(r => r.id === updatedResource.id ? updatedResource : r));
      return updatedResource;
    } catch (err) {
      setError((err as Error).message || 'Failed to update resource');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteResource = async (id: string): Promise<boolean> => {
    if (user?.role !== 'admin') {
      setError("Only admins can delete resources.");
      return false;
    }
    setLoading(true);
    try {
      await mockResourceService.deleteResource(id);
      setResources(prev => prev.filter(r => r.id !== id));
      return true;
    } catch (err) {
      setError((err as Error).message || 'Failed to delete resource');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return (
    <ResourceContext.Provider value={{ resources, loading, error, fetchResources, addResource, updateResource, deleteResource }}>
      {children}
    </ResourceContext.Provider>
  );
};