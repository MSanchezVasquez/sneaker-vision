import React from 'react';
import { useCart as useZustandCart } from '../store/useStore';

export function CartProvider({ children }: { children: React.ReactNode }) {
  // Provider is now a zero-overhead pass-through because Zustand handles all global reactive state
  return <>{children}</>;
}

export function useCart() {
  return useZustandCart();
}
