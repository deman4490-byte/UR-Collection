import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem } from '../types';
import { triggerHaptic } from '../utils/haptics';

interface CartContextType {
  cart: CartItem[];
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addToCart: (product: Product, size?: string, color?: { name: string; hex: string }, quantity?: number) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, newQty: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  discount: number;
  shipping: number;
  freeShippingThreshold: number;
  amountNeededForFreeShipping: number;
  appliedPromo: string | null;
  applyPromoCode: (code: string) => { success: boolean; message: string };
  removePromoCode: () => void;
  totalPrice: number;
  lastAddedItem: CartItem | null;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const FREE_SHIPPING_THRESHOLD = 75.00;
const STANDARD_SHIPPING_FEE = 9.99;

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('ur-cart');
        return saved ? JSON.parse(saved) : [];
      } catch (e) {
        return [];
      }
    }
    return [];
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [promoDiscountRate, setPromoDiscountRate] = useState<number>(0);
  const [lastAddedItem, setLastAddedItem] = useState<CartItem | null>(null);

  useEffect(() => {
    localStorage.setItem('ur-cart', JSON.stringify(cart));
  }, [cart]);

  const openCart = () => {
    setIsCartOpen(true);
    triggerHaptic('light');
  };

  const closeCart = () => {
    setIsCartOpen(false);
    triggerHaptic('light');
  };

  const toggleCart = () => {
    setIsCartOpen((prev) => !prev);
    triggerHaptic('light');
  };

  const addToCart = (
    product: Product,
    size?: string,
    color?: { name: string; hex: string },
    quantity = 1
  ) => {
    const selectedSize = size || product.sizes[0] || 'Standard';
    const selectedColor = color || product.colors[0] || { name: 'Default', hex: '#0B192C' };

    triggerHaptic('medium');

    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) =>
          item.product.id === product.id &&
          item.selectedSize === selectedSize &&
          item.selectedColor.hex === selectedColor.hex
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity
        };
        setLastAddedItem(updated[existingIndex]);
        return updated;
      }

      const newItem: CartItem = {
        id: `${product.id}-${selectedSize}-${selectedColor.hex}-${Date.now()}`,
        product,
        quantity,
        selectedSize,
        selectedColor,
        addedAt: Date.now()
      };

      setLastAddedItem(newItem);
      return [newItem, ...prev];
    });

    // Auto open slide-over cart for instant Amazon-grade conversion or let user see notification
    setIsCartOpen(true);
  };

  const removeFromCart = (cartItemId: string) => {
    triggerHaptic('medium');
    setCart((prev) => prev.filter((item) => item.id !== cartItemId));
  };

  const updateQuantity = (cartItemId: string, newQty: number) => {
    triggerHaptic('light');
    if (newQty <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.id === cartItemId ? { ...item, quantity: newQty } : item))
    );
  };

  const clearCart = () => {
    setCart([]);
    setAppliedPromo(null);
    setPromoDiscountRate(0);
  };

  const applyPromoCode = (code: string) => {
    const cleanCode = code.trim().toUpperCase();
    if (cleanCode === 'URVIP15') {
      setAppliedPromo('URVIP15');
      setPromoDiscountRate(0.15);
      triggerHaptic('success');
      return { success: true, message: 'VIP 15% discount applied!' };
    }
    if (cleanCode === 'PRIME' || cleanCode === 'URPRIME') {
      setAppliedPromo(cleanCode);
      setPromoDiscountRate(0.20);
      triggerHaptic('success');
      return { success: true, message: 'UR Prime 20% discount applied!' };
    }
    if (cleanCode === 'SAVE10') {
      setAppliedPromo('SAVE10');
      setPromoDiscountRate(0.10);
      triggerHaptic('success');
      return { success: true, message: '10% discount applied!' };
    }
    triggerHaptic('error');
    return { success: false, message: 'Invalid promo code. Try "URVIP15" or "PRIME"' };
  };

  const removePromoCode = () => {
    setAppliedPromo(null);
    setPromoDiscountRate(0);
    triggerHaptic('light');
  };

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const discount = Number((subtotal * promoDiscountRate).toFixed(2));
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : STANDARD_SHIPPING_FEE;
  const amountNeededForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const totalPrice = Number((subtotal - discount + (subtotal > 0 ? shipping : 0)).toFixed(2));

  return (
    <CartContext.Provider
      value={{
        cart,
        isCartOpen,
        openCart,
        closeCart,
        toggleCart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        subtotal,
        discount,
        shipping,
        freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
        amountNeededForFreeShipping,
        appliedPromo,
        applyPromoCode,
        removePromoCode,
        totalPrice,
        lastAddedItem
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
