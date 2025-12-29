'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface CartItem {
  id: string;
  name: string;
  sku: string;
  price: number;
  currency: string;
  quantity: number;
  image?: string;
  selectedSize?: string;
  selectedColor?: string;
  size?: string;
  color?: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (sku: string) => void;
  removeFromCart: (sku: string, size?: string, color?: string) => void;
  updateQuantity: (sku: string, quantity: number, size?: string, color?: string) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [mounted, setMounted] = useState(false);

  // Cargar carrito desde localStorage al montar
  useEffect(() => {
    const savedCart = localStorage.getItem('emara-cart');
    if (savedCart) {
      setItems(JSON.parse(savedCart));
    }
    setMounted(true);
  }, []);

  // Guardar carrito en localStorage cuando cambie
  useEffect(() => {
    if (mounted) {
      localStorage.setItem('emara-cart', JSON.stringify(items));
    }
  }, [items, mounted]);

  const addItem = (item: Omit<CartItem, 'quantity'>) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find(
        (i) => i.sku === item.sku && 
               i.selectedSize === item.selectedSize && 
               i.selectedColor === item.selectedColor
      );
      
      if (existingItem) {
        return prevItems.map((i) =>
          i.sku === item.sku && 
          i.selectedSize === item.selectedSize && 
          i.selectedColor === item.selectedColor
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }
      
      return [...prevItems, { ...item, quantity: 1 }];
    });
  };

  const removeItem = (sku: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.sku !== sku));
  };

  const removeFromCart = (sku: string, size?: string, color?: string) => {
    setItems((prevItems) => prevItems.filter((item) => 
      !(item.sku === sku && 
        item.selectedSize === size && 
        item.selectedColor === color)
    ));
  };

  const updateQuantity = (sku: string, quantity: number, size?: string, color?: string) => {
    if (quantity <= 0) {
      removeFromCart(sku, size, color);
      return;
    }
    
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.sku === sku && 
        item.selectedSize === size && 
        item.selectedColor === color
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
