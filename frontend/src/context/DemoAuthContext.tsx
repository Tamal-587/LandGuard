import React, { createContext, useContext, useState, useEffect } from 'react';

export interface DemoUser {
  name: string;
  email: string;
  role: string;
  isDemo: boolean;
  avatarLetter: string;
}

interface DemoAuthContextType {
  user: DemoUser;
  loginDemo: (identity: string, name?: string) => void;
  registerDemo: (name: string, email: string) => void;
  exploreDemo: () => void;
  logout: () => void;
}

const DEFAULT_DEMO_USER: DemoUser = {
  name: 'Team Binary_du0',
  email: 'investigator@landguard.demo',
  role: 'Investigator (Demo)',
  isDemo: true,
  avatarLetter: 'B',
};

const DemoAuthContext = createContext<DemoAuthContextType | undefined>(undefined);

const STORAGE_KEY = 'landguard_demo_session';

export const DemoAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<DemoUser>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // ignore
    }
    return DEFAULT_DEMO_USER;
  });

  const saveUser = (newUser: DemoUser) => {
    setUser(newUser);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
    } catch {
      // ignore
    }
  };

  const loginDemo = (identity: string, name?: string) => {
    const computedName = name || (identity.includes('@') ? identity.split('@')[0] : identity) || 'Demo Investigator';
    const computedEmail = identity.includes('@') ? identity : `${identity}@landguard.demo`;
    const newUser: DemoUser = {
      name: computedName,
      email: computedEmail,
      role: 'Investigator (Demo)',
      isDemo: true,
      avatarLetter: (computedName.trim()[0] || 'D').toUpperCase(),
    };
    saveUser(newUser);
  };

  const registerDemo = (name: string, email: string) => {
    const newUser: DemoUser = {
      name: name.trim(),
      email: email.trim(),
      role: 'Registered Citizen / Officer (Demo)',
      isDemo: true,
      avatarLetter: (name.trim()[0] || 'U').toUpperCase(),
    };
    saveUser(newUser);
  };

  const exploreDemo = () => {
    const demoGuest: DemoUser = {
      name: 'Guest Investigator',
      email: 'guest.explorer@landguard.demo',
      role: 'Public Demo Explorer',
      isDemo: true,
      avatarLetter: 'G',
    };
    saveUser(demoGuest);
  };

  const logout = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
    setUser(DEFAULT_DEMO_USER);
  };

  return (
    <DemoAuthContext.Provider value={{ user, loginDemo, registerDemo, exploreDemo, logout }}>
      {children}
    </DemoAuthContext.Provider>
  );
};

export const useDemoAuth = (): DemoAuthContextType => {
  const context = useContext(DemoAuthContext);
  if (!context) {
    throw new Error('useDemoAuth must be used within a DemoAuthProvider');
  }
  return context;
};
