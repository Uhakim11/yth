

import { User, Talent } from '../types'; // Added Talent
import { MOCK_TALENTS_DATA } from '../constants'; // Added MOCK_TALENTS_DATA

// Simulate a database of users
let mockUsers: User[] = [ // Changed to let for modification
  { id: 'admin1', email: 'hakim@example.com', role: 'admin', name: 'Admin Hakim', avatarUrl: 'https://picsum.photos/seed/admin1/100/100', lastSeen: 'online', status: 'active' }, 
  { id: 'user1', email: 'user@example.com', role: 'user', name: 'Test User', avatarUrl: 'https://picsum.photos/seed/user1/100/100', lastSeen: new Date(Date.now() - 10 * 60 * 1000).toISOString(), status: 'active' },
  { id: 'user_reponsekdz', email: 'reponsekdz06@gmail.com', role: 'user', name: 'Reponse Kdz', avatarUrl: 'https://picsum.photos/seed/reponsekdz/100/100', lastSeen: 'online', status: 'active' },
  { id: 'talent1_user', email: 'alice@example.com', role: 'user', name: 'Alice Wonderland', avatarUrl: 'https://picsum.photos/seed/alice/100/100', lastSeen: 'online', status: 'active'}, // Assuming talent's user email
  { id: 'talent2_user', email: 'bob@example.com', role: 'user', name: 'Bob The Builder', avatarUrl: 'https://picsum.photos/seed/bob/100/100', lastSeen: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), status: 'active' },
  { id: 'talent3_user', email: 'charlie@example.com', role: 'user', name: 'Charlie Chaplin Jr.', avatarUrl: 'https://picsum.photos/seed/charlie/100/100', lastSeen: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), status: 'suspended' },
];

// Ensure all talents from MOCK_TALENTS_DATA have corresponding users if their emails are not already in mockUsers
MOCK_TALENTS_DATA.forEach(talent => {
  if (talent.contactEmail && !mockUsers.some(u => u.email === talent.contactEmail)) {
    mockUsers.push({
      id: talent.userId, // Use talent.userId as the User's ID
      email: talent.contactEmail,
      role: 'user',
      name: talent.name,
      avatarUrl: talent.profileImageUrl || `https://picsum.photos/seed/${talent.id}/100/100`,
      lastSeen: 'online',
      status: 'active',
    });
  } else if (!talent.contactEmail && !mockUsers.some(u => u.id === talent.userId)) {
    // If no contactEmail, create a dummy user if userId doesn't exist
     mockUsers.push({
      id: talent.userId,
      email: `${talent.userId}@example.com`, // dummy email
      role: 'user',
      name: talent.name,
      avatarUrl: talent.profileImageUrl || `https://picsum.photos/seed/${talent.id}/100/100`,
      lastSeen: 'online',
      status: 'active',
    });
  }
}); // Added semicolon

const MOCK_API_DELAY = 500; // ms

const findUserByEmail = (email: string): User | undefined => {
  return mockUsers.find(u => u.email === email);
};

export const mockLogin = (email: string, password: string): Promise<User | null> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const user = findUserByEmail(email);
      if (email === 'hakimziec888@gmail.com' && password === 'hakimu11') {
        const reponseUser = mockUsers.find(u => u.email === 'hakimziec888@gmail.com');
        if (reponseUser) {
          resolve(reponseUser);
          return;
        }
      }
      if (user && user.role === 'user' && password === 'password') { 
        resolve(user);
      } else {
        localStorage.setItem('authError', 'Invalid user credentials.');
        resolve(null); 
      }
    }, MOCK_API_DELAY);
  });
};

export const mockAdminLogin = (email: string, password: string): Promise<User | null> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const user = findUserByEmail(email);
      // Allow hakim@example.com to login with PIN '2025'
      if (user && user.email === 'hakimziec@gmail.com' && password === 'hakimu11') {
        resolve(user);
      } 
      // Specifically prevent hakim@example.com from logging in with password 'hakim'
      else if (user && user.email === 'hakimziec@gmail.com' && password === 'hakimu11') {
        localStorage.setItem('authError', 'Login for this admin account with the password "hakim" has been disabled. Try the new PIN.');
        resolve(null);
      } 
      // Other admin users can still log in with password 'hakim'
      else if (user && user.role === 'admin' && password === 'hakim') {
        resolve(user);
      } else {
        localStorage.setItem('authError', 'Invalid admin credentials.');
        resolve(null);
      }
    }, MOCK_API_DELAY);
  });
};

export const mockRegister = (name: string, email: string, password: string): Promise<User | null> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (findUserByEmail(email)) {
        localStorage.setItem('authError', 'User with this email already exists.');
        reject(new Error('User with this email already exists.'));
        return;
      }
      const newUser: User = {
        id: `user${Date.now()}`, // More unique ID
        email,
        role: 'user',
        name,
        avatarUrl: `https://picsum.photos/seed/${name.replace(/\s+/g, '')}/100/100`, 
        lastSeen: 'online', 
        status: 'active',
      };
      mockUsers.push(newUser); 
      console.log("Mock register password (not stored):", password)
      localStorage.removeItem('authError'); 
      resolve(newUser);
    }, MOCK_API_DELAY);
  });
};

export const mockLogout = (): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      localStorage.removeItem('authError');
      resolve();
    }, MOCK_API_DELAY / 2);
  });
};

export const getAllMockUsers = (): Promise<User[]> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve([...mockUsers]);
        }, MOCK_API_DELAY / 2);
    });
};

export const getMockUserById = (userId: string): Promise<User | undefined> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(mockUsers.find(u => u.id === userId));
        }, MOCK_API_DELAY / 2);
    });
};

export const updateMockUserAvatar = (userId: string, avatarDataUrl: string): Promise<User | null> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const userIndex = mockUsers.findIndex(u => u.id === userId);
      if (userIndex !== -1) {
        mockUsers[userIndex].avatarDataUrl = avatarDataUrl;
        mockUsers[userIndex].avatarUrl = undefined; // Prioritize data URL
        resolve({...mockUsers[userIndex]});
      } else {
        resolve(null);
      }
    }, MOCK_API_DELAY / 2);
  });
};

export const updateMockUserStatus = (userId: string, status: User['status']): Promise<User | null> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const userIndex = mockUsers.findIndex(u => u.id === userId);
      if (userIndex !== -1) {
        mockUsers[userIndex].status = status;
        resolve({...mockUsers[userIndex]});
      } else {
        reject(new Error('User not found for status update.'));
      }
    }, MOCK_API_DELAY / 2);
  });
};