'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface OrderItem {
  sku: string;
  name: string;
  price: number;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
  image?: string;
}

export interface OrderData {
  id: string;
  orderNumber: string;
  date: string;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  shippingAddress: {
    firstName: string;
    lastName: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
}

interface UserData {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  createdAt: string;
  orders: OrderData[];
}

interface UserContextType {
  user: UserData | null;
  isAuthenticated: boolean;
  login: (email: string, userData?: Partial<UserData>) => void;
  logout: () => void;
  updateUser: (userData: Partial<UserData>) => void;
  addOrder: (order: OrderData) => void;
  getOrders: () => OrderData[];
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserData | null>(null);
  const [mounted, setMounted] = useState(false);

  // Cargar usuario desde localStorage al montar
  useEffect(() => {
    const savedUser = localStorage.getItem('emara-user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setMounted(true);
  }, []);

  // Guardar usuario en localStorage cuando cambie
  useEffect(() => {
    if (mounted) {
      if (user) {
        localStorage.setItem('emara-user', JSON.stringify(user));
      } else {
        localStorage.removeItem('emara-user');
      }
    }
  }, [user, mounted]);

  const login = (email: string, userData?: Partial<UserData>) => {
    const newUser: UserData = {
      email,
      firstName: userData?.firstName || '',
      lastName: userData?.lastName || '',
      phone: userData?.phone || '',
      address: userData?.address || '',
      city: userData?.city || '',
      state: userData?.state || '',
      zipCode: userData?.zipCode || '',
      country: userData?.country || 'Chile',
      createdAt: new Date().toISOString(),
      orders: userData?.orders || [],
    };
    setUser(newUser);
  };

  const logout = () => {
    setUser(null);
  };

  const updateUser = (userData: Partial<UserData>) => {
    if (user) {
      setUser({ ...user, ...userData });
    }
  };

  const addOrder = (order: OrderData) => {
    if (user) {
      const updatedOrders = [...user.orders, order];
      setUser({ ...user, orders: updatedOrders });
    }
  };

  const getOrders = (): OrderData[] => {
    return user?.orders || [];
  };

  const isAuthenticated = !!user;

  return (
    <UserContext.Provider
      value={{
        user,
        isAuthenticated,
        login,
        logout,
        updateUser,
        addOrder,
        getOrders,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
