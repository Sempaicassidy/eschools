import React, { createContext, useContext, useState } from 'react';
import { User, UserRole } from '../types';

interface AuthContextType {
  user: User | null;
  role: UserRole;
  token: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  switchRole: (role: UserRole) => void;
}

const DEFAULT_USER: User = {
  id: 1,
  school_id: 1,
  name: 'Haula Super Admin',
  email: 'admin@haulaeschool.com',
  phone: '+255 700 000 000',
  user_type: 'super_admin',
  is_active: true,
  school: {
    id: 1,
    name: 'Haula International Secondary School',
    registration_number: 'S.4820/001',
    school_type: 'mixed',
    ownership: 'private',
    is_active: true,
  },
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(DEFAULT_USER);
  const [role, setRole] = useState<UserRole>('super_admin');
  const [token, setToken] = useState<string | null>(localStorage.getItem('haula_token') || 'demo-token-xyz');

  const login = (newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);
    setRole(newUser.user_type);
    localStorage.setItem('haula_token', newToken);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('haula_token');
  };

  const switchRole = (newRole: UserRole) => {
    setRole(newRole);
    if (user) {
      setUser({
        ...user,
        user_type: newRole,
        name: getRoleName(newRole),
      });
    }
  };

  const getRoleName = (r: UserRole) => {
    switch (r) {
      case 'super_admin': return 'Haula Super Admin';
      case 'headmaster':
      case 'school_admin': return 'Dr. Elizabeth Mwangi (Headmistress)';
      case 'teacher': return 'Mwl. Christopher Mollel (Math Teacher)';
      case 'accountant': return 'Francis Kibona (Bursar/Accountant)';
      case 'parent': return 'Juma Mkwawa (Parent/Guardian)';
      case 'student': return 'Baraka Juma Mkwawa (Student)';
      default: return 'User';
    }
  };

  return (
    <AuthContext.Provider value={{ user, role, token, login, logout, switchRole }}>
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