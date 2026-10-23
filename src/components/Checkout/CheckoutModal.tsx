import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { 
  X, 
  CheckCircle2, 
  CreditCard, 
  Truck, 
  MapPin, 
  ShieldCheck, 
  Sparkles, 
  Lock, 
  ArrowRight,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../../firebase';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { triggerHaptic } from '../../utils/haptics';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderCompleted?: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  onOrderCompleted
}) => {
  const { cart, totalPrice, clearCart, subtotal, discount, shipping } = useCart();
  const { user } = useAuth();

  const [deliverySpeed, setDeliverySpeed] = useState<'standard' | 'express'>('express');
  const [paymentMethod, setPaymentMethod] = useState<'prime-card' | 'apple-pay' | 'card'>('prime-card');
  const [guestName, setGuestName] = useState('Guest Shopper');
  const [guestEmail, setGuestEmail] = useState('guest@example.com');
  const [guestAddress, setGuestAddress] = useState('450 Lexington Ave, Suite 1200, New York, NY 10017');
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [isPlacing, setIsPlacing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  /**
   * Handle Confirm Order
   * 1. Prevents default form submission
   * 2. Creates order document in Firestore 'orders' collection
   * 3. Includes userId (auth or 'guest'), items, totalAmount, createdAt, status ("pending")
   * 4. Clears cart upon successful write and displays "Thank you for your order"
   */
  const handlePlaceOrder = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }

    if (cart.length === 0) {
      setErrorMessage('Your cart is currently empty.');
      return;
    }

    setIsPlacing(true);
    setErrorMessage(null);
    triggerHaptic('medium');

    try {
      // 1. Fetch userId from Firebase Auth, or fallback to 'guest'
      const userId = user?.uid || auth.currentUser?.uid || 'guest';

      // 2. Map items from cart
      const orderItems = cart.map((item) => ({
        id: item.product.id || item.id,
        title: item.product.title,
        price: item.product.sellingPrice !== undefined ? item.product.sellingPrice : item.product.price,
        quantity: item.quantity,
        image: item.product.image || '',
        selectedSize: item.selectedSize || 'M',
        selectedColor: item.selectedColor?.name || 'Default'
      }));

      // 3. Construct Firestore Order Document
      const orderDocument = {
        userId,
        items: orderItems,
        totalAmount: parseFloat(totalPrice.toFixed(2)),
        createdAt: serverTimestamp(),
        status: 'pending',
        customerName: guestName.trim() || 'Guest Shopper',
        customerEmail: user?.email || guestEmail.trim() || 'guest@example.com',
        shippingAddress: {
          street: guestAddress,
          city: 'New York',
          state: 'NY',
          zipCode: '10017',
          country: 'United States'
        },
        paymentMethod: paymentMethod === 'prime-card' 
          ? 'UR Prime Rewards Visa (*** 4242)' 
          : paymentMethod === 'apple-pay' 
          ? 'Apple Pay' 
          : 'Credit Card',
        deliverySpeed
      };

      // 4. Save to Firestore 'orders' collection
      const docRef = await addDoc(collection(db, 'orders'), orderDocument);
      console.log('Order saved to Firestore with ID:', docRef.id);

      setOrderId(docRef.id);
      setIsPlacing(false);
      setIsSuccess(true);
      triggerHaptic('success');

      // 5. Trigger Confetti Celebration
      confetti({
        particleCount: 90,
        spread: 75,
        origin: { y: 0.6 }
      });

      // 6. Automatically clear the user's cart
      clearCart();

      if (onOrderCompleted) {
        onOrderCompleted();
      }
    } catch (err: any) {
      console.error('Error writing order to Firestore:', err);
      setIsPlacing(false);
      setErrorMessage(err?.message || 'Failed to place order. Please try again.');
      triggerHaptic('error');
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto custom-scrollbar flex items-center justify-center p-3 sm:p-6">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => !isPlacing && onClose()}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 26, stiffness: 300 }}
          className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 z-10 my-auto"
        >
          {/* Header */}
          <div className="bg-brand-navy px-6 py-4 text-white flex items-center justify-between shadow-md">
            <div className="flex items-center space-x-2">
              <Lock className="w-4 h-4 text-brand-orange" />
              <div>
                <h3 className="font-extrabold text-base tracking-tight leading-none">
                  {isSuccess ? 'Order Confirmation' : 'UR Express Checkout'}
                </h3>
                <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">
                  {user ? 'Authenticated Checkout' : '100% Public • Guest Checkout'}
                </span>
              </div>
            </div>
            <button
              onClick={() => !isPlacing && onClose()}
              disabled={isPlacing}
              className="p-1.5 rounded-full text-white/80 hover:text-white hover:bg-white/10 disabled:opacity-50"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-5 sm:p-6 space-y-5">
            {isSuccess ? (
              /* Success View - Requirements: Thank you for your order */
              <div className="text-center py-6 space-y-4">
                <div className="w-20 h-20 mx-auto rounded-full bg-emerald-100 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="w-12 h-12 stroke-[2.5]" />
                </div>

                <div className="space-y-1">
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                    Thank you for your order!
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                    Your order <span className="font-mono font-bold text-brand-orange">#{orderId}</span> has been confirmed and saved to Firestore.
                  </p>
                  <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                    Cart cleared successfully • Receipt generated
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 text-left text-xs space-y-2">
                  <div className="flex items-center justify-between font-semibold text-slate-700 dark:text-slate-300">
                    <span className="flex items-center space-x-1.5">
                      <Truck className="w-4 h-4 text-brand-orange" />
                      <span>Delivery Status</span>
                    </span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold uppercase">
                      Pending Fulfillment
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                    <span>Customer</span>
                    <span>{guestName} ({user ? user.email || 'User' : 'Guest'})</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                    <span>Shipping Address</span>
                    <span className="truncate max-w-[220px]">{guestAddress}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 border-t border-slate-200 dark:border-slate-700 pt-1.5 font-bold">
                    <span>Total Amount Paid</span>
                    <span className="text-brand-orange font-black">${totalPrice.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  onClick={onClose}
                  className="w-full py-3.5 rounded-xl bg-brand-orange hover:bg-brand-orange-hover text-brand-navy font-black text-sm shadow-glow-orange active:scale-95 transition-all"
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              /* Checkout Form View */
              <form onSubmit={handlePlaceOrder} className="space-y-4">
                
                {/* Error Banner */}
                {errorMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-xs text-rose-600 dark:text-rose-400 flex items-start space-x-2.5"
                  >
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <div className="space-y-0.5">
                      <span className="font-bold block">Order Submission Error</span>
                      <p className="text-[11px] leading-relaxed">{errorMessage}</p>
                    </div>
                  </motion.div>
                )}

                {/* Customer Details & Delivery Address */}
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-900 dark:text-white">
                    <span className="flex items-center space-x-1.5">
                      <MapPin className="w-4 h-4 text-brand-orange" />
                      <span>Shipping Address & Contact</span>
                    </span>
                    <button 
                      type="button"
                      onClick={() => setIsEditingAddress(!isEditingAddress)}
                      className="text-[11px] text-brand-orange hover:underline font-semibold"
                    >
                      {isEditingAddress ? 'Done' : 'Edit Info'}
                    </button>
                  </div>

                  {isEditingAddress ? (
                    <div className="space-y-2 pt-1">
                      <input
                        type="text"
                        value={guestName}
                        onChange={(e) => setGuestName(e.target.value)}
                        placeholder="Full Name"
                        className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                      />
                      <input
                        type="email"
                        value={guestEmail}
                        onChange={(e) => setGuestEmail(e.target.value)}
                        placeholder="Email for order confirmation"
                        className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                      />
                      <input
                        type="text"
                        value={guestAddress}
                        onChange={(e) => setGuestAddress(e.target.value)}
                        placeholder="Street Address, City, State, ZIP"
                        className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                      />
                    </div>
                  ) : (
                    <div>
                      <p className="text-xs text-slate-700 dark:text-slate-200 font-semibold">
                        {guestName} • <span className="font-normal text-slate-500">{user?.email || guestEmail}</span>
                      </p>
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        {guestAddress}
                      </p>
                    </div>
                  )}
                </div>

                {/* Delivery Speed Options */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Choose Delivery Speed
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        triggerHaptic('light');
                        setDeliverySpeed('express');
                      }}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        deliverySpeed === 'express'
                          ? 'border-brand-orange bg-brand-orange/10 dark:bg-brand-orange/20 ring-1 ring-brand-orange'
                          : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-extrabold text-blue-600 dark:text-blue-400 flex items-center space-x-1">
                          <Sparkles className="w-3 h-3 fill-blue-600" />
                          <span>PRIME NEXT-DAY</span>
                        </span>
                        <span className="text-[10px] font-bold text-emerald-600">FREE</span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                        Delivered Tomorrow
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        triggerHaptic('light');
                        setDeliverySpeed('standard');
                      }}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        deliverySpeed === 'standard'
                          ? 'border-brand-orange bg-brand-orange/10 dark:bg-brand-orange/20 ring-1 ring-brand-orange'
                          : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        Standard Ground
                      </span>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                        3-5 business days
                      </p>
                    </button>
                  </div>
                </div>

                {/* Payment Selection */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Payment Method
                  </span>
                  <div className="space-y-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        triggerHaptic('light');
                        setPaymentMethod('prime-card');
                      }}
                      className={`w-full p-3 rounded-xl border flex items-center justify-between text-left transition-all ${
                        paymentMethod === 'prime-card'
                          ? 'border-brand-orange bg-brand-orange/10 dark:bg-brand-orange/20 ring-1 ring-brand-orange'
                          : 'border-slate-200 dark:border-slate-800'
                      }`}
                    >
                      <div className="flex items-center space-x-2.5">
                        <CreditCard className="w-4 h-4 text-brand-orange" />
                        <div>
                          <span className="text-xs font-bold text-slate-900 dark:text-white">
                            UR Prime Rewards Visa ending in 4242
                          </span>
                          <span className="text-[10px] text-brand-orange font-semibold block">
                            Earn 5% back on this order (+${(totalPrice * 0.05).toFixed(2)})
                          </span>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-slate-400">Default</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        triggerHaptic('light');
                        setPaymentMethod('apple-pay');
                      }}
                      className={`w-full p-2.5 rounded-xl border flex items-center justify-between text-left transition-all ${
                        paymentMethod === 'apple-pay'
                          ? 'border-brand-orange bg-brand-orange/10 dark:bg-brand-orange/20 ring-1 ring-brand-orange'
                          : 'border-slate-200 dark:border-slate-800'
                      }`}
                    >
                      <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                        Apple Pay / Google Pay
                      </span>
                      <span className="text-[11px] text-slate-400">1-Touch Express</span>
                    </button>
                  </div>
                </div>

                {/* Total Summary */}
                <div className="pt-2 border-t border-slate-200 dark:border-slate-800 text-xs space-y-1.5">
                  <div className="flex justify-between text-slate-600 dark:text-slate-400">
                    <span>Items Subtotal ({cart.length})</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-emerald-600 font-semibold">
                      <span>Promotional Savings</span>
                      <span>-${discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-slate-600 dark:text-slate-400">
                    <span>Shipping & Handling</span>
                    <span className="text-emerald-600 font-bold">FREE</span>
                  </div>
                  <div className="flex justify-between font-black text-sm text-slate-900 dark:text-white pt-1 border-t border-slate-100 dark:border-slate-800">
                    <span>Final Order Total</span>
                    <span className="text-base text-brand-orange">${totalPrice.toFixed(2)}</span>
                  </div>
                </div>

                {/* Primary CTA Button with Loading State */}
                <button
                  type="submit"
                  disabled={isPlacing || cart.length === 0}
                  className="w-full py-3.5 rounded-xl bg-brand-orange hover:bg-brand-orange-hover active:bg-brand-orange-active text-brand-navy font-black text-sm flex items-center justify-center space-x-2 shadow-glow-orange active:scale-[0.98] transition-all disabled:opacity-75 disabled:cursor-not-allowed"
                >
                  {isPlacing ? (
                    <div className="flex items-center space-x-2">
                      <RefreshCw className="w-4 h-4 animate-spin text-brand-navy" />
                      <span>Saving Order to Firestore...</span>
                    </div>
                  ) : (
                    <>
                      <Lock className="w-4 h-4 stroke-[2.5]" />
                      <span>Confirm & Place Order • ${totalPrice.toFixed(2)}</span>
                    </>
                  )}
                </button>

                <p className="text-[10px] text-center text-slate-400">
                  By confirming, your order will be recorded in Firestore and processed with 30-day money back guarantee.
                </p>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
