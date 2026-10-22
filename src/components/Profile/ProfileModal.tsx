import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  User, 
  Package, 
  Heart, 
  Sparkles, 
  MapPin, 
  CreditCard, 
  Sun, 
  Moon, 
  ChevronRight, 
  ShoppingCart,
  Trash2,
  ExternalLink
} from 'lucide-react';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';
import { useTheme } from '../../context/ThemeContext';
import { MOCK_FIRESTORE_PRODUCTS } from '../../services/firebaseService';
import { triggerHaptic } from '../../utils/haptics';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose
}) => {
  const { wishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { isDark, toggleTheme } = useTheme();

  const [activeTab, setActiveTab] = useState<'orders' | 'wishlist' | 'settings'>('orders');

  if (!isOpen) return null;

  const wishlistedProducts = MOCK_FIRESTORE_PRODUCTS.filter((p) => wishlist.includes(p.id));

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
          <div className="bg-brand-navy p-6 text-white flex items-center justify-between shadow-md">
            <div className="flex items-center space-x-3.5">
              <div className="w-14 h-14 rounded-2xl bg-brand-navy-surface border-2 border-brand-orange flex items-center justify-center text-white font-extrabold text-2xl shadow-inner">
                S
              </div>
              <div>
                <div className="flex items-center space-x-1.5">
                  <h3 className="font-extrabold text-lg tracking-tight">Shan's Account</h3>
                  <Sparkles className="w-4 h-4 text-brand-orange fill-brand-orange" />
                </div>
                <p className="text-xs text-white/70">shan@urcollection.com</p>
                <span className="inline-block mt-1 text-[10px] font-black px-2 py-0.5 rounded bg-brand-orange text-brand-navy">
                  UR PRIME MEMBER
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full text-white/80 hover:text-white hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Profile Tabs */}
          <div className="grid grid-cols-3 border-b border-slate-200 dark:border-slate-800 text-xs font-bold text-center">
            <button
              onClick={() => {
                triggerHaptic('light');
                setActiveTab('orders');
              }}
              className={`py-3 flex items-center justify-center space-x-1.5 border-b-2 transition-colors ${
                activeTab === 'orders'
                  ? 'border-brand-orange text-brand-orange'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-white'
              }`}
            >
              <Package className="w-4 h-4" />
              <span>Orders (2)</span>
            </button>

            <button
              onClick={() => {
                triggerHaptic('light');
                setActiveTab('wishlist');
              }}
              className={`py-3 flex items-center justify-center space-x-1.5 border-b-2 transition-colors ${
                activeTab === 'wishlist'
                  ? 'border-brand-orange text-brand-orange'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-white'
              }`}
            >
              <Heart className="w-4 h-4" />
              <span>Wishlist ({wishlist.length})</span>
            </button>

            <button
              onClick={() => {
                triggerHaptic('light');
                setActiveTab('settings');
              }}
              className={`py-3 flex items-center justify-center space-x-1.5 border-b-2 transition-colors ${
                activeTab === 'settings'
                  ? 'border-brand-orange text-brand-orange'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-white'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Settings</span>
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-5 max-h-[360px] overflow-y-auto custom-scrollbar">
            {activeTab === 'orders' && (
              <div className="space-y-3">
                {/* Simulated Order 1 */}
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-2.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-900 dark:text-white">
                      Order #UR-829104
                    </span>
                    <span className="text-brand-orange font-bold px-2 py-0.5 rounded bg-brand-orange/10">
                      Out for Delivery
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Expected Arrival: <strong className="text-slate-800 dark:text-slate-200">Today by 4:00 PM</strong>
                  </p>
                  
                  {/* Progress bar */}
                  <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-brand-orange h-full w-4/5 rounded-full" />
                  </div>

                  <div className="flex items-center justify-between pt-1 text-[11px]">
                    <span className="text-slate-600 dark:text-slate-400">1 item • $189.00</span>
                    <button className="text-brand-orange font-bold hover:underline">
                      Track Package
                    </button>
                  </div>
                </div>

                {/* Simulated Order 2 */}
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-900 dark:text-white">
                      Order #UR-744019
                    </span>
                    <span className="text-emerald-600 font-bold px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950">
                      Delivered Oct 18
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Artisan Leather Weekender Bag • $198.00
                  </p>
                  <div className="flex items-center justify-end space-x-2 pt-1 text-xs">
                    <button className="px-3 py-1 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-[11px]">
                      View Invoice
                    </button>
                    <button className="px-3 py-1 rounded-lg bg-brand-orange text-brand-navy font-bold text-[11px]">
                      Buy It Again
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'wishlist' && (
              <div className="space-y-2">
                {wishlistedProducts.length === 0 ? (
                  <div className="py-8 text-center text-xs text-slate-500">
                    No items in your wishlist yet. Tap the heart on any product to save it!
                  </div>
                ) : (
                  wishlistedProducts.map((p) => (
                    <div
                      key={p.id}
                      className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between space-x-3"
                    >
                      <img src={p.image} alt={p.title} className="w-12 h-14 object-cover rounded-lg" />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                          {p.title}
                        </h4>
                        <span className="text-xs font-black text-brand-orange">${p.price.toFixed(2)}</span>
                      </div>
                      <div className="flex items-center space-x-1.5">
                        <button
                          onClick={() => {
                            addToCart(p);
                            triggerHaptic('success');
                          }}
                          className="px-2.5 py-1.5 rounded-lg bg-brand-orange text-brand-navy text-[11px] font-bold flex items-center space-x-1"
                        >
                          <ShoppingCart className="w-3 h-3" />
                          <span>Add</span>
                        </button>
                        <button
                          onClick={() => toggleWishlist(p.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-500"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="space-y-3 text-xs">
                {/* Theme Selector */}
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {isDark ? <Moon className="w-4 h-4 text-indigo-400" /> : <Sun className="w-4 h-4 text-brand-orange" />}
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      Display Theme
                    </span>
                  </div>
                  <button
                    onClick={toggleTheme}
                    className="px-3 py-1 rounded-lg bg-brand-navy text-white font-bold text-[11px]"
                  >
                    {isDark ? 'Dark Mode' : 'Light Mode'}
                  </button>
                </div>

                {/* Shipping address */}
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-slate-500" />
                    <div>
                      <span className="font-bold text-slate-800 dark:text-slate-200 block">
                        Saved Shipping Address
                      </span>
                      <span className="text-[11px] text-slate-400">450 Lexington Ave, New York</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </div>

                {/* Payment card */}
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <CreditCard className="w-4 h-4 text-slate-500" />
                    <div>
                      <span className="font-bold text-slate-800 dark:text-slate-200 block">
                        Default Payment Card
                      </span>
                      <span className="text-[11px] text-slate-400">UR Prime Rewards Visa (4242)</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-400">Capacitor Safe-Area Ready</span>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-brand-navy hover:bg-brand-navy-light text-white font-bold"
            >
              Done
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
