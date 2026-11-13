import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

// Default demo customer profile
const DEMO_CUSTOMER = {
  id: 'cust-current',
  name: 'Arbaz Seliya',
  phone: '9876543210',
  role: 'CUSTOMER',
  email: 'seliyaarbaz5051@gmail.com',
  preferredLanguage: 'gu'
};

const DEMO_ADMIN = {
  id: 'admin-01',
  name: 'SAFAR Workshop Owner',
  phone: '9876543210',
  role: 'ADMIN',
  username: 'admin',
  email: 'owner@safarcycle.in'
};

export const AuthProvider = ({ children }) => {
  // Start in a genuine guest state unless a valid persisted session exists.
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const stored = sessionStorage.getItem('safar_active_user');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.role) return parsed;
      }
    } catch {
      // fallback
    }
    return null;
  });

  useEffect(() => {
    if (currentUser) {
      sessionStorage.setItem('safar_active_user', JSON.stringify(currentUser));
    } else {
      sessionStorage.removeItem('safar_active_user');
    }
  }, [currentUser]);

  const loginCustomer = async (phone, password) => {
    // In mock mode: validate phone format
    if (!phone || phone.length < 10) {
      throw new Error('Please enter a valid 10-digit mobile number');
    }
    if (!password || password.length < 4) {
      throw new Error('Please enter your password (minimum 4 characters)');
    }

    const user = {
      id: 'cust-current',
      name: phone === '9876543210' ? 'Arbaz Seliya' : 'Valued Customer',
      phone,
      role: 'CUSTOMER'
    };
    setCurrentUser(user);
    return user;
  };

  const registerCustomer = async ({ name, phone, password, preferredLanguage }) => {
    if (!name?.trim()) throw new Error('Please enter your full name');
    if (!phone || phone.length < 10) throw new Error('Please enter a valid 10-digit mobile number');
    if (!password || password.length < 4) throw new Error('Password must be at least 4 characters');

    const newUser = {
      id: `cust-${Date.now().toString().slice(-4)}`,
      name,
      phone,
      role: 'CUSTOMER',
      preferredLanguage: preferredLanguage || 'gu'
    };
    setCurrentUser(newUser);
    return newUser;
  };

  const loginAdmin = async (identifier, password) => {
    // Admin credentials for convenience
    if (!identifier || !password) {
      throw new Error('Please enter both admin ID and password');
    }
    // Allow 'admin' / 'admin123' or any admin password during demonstration
    if (identifier === 'admin' && password === 'admin123') {
      setCurrentUser(DEMO_ADMIN);
      return DEMO_ADMIN;
    }
    // Fallback friendly check
    if (identifier.toLowerCase().includes('admin')) {
      setCurrentUser(DEMO_ADMIN);
      return DEMO_ADMIN;
    }
    throw new Error('Invalid Admin credentials. Try Username: "admin", Password: "admin123"');
  };

  const logout = () => {
    setCurrentUser(null);
    sessionStorage.removeItem('safar_active_user');
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: !!currentUser,
        isCustomer: currentUser?.role === 'CUSTOMER',
        isAdmin: currentUser?.role === 'ADMIN',
        loginCustomer,
        registerCustomer,
        loginAdmin,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
