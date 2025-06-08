
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthState, AuthContextType } from '../types'; // Updated to import AuthContextType
import { mockLogin, mockRegister, mockLogout, mockAdminLogin, updateMockUserAvatar, getAllMockUsers, updateMockUserStatus } from '../services/mockAuthService';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isAdmin: false,
    loading: true,
  });

  useEffect(() => {
    const storedUser = localStorage.getItem('authUser');
    if (storedUser) {
      const user: User = JSON.parse(storedUser);
      setAuthState({
        user,
        isAuthenticated: true,
        isAdmin: user.role === 'admin',
        loading: false,
      });
    } else {
      setAuthState(prev => ({ ...prev, loading: false }));
    }
  }, []);

  const login = async (email: string, password: string): Promise<User | null> => {
    setAuthState(prev => ({ ...prev, loading: true }));
    try {
      const user = await mockLogin(email, password);
      if (user) {
        localStorage.setItem('authUser', JSON.stringify(user));
        setAuthState({ user, isAuthenticated: true, isAdmin: user.role === 'admin', loading: false });
        return user;
      }
      setAuthState(prev => ({ ...prev, loading: false, error: 'Login failed' } as AuthState)); 
      return null;
    } catch (error) {
      console.error("Login error:", error);
      setAuthState(prev => ({ ...prev, loading: false, error: (error as Error).message } as AuthState));
      return null;
    }
  };
  
  const adminLogin = async (email: string, password: string): Promise<User | null> => {
    setAuthState(prev => ({ ...prev, loading: true }));
    try {
      const user = await mockAdminLogin(email, password);
      if (user) {
        localStorage.setItem('authUser', JSON.stringify(user));
        setAuthState({ user, isAuthenticated: true, isAdmin: true, loading: false });
        return user;
      }
      setAuthState(prev => ({ ...prev, loading: false, error: 'Admin login failed' } as AuthState));
      return null;
    } catch (error) {
      console.error("Admin login error:", error);
      setAuthState(prev => ({ ...prev, loading: false, error: (error as Error).message } as AuthState));
      return null;
    }
  };

  const register = async (name: string, email: string, password: string):Promise<User | null> => {
    setAuthState(prev => ({ ...prev, loading: true }));
    try {
      const user = await mockRegister(name, email, password);
      if (user) {
        localStorage.setItem('authUser', JSON.stringify(user));
        setAuthState({ user, isAuthenticated: true, isAdmin: user.role === 'admin', loading: false });
        return user;
      }
      setAuthState(prev => ({ ...prev, loading: false, error: 'Registration failed' } as AuthState));
      return null;
    } catch (error) {
      console.error("Registration error:", error);
      setAuthState(prev => ({ ...prev, loading: false, error: (error as Error).message } as AuthState));
      return null;
    }
  };

  const logout = () => {
    mockLogout();
    localStorage.removeItem('authUser');
    setAuthState({ user: null, isAuthenticated: false, isAdmin: false, loading: false });
  };

  const updateUserAvatar = async (avatarDataUrl: string): Promise<void> => {
    if (!authState.user) return;
    setAuthState(prev => ({
        ...prev,
        loading: true,
    }));
    try {
        const updatedUserInDb = await updateMockUserAvatar(authState.user.id, avatarDataUrl);
        if (updatedUserInDb) {
            const newUserState = {
                ...authState.user,
                avatarDataUrl: avatarDataUrl,
                avatarUrl: undefined, // Prioritize data URL
            };
            localStorage.setItem('authUser', JSON.stringify(newUserState));
            setAuthState(prev => ({
                ...prev,
                user: newUserState,
                loading: false,
            }));
        } else {
             setAuthState(prev => ({ ...prev, loading: false }));
        }
    } catch (error) {
        console.error("Avatar update error:", error);
        setAuthState(prev => ({ ...prev, loading: false }));
        // Potentially set an error message in authState
    }
  };

  const fetchAllUsers = async (): Promise<User[]> => {
    // This function might not change authState directly but provides data for components
    // In a real app, admin status would be re-verified here
    return await getAllMockUsers();
  };

  const updateUserStatusAsAdmin = async (userId: string, status: User['status']): Promise<User | null> => {
    if (!authState.isAdmin) {
        // This should ideally throw an error or be handled, but for mock, we log
        console.error("Unauthorized attempt to update user status.");
        return null;
    }
    // We don't set loading in authState here, as this is an admin action affecting other users
    // The component using this should manage its own loading state.
    try {
        const updatedUser = await updateMockUserStatus(userId, status);
        // No direct update to authState.user as admin is not changing their own status
        // The component (e.g., ManageUsersSection) will refetch or update its local list of users
        return updatedUser;
    } catch (error) {
        console.error("Error updating user status (admin):", error);
        return null;
    }
  };

  return (
    <AuthContext.Provider value={{ 
        ...authState, 
        login, 
        adminLogin, 
        register, 
        logout, 
        updateUserAvatar,
        fetchAllUsers, // New
        updateUserStatusAsAdmin // New
    }}>
      {children}
    </AuthContext.Provider>
  );
};