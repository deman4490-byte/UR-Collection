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
  PackageCheck
} from 'lucide-react';
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

  const [deliverySpeed, setDeliverySpeed] = useState<'standard' | 'express'>('express');
  const [paymentMethod, setPaymentMethod] = useState<'prime-card' | 'apple-pay' | 'card'>('prime-card');
  const [guestName, setGuestName] = useState('Guest Shopper');
  const [guestEmail, setGuestEmail] = useState('guest@example.com');
  const [guestAddress, setGuestAddress] = useState('450 Lexington Ave, Suite 1200, New York, NY 10017');
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [isPlacing, setIsPlacing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [orderId, setOrderId] = useState('');

  if (!isOpen) return null;

  const handlePlaceOrder = () => {
    setIsPlacing(true);
    triggerHaptic('medium');

    setTimeout(() => {
      setIsPlacing(false);
      setIsSuccess(true);
      const generatedOrderId = `UR-${Math.floor(100000 + Math.random() * 900000)}`;
      setOrderId(generatedOrderId);
      triggerHaptic('success');

      // Trigger Confetti Celebration
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });

      clearCart();
      if (onOrderCompleted) onOrderCompleted();
    }, 1200);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto custom-scrollbar flex items-center justify-center p-3 sm:p-6">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
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
                  {isSuccess ? 'Guest Order Confirmed' : 'Guest Express Checkout'}
                </h3>
                <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">
                  100% Public • No Account or Login Required
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-white/80 hover:text-white hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-5 sm:p-6 space-y-5">
            {isSuccess ? (
              /* Success View */
              <div className="text-center py-6 space-y-4">
                <div className="w-20 h-20 mx-auto rounded-full bg-emerald-100 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="w-12 h-12 stroke-[2.5]" />
                </div>

                <div className="space-y-1">
                  <h2 className="text-xl font-black text-slate-900 dark:text-white">
                    Thank You, {guestName}!
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                    Your guest order <span className="font-mono font-bold text-brand-orange">#{orderId}</span> has been confirmed.
                  </p>
                  <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                    Purchased seamlessly as a Guest — no account needed.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 text-left text-xs space-y-2">
                  <div className="flex items-center justify-between font-semibold text-slate-700 dark:text-slate-300">
                    <span className="flex items-center space-x-1.5">
                      <Truck className="w-4 h-4 text-brand-orange" />
                      <span>Estimated Delivery</span>
                    </span>
                    <span className="text-brand-orange font-bold">Tomorrow by 11:00 AM</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                    <span>Shipping To</span>
                    <span>{guestName} • {guestAddress.slice(0, 30)}...</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                    <span>Receipt Sent To</span>
                    <span>{guestEmail}</span>
                  </div>
                </div>

                <button
                  onClick={onClose}
                  className="w-full py-3.5 rounded-xl bg-brand-orange hover:bg-brand-orange-hover text-brand-navy font-bold text-sm shadow-glow-orange active:scale-95 transition-all"
                >
                  Continue Browsing Public Store
                </button>
              </div>
            ) : (
              /* Checkout Form View */
              <div className="space-y-4">
                {/* Guest Details & Delivery Address */}
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-900 dark:text-white">
                    <span className="flex items-center space-x-1.5">
                      <MapPin className="w-4 h-4 text-brand-orange" />
                      <span>Guest Shipping Address</span>
                    </span>
                    <button 
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
                        placeholder="Guest Name"
                        className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                      />
                      <input
                        type="email"
                        value={guestEmail}
                        onChange={(e) => setGuestEmail(e.target.value)}
                        placeholder="Guest Email (for receipt)"
                        className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                      />
                      <input
                        type="text"
                        value={guestAddress}
                        onChange={(e) => setGuestAddress(e.target.value)}
                        placeholder="Shipping Address"
                        className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                      />
                    </div>
                  ) : (
                    <div>
                      <p className="text-xs text-slate-700 dark:text-slate-200 font-semibold">
                        {guestName} • <span className="font-normal text-slate-500">{guestEmail}</span>
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
                      <span className="text-[11px] text-slate-400">1-Touch TouchID</span>
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

                {/* Primary CTA Button */}
                <button
                  onClick={handlePlaceOrder}
                  disabled={isPlacing}
                  className="w-full py-3.5 rounded-xl bg-brand-orange hover:bg-brand-orange-hover active:bg-brand-orange-active text-brand-navy font-black text-sm flex items-center justify-center space-x-2 shadow-glow-orange active:scale-[0.98] transition-all disabled:opacity-75"
                >
                  {isPlacing ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-brand-navy border-t-transparent rounded-full animate-spin" />
                      <span>Securing Order...</span>
                    </div>
                  ) : (
                    <>
                      <Lock className="w-4 h-4 stroke-[2.5]" />
                      <span>Place Order as Guest • ${totalPrice.toFixed(2)}</span>
                    </>
                  )}
                </button>

                <p className="text-[10px] text-center text-slate-400">
                  By placing your order, you agree to UR Collection's terms of service and 30-day money back guarantee.
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
