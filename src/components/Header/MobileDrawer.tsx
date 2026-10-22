import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  User, 
  ShoppingBag, 
  Sparkles, 
  Sun, 
  Moon, 
  ChevronRight, 
  Package, 
  Heart, 
  HelpCircle, 
  ShieldCheck, 
  LogOut,
  ShieldAlert
} from 'lucide-react';
import { CategoryType } from '../../types';
import { useTheme } from '../../context/ThemeContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useStoreSettings } from '../../context/StoreSettingsContext';

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCategory: CategoryType;
  onSelectCategory: (category: CategoryType) => void;
  onOpenProfile: () => void;
}

const CATEGORIES: { label: string; value: CategoryType; badge?: string }[] = [
  { label: 'All Departments', value: 'All' },
  { label: "Men's Collection", value: 'Men', badge: 'New Drops' },
  { label: "Women's Haute", value: 'Women', badge: 'Hot' },
  { label: 'Kids & Juniors', value: 'Kids' },
  { label: 'Accessories & Leather', value: 'Accessories' }
];

export const MobileDrawer: React.FC<MobileDrawerProps> = ({
  isOpen,
  onClose,
  selectedCategory,
  onSelectCategory,
  onOpenProfile
}) => {
  const { isDark, toggleTheme } = useTheme();
  const { openCart, totalItems } = useCart();
  const { wishlistCount } = useWishlist();
  const { settings } = useStoreSettings();

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Drawer Content */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            className="relative w-full max-w-xs sm:max-w-sm h-full bg-white dark:bg-slate-900 shadow-2xl flex flex-col z-10"
          >
            {/* Drawer Header (Navy Blue) */}
            <div className="bg-brand-navy p-5 text-white flex items-center justify-between shadow-md">
              <div 
                onClick={() => {
                  onClose();
                  onOpenProfile();
                }}
                className="flex items-center space-x-3 cursor-pointer group"
              >
                <div className="w-11 h-11 rounded-full bg-brand-navy-surface border-2 border-brand-orange flex items-center justify-center text-white font-bold text-lg shadow-inner">
                  S
                </div>
                <div>
                  <div className="flex items-center space-x-1.5">
                    <span className="font-semibold text-base">Hello, Shan</span>
                    <Sparkles className="w-3.5 h-3.5 text-brand-orange fill-brand-orange" />
                  </div>
                  <span className="text-xs text-brand-orange font-medium tracking-wide flex items-center">
                    UR Prime Member
                  </span>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-white/10 active:scale-95 transition-all text-white/80 hover:text-white"
                aria-label="Close menu"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Quick Stats Strip */}
            <div className="bg-slate-100 dark:bg-slate-800/80 px-4 py-3 flex items-center justify-around border-b border-slate-200 dark:border-slate-800 text-xs">
              <button 
                onClick={() => { onClose(); openCart(); }}
                className="flex items-center space-x-1.5 font-medium text-slate-700 dark:text-slate-200 hover:text-brand-orange transition-colors"
              >
                <ShoppingBag className="w-4 h-4 text-brand-orange" />
                <span>Cart ({totalItems})</span>
              </button>
              <div className="h-4 w-px bg-slate-300 dark:bg-slate-700" />
              <button 
                onClick={() => { onClose(); onOpenProfile(); }}
                className="flex items-center space-x-1.5 font-medium text-slate-700 dark:text-slate-200 hover:text-brand-orange transition-colors"
              >
                <Heart className="w-4 h-4 text-rose-500" />
                <span>Wishlist ({wishlistCount})</span>
              </button>
            </div>

            {/* Navigation Body */}
            <div className="flex-1 overflow-y-auto custom-scrollbar py-4 px-3 space-y-6">
              {/* Category Section */}
              <div>
                <p className="px-3 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
                  Shop by Department
                </p>
                <div className="space-y-1">
                  {CATEGORIES.map((cat) => {
                    const isActive = selectedCategory === cat.value;
                    return (
                      <button
                        key={cat.value}
                        onClick={() => {
                          onSelectCategory(cat.value);
                          onClose();
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                          isActive
                            ? 'bg-brand-orange/10 text-brand-orange dark:bg-brand-orange/20 font-semibold'
                            : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                        }`}
                      >
                        <span className="flex items-center space-x-2.5">
                          <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-brand-orange' : 'bg-transparent'}`} />
                          <span>{cat.label}</span>
                        </span>
                        <div className="flex items-center space-x-2">
                          {cat.badge && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-orange text-white">
                              {cat.badge}
                            </span>
                          )}
                          <ChevronRight className="w-4 h-4 text-slate-400" />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Prime & Account Utilities */}
              <div>
                <p className="px-3 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
                  Your Account & Perks
                </p>
                <div className="space-y-1">
                  <button 
                    onClick={() => { onClose(); onOpenProfile(); }}
                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60"
                  >
                    <span className="flex items-center space-x-3">
                      <Package className="w-4 h-4 text-slate-500" />
                      <span>Your Orders & Tracking</span>
                    </span>
                    <span className="text-xs text-slate-400">3 active</span>
                  </button>

                  <button 
                    onClick={() => { onClose(); onOpenProfile(); }}
                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60"
                  >
                    <span className="flex items-center space-x-3">
                      <Sparkles className="w-4 h-4 text-brand-orange" />
                      <span>UR Prime Benefits</span>
                    </span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-brand-navy text-brand-orange">
                      ACTIVE
                    </span>
                  </button>

                  <button 
                    onClick={() => { onClose(); onOpenProfile(); }}
                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60"
                  >
                    <span className="flex items-center space-x-3">
                      <ShieldCheck className="w-4 h-4 text-emerald-500" />
                      <span>Buyer Protection Guarantee</span>
                    </span>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </button>

                  <button 
                    onClick={() => { onClose(); onOpenProfile(); }}
                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60"
                  >
                    <span className="flex items-center space-x-3">
                      <HelpCircle className="w-4 h-4 text-slate-500" />
                      <span>24/7 Live Concierge Help</span>
                    </span>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </button>
                </div>
              </div>

              {/* Theme Toggle Button */}
              <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
                <button
                  onClick={toggleTheme}
                  className="w-full flex items-center justify-between px-3 py-3 rounded-xl bg-slate-100 dark:bg-slate-800/60 text-sm font-medium text-slate-800 dark:text-slate-100 transition-all active:scale-[0.99]"
                >
                  <span className="flex items-center space-x-3">
                    {isDark ? (
                      <Moon className="w-4 h-4 text-indigo-400" />
                    ) : (
                      <Sun className="w-4 h-4 text-brand-orange" />
                    )}
                    <span>{isDark ? 'Dark Mode Enabled' : 'Light Mode Enabled'}</span>
                  </span>
                  <div className="w-10 h-5 bg-slate-300 dark:bg-brand-orange/60 rounded-full relative p-0.5 transition-colors">
                    <motion.div
                      layout
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      className={`w-4 h-4 rounded-full bg-white shadow-sm ${
                        isDark ? 'ml-auto' : 'ml-0'
                      }`}
                    />
                  </div>
                </button>
              </div>
            </div>

            {/* Bottom Footer */}
            <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/90 text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between">
              <span className="font-medium">UR Collection v2.4 Native</span>
              <button 
                onClick={onClose}
                className="flex items-center space-x-1 text-slate-600 dark:text-slate-400 hover:text-rose-500 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Close</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
