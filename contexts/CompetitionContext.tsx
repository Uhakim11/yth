import React, { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Competition, CompetitionSubmission, Talent, PaymentStatus, CompetitionSubmissionRating } from '../types'; // Added CompetitionSubmissionRating
import * as mockCompetitionService from '../services/mockCompetitionService';
import { useAuth } from '../hooks/useAuth';

interface CompetitionContextType {
  competitions: Competition[];
  loading: boolean;
  error: string | null;
  fetchCompetitions: () => Promise<void>;
  getCompetitionById: (id: string) => Promise<Competition | undefined>;
  addCompetition: (competitionData: Omit<Competition, 'id' | 'submissions' | 'status'>) => Promise<Competition | null>;
  updateCompetition: (competitionData: Competition) => Promise<Competition | null>;
  deleteCompetition: (id: string) => Promise<boolean>;
  submitToCompetition: (
    competitionId: string, 
    submissionType: 'text' | 'portfolio',
    content: string, 
    portfolioItemId?: string
  ) => Promise<CompetitionSubmission | null>;
  markWinner: (competitionId: string, talentId: string, talentName: string, submissionId: string) => Promise<Competition | null>;
  updatePaymentStatus: (competitionId: string, status: Competition['paymentProcessed']) => Promise<Competition | null>;
  rateSubmission: (competitionId: string, submissionId: string, score: number, comment?: string) => Promise<CompetitionSubmission | null>; 
}

export const CompetitionContext = createContext<CompetitionContextType | undefined>(undefined);

export const CompetitionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchCompetitions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await mockCompetitionService.getCompetitions();
      setCompetitions(data);
    } catch (err) {
      setError((err as Error).message || 'Failed to fetch competitions');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCompetitions();
  }, [fetchCompetitions]);

  const getCompetitionById = async (id: string): Promise<Competition | undefined> => {
    const existing = competitions.find(c => c.id === id);
    // Ensure existing also gets its submissions' ratings arrays initialized if needed
    if (existing) return { 
      ...existing, 
      submissions: (existing.submissions || []).map(s => ({...s, ratings: s.ratings || []})),
      tasks: existing.tasks || [] // ensure tasks array exists
    };


    setLoading(true);
    try {
      const data = await mockCompetitionService.getCompetitionById(id);
      if (data && !competitions.some(c => c.id === data.id)) {
         setCompetitions(prev => [...prev, { ...data, tasks: data.tasks || [] }]);
      }
      return data ? { ...data, tasks: data.tasks || [] } : undefined;
    } catch (err) {
      setError((err as Error).message || `Failed to fetch competition ${id}`);
      return undefined;
    } finally {
      setLoading(false);
    }
  };

  const addCompetition = async (competitionData: Omit<Competition, 'id' | 'submissions' | 'status'>): Promise<Competition | null> => {
    if (user?.role !== 'admin') {
      setError("Only admins can add competitions.");
      return null;
    }
    setLoading(true);
    try {
      const newCompetition = await mockCompetitionService.addCompetition(competitionData);
      setCompetitions(prev => [...prev, newCompetition]);
      return newCompetition;
    } catch (err) {
      setError((err as Error).message || 'Failed to add competition');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateCompetition = async (competitionData: Competition): Promise<Competition | null> => {
     if (user?.role !== 'admin') {
      setError("Only admins can update competitions.");
      return null;
    }
    setLoading(true);
    try {
      const updatedCompetition = await mockCompetitionService.updateCompetition(competitionData);
      setCompetitions(prev => prev.map(c => c.id === updatedCompetition.id ? updatedCompetition : c));
      return updatedCompetition;
    } catch (err) {
      setError((err as Error).message || 'Failed to update competition');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteCompetition = async (id: string): Promise<boolean> => {
    if (user?.role !== 'admin') {
      setError("Only admins can delete competitions.");
      return false;
    }
    setLoading(true);
    try {
      await mockCompetitionService.deleteCompetition(id);
      setCompetitions(prev => prev.filter(c => c.id !== id));
      return true;
    } catch (err) {
      setError((err as Error).message || 'Failed to delete competition');
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  const submitToCompetition = async (
    competitionId: string, 
    submissionType: 'text' | 'portfolio',
    content: string, 
    portfolioItemId?: string
  ): Promise<CompetitionSubmission | null> => {
    if (!user) {
        setError("You must be logged in to submit.");
        return null;
    }
    setLoading(true);
    try {
        const talentName = user.name || "Anonymous Talent"; 
        const newSubmission = await mockCompetitionService.addSubmissionToCompetition(competitionId, user.id, talentName, submissionType, content, portfolioItemId);
        
        setCompetitions(prevComps => prevComps.map(comp => {
            if (comp.id === competitionId) {
                return { ...comp, submissions: [...(comp.submissions || []), newSubmission] };
            }
            return comp;
        }));
        return newSubmission;
    } catch (err) {
        setError((err as Error).message || 'Failed to submit to competition');
        return null;
    } finally {
        setLoading(false);
    }
  };

  const markWinner = async (competitionId: string, talentId: string, talentName: string, submissionId: string): Promise<Competition | null> => {
    if (user?.role !== 'admin') {
      setError("Only admins can mark winners.");
      return null;
    }
    setLoading(true);
    try {
      const updatedCompetition = await mockCompetitionService.markWinner(competitionId, talentId, talentName, submissionId);
      setCompetitions(prev => prev.map(c => c.id === updatedCompetition.id ? updatedCompetition : c));
      return updatedCompetition;
    } catch (err) {
      setError((err as Error).message || 'Failed to mark winner');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updatePaymentStatus = async (competitionId: string, paymentStatus: Competition['paymentProcessed']): Promise<Competition | null> => {
    if (user?.role !== 'admin') {
      setError("Only admins can update payment status.");
      return null;
    }
    setLoading(true);
    try {
      const updatedCompetition = await mockCompetitionService.updatePaymentStatus(competitionId, paymentStatus);
      setCompetitions(prev => prev.map(c => c.id === updatedCompetition.id ? updatedCompetition : c));
      return updatedCompetition;
    } catch (err) {
      setError((err as Error).message || 'Failed to update payment status');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const rateSubmission = async (competitionId: string, submissionId: string, score: number, comment?: string): Promise<CompetitionSubmission | null> => {
    if (!user || user.role !== 'admin') {
      setError("Only admins can rate submissions.");
      return null;
    }
    setLoading(true);
    try {
      const updatedSubmission = await mockCompetitionService.rateSubmission(competitionId, submissionId, user.id, score, comment);
      if (updatedSubmission) {
        setCompetitions(prevComps => prevComps.map(comp => {
          if (comp.id === competitionId) {
            return {
              ...comp,
              submissions: comp.submissions.map(sub => sub.submissionId === submissionId ? updatedSubmission : sub)
            };
          }
          return comp;
        }));
      }
      return updatedSubmission;
    } catch (err) {
      setError((err as Error).message || "Failed to rate submission");
      return null;
    } finally {
      setLoading(false);
    }
  };


  return (
    <CompetitionContext.Provider value={{ 
        competitions, loading, error, fetchCompetitions, getCompetitionById, addCompetition, 
        updateCompetition, deleteCompetition, submitToCompetition, markWinner, updatePaymentStatus,
        rateSubmission 
    }}>
      {children}
    </CompetitionContext.Provider>
  );
};