import React, { createContext, useState, useCallback, ReactNode } from 'react';
import { AlertMessage, AlertType } from '../types';

interface AlertContextType {
  alerts: AlertMessage[];
  addAlert: (message: string, type: AlertType, duration?: number) => void;
  removeAlert: (id: string) => void;
}

export const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const AlertProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [alerts, setAlerts] = useState<AlertMessage[]>([]);

  const addAlert = useCallback((message: string, type: AlertType, duration: number = 5000) => {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9); // More unique ID
    const newAlert: AlertMessage = { id, message, type, duration };
    setAlerts(prevAlerts => [newAlert, ...prevAlerts]); // Add to the beginning for top display

    if (duration > 0) {
      setTimeout(() => {
        removeAlert(id);
      }, duration);
    }
  }, []);

  const removeAlert = useCallback((id: string) => {
    setAlerts(prevAlerts => prevAlerts.filter(alert => alert.id !== id));
  }, []);

  return (
    <AlertContext.Provider value={{ alerts, addAlert, removeAlert }}>
      {children}
    </AlertContext.Provider>
  );
};