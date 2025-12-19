'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface CartItem {
  productId: string;
  productName: string;
  variantName?: string;
  quantity: number;
  unitPrice: number;
  image: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (productId: string, variantName?: string) => void;
  updateQuantity: (productId: string, quantity: number, variantName?: string) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getSubtotal: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setItems(JSON.parse(savedCart));
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  const addItem = (newItem: CartItem) => {
    setItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex(
        (item) =>
          item.productId === newItem.productId &&
          item.variantName === newItem.variantName
      );

      if (existingItemIndex > -1) {
        // Update quantity if item already exists
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex].quantity += newItem.quantity;
        return updatedItems;
      } else {
        // Add new item
        return [...prevItems, newItem];
      }
    });
  };

  const removeItem = (productId: string, variantName?: string) => {
    setItems((prevItems) =>
      prevItems.filter(
        (item) =>
          !(item.productId === productId && item.variantName === variantName)
      )
    );
  };

  const updateQuantity = (productId: string, quantity: number, variantName?: string) => {
    if (quantity <= 0) {
      removeItem(productId, variantName);
      return;
    }

    setItems((prevItems) =>
      prevItems.map((item) =>
        item.productId === productId && item.variantName === variantName
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const getTotalItems = () => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  };

  const getSubtotal = () => {
    return items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        getTotalItems,
        getSubtotal,
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
