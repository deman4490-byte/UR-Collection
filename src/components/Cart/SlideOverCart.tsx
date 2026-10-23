import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  Truck, 
  ArrowRight, 
  ShieldCheck, 
  Tag, 
  Sparkles, 
  CheckCircle2, 
  Lock 
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { triggerHaptic } from '../../utils/haptics';

interface SlideOverCartProps {
  onProceedToCheckout: () => void;
  onExploreProducts: () => void;
}

export const SlideOverCart: React.FC<SlideOverCartProps> = ({
  onProceedToCheckout,
  onExploreProducts
}) => {
  const {
    cart,
    isCartOpen,
    closeCart,
    removeFromCart,
    updateQuantity,
    totalItems,
    subtotal,
    discount,
    shipping,
    freeShippingThreshold,
    amountNeededForFreeShipping,
    appliedPromo,
    applyPromoCode,
    removePromoCode,
    totalPrice
  } = useCart();

  const [promoInput, setPromoInput] = useState('');
  const [promoMessage, setPromoMessage] = useState<{ text: string; isError: boolean } | null>(null);

  const freeShippingProgress = Math.min(100, (subtotal / freeShippingThreshold) * 100);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    const res = applyPromoCode(promoInput);
    setPromoMessage({ text: res.message, isError: !res.success });
    if (res.success) {
      setPromoInput('');
    }
  };

  const handleCheckoutClick = () => {
    triggerHaptic('success');
    closeCart();
    onProceedToCheckout();
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop Blur Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={closeCart}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex">
            {/* Slide-over Right Side Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              className="w-screen max-w-full sm:max-w-md bg-white dark:bg-slate-900 shadow-2xl flex flex-col justify-between border-l border-slate-200 dark:border-slate-800"
            >
              
              {/* Header (Navy Blue) */}
              <div className="bg-brand-navy text-white px-5 py-4 flex items-center justify-between shadow-md">
                <div className="flex items-center space-x-2.5">
                  <div className="w-8 h-8 rounded-lg bg-brand-orange/20 flex items-center justify-center text-brand-orange">
                    <ShoppingBag className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-base font-extrabold tracking-tight">Shopping Cart</h2>
                    <p className="text-xs text-white/70">
                      {totalItems} {totalItems === 1 ? 'item' : 'items'} in your bag
                    </p>
                  </div>
                </div>

                <button
                  onClick={closeCart}
                  className="p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/10 active:scale-95 transition-all"
                  aria-label="Close cart"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Free Shipping Progress Meter */}
              <div className="bg-slate-50 dark:bg-slate-800/60 p-3.5 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between text-xs mb-1.5 font-medium">
                  <span className="flex items-center space-x-1.5 text-slate-700 dark:text-slate-200">
                    <Truck className="w-4 h-4 text-brand-orange" />
                    {amountNeededForFreeShipping === 0 ? (
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                        🎉 You've unlocked FREE Express Delivery!
                      </span>
                    ) : (
                      <span>
                        Add <strong className="text-brand-orange font-bold">${amountNeededForFreeShipping.toFixed(2)}</strong> more for FREE Shipping
                      </span>
                    )}
                  </span>
                  <span className="text-[11px] text-slate-400 font-bold">
                    ${subtotal.toFixed(0)} / ${freeShippingThreshold}
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${freeShippingProgress}%` }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                    className={`h-full rounded-full ${
                      amountNeededForFreeShipping === 0 ? 'bg-emerald-500' : 'bg-brand-orange'
                    }`}
                  />
                </div>
              </div>

              {/* Cart Items List */}
              <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-3">
                {cart.length === 0 ? (
                  /* Empty State */
                  <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                    <div className="w-20 h-20 rounded-full bg-orange-50 dark:bg-orange-950/40 flex items-center justify-center text-brand-orange">
                      <ShoppingBag className="w-10 h-10 stroke-[1.5]" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
                        Your UR Cart is empty
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs">
                        Explore our latest haute couture, street drops, and accessories.
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        closeCart();
                        onExploreProducts();
                      }}
                      className="px-6 py-2.5 rounded-xl bg-brand-orange hover:bg-brand-orange-hover text-brand-navy font-bold text-xs shadow-glow-orange active:scale-95 transition-all"
                    >
                      Start Shopping Now
                    </button>
                  </div>
                ) : (
                  cart.map((item) => (
                    <motion.div
                      layout
                      key={item.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="p-3 bg-white dark:bg-slate-800/80 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-sm flex items-center space-x-3 group"
                    >
                      {/* Product Thumbnail */}
                      <img
                        src={item.product.image}
                        alt={item.product.title}
                        className="w-20 h-24 rounded-xl object-cover bg-slate-100 dark:bg-slate-700 shrink-0"
                      />

                      {/* Item Details */}
                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-start justify-between">
                          <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate pr-2">
                            {item.product.title}
                          </h4>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-slate-400 hover:text-rose-500 p-1 transition-colors"
                            aria-label="Remove item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Variant Badges */}
                        <div className="flex items-center space-x-2 text-[11px] text-slate-500 dark:text-slate-400">
                          <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-700 font-semibold">
                            Size: {item.selectedSize}
                          </span>
                          <span className="flex items-center space-x-1">
                            <span
                              className="w-2.5 h-2.5 rounded-full border border-black/20"
                              style={{ backgroundColor: item.selectedColor.hex }}
                            />
                            <span>{item.selectedColor.name}</span>
                          </span>
                        </div>

                        {/* Price & Quantity Stepper */}
                        <div className="flex items-center justify-between pt-1">
                          <span className="text-sm font-extrabold text-slate-900 dark:text-white">
                            ${(item.product.price * item.quantity).toFixed(2)}
                          </span>

                          <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden bg-slate-50 dark:bg-slate-900">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="p-1 px-2 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="px-2 text-xs font-bold text-slate-800 dark:text-slate-100">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="p-1 px-2 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300"
                              aria-label="Increase quantity"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </div>

                      </div>
                    </motion.div>
                  ))
                )}
              </div>

              {/* Bottom Footer Section: Promo Code + Order Summary + Primary Action */}
              {cart.length > 0 && (
                <div className="p-4 bg-slate-50 dark:bg-slate-900/90 border-t border-slate-200 dark:border-slate-800 space-y-3 pb-safe">
                  
                  {/* Promo Code Input */}
                  <div className="space-y-1">
                    {appliedPromo ? (
                      <div className="flex items-center justify-between bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 px-3 py-2 rounded-xl text-xs text-emerald-700 dark:text-emerald-300">
                        <span className="flex items-center space-x-1.5 font-bold">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>Promo code "{appliedPromo}" active</span>
                        </span>
                        <button
                          onClick={removePromoCode}
                          className="text-rose-500 font-bold hover:underline"
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <form onSubmit={handleApplyPromo} className="flex space-x-2">
                        <div className="relative flex-1">
                          <Tag className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                          <input
                            type="text"
                            value={promoInput}
                            onChange={(e) => setPromoInput(e.target.value)}
                            placeholder="Promo code (e.g. URVIP15)"
                            className="w-full h-9 pl-9 pr-3 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 text-xs border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-1 focus:ring-brand-orange uppercase font-mono"
                          />
                        </div>
                        <button
                          type="submit"
                          className="px-3.5 h-9 rounded-xl bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 text-slate-800 dark:text-white text-xs font-bold transition-colors"
                        >
                          Apply
                        </button>
                      </form>
                    )}

                    {promoMessage && !appliedPromo && (
                      <p className={`text-[11px] font-medium ${promoMessage.isError ? 'text-rose-500' : 'text-emerald-500'}`}>
                        {promoMessage.text}
                      </p>
                    )}
                  </div>

                  {/* Summary Breakdown */}
                  <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300 pt-1">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span className="font-semibold text-slate-900 dark:text-white">${subtotal.toFixed(2)}</span>
                    </div>

                    {discount > 0 && (
                      <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-semibold">
                        <span>Discount Savings</span>
                        <span>-${discount.toFixed(2)}</span>
                      </div>
                    )}

                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <span>
                        {shipping === 0 ? (
                          <span className="text-emerald-600 dark:text-emerald-400 font-bold">FREE</span>
                        ) : (
                          `$${shipping.toFixed(2)}`
                        )}
                      </span>
                    </div>

                    <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex justify-between items-baseline">
                      <span className="text-sm font-extrabold text-slate-900 dark:text-white">Order Total</span>
                      <span className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                        ${totalPrice.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Required "Proceed to Checkout" Action Button (Amazon-grade vibrant orange) */}
                  <button
                    onClick={handleCheckoutClick}
                    className="w-full py-3.5 rounded-xl bg-brand-orange hover:bg-brand-orange-hover active:bg-brand-orange-active text-brand-navy font-extrabold text-sm flex items-center justify-center space-x-2 shadow-glow-orange active:scale-[0.98] transition-all"
                  >
                    <Lock className="w-4 h-4 stroke-[2.5]" />
                    <span>Proceed to Checkout (${totalPrice.toFixed(2)})</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  {/* Trust Guarantees */}
                  <div className="flex items-center justify-center space-x-4 text-[10px] text-slate-400 font-medium pt-1">
                    <span className="flex items-center space-x-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                      <span>256-Bit SSL Encrypted</span>
                    </span>
                    <span>•</span>
                    <span>30-Day Money Back</span>
                  </div>

                </div>
              )}

            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};
