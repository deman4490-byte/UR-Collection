import React from 'react';
import { motion } from 'framer-motion';
import { Home, LayoutGrid, ShoppingCart, User, Heart } from 'lucide-react';
import { CategoryType } from '../../types';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { triggerHaptic } from '../../utils/haptics';

export type TabType = 'home' | 'categories' | 'wishlist' | 'cart' | 'profile';

interface BottomTabBarProps {
  activeTab: TabType;
  onChangeTab: (tab: TabType) => void;
  onOpenCategories: () => void;
  onOpenProfile: () => void;
}

export const BottomTabBar: React.FC<BottomTabBarProps> = ({
  activeTab,
  onChangeTab,
  onOpenCategories,
  onOpenProfile
}) => {
  const { totalItems, openCart } = useCart();
  const { wishlistCount } = useWishlist();

  const handleTabClick = (tab: TabType) => {
    triggerHaptic('light');
    if (tab === 'cart') {
      openCart();
      return;
    }
    if (tab === 'categories') {
      onOpenCategories();
      return;
    }
    if (tab === 'profile') {
      onOpenProfile();
      return;
    }
    onChangeTab(tab);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-t border-slate-200/90 dark:border-slate-800 shadow-mobile-tab pb-safe">
      <div className="grid grid-cols-4 h-14 items-center px-1">
        
        {/* Tab 1: Home */}
        <button
          onClick={() => handleTabClick('home')}
          className="relative flex flex-col items-center justify-center h-full active:scale-95 transition-transform"
          aria-label="Home"
        >
          <Home className={`w-5 h-5 transition-colors ${
            activeTab === 'home' 
              ? 'text-brand-orange stroke-[2.5]' 
              : 'text-slate-500 dark:text-slate-400'
          }`} />
          <span className={`text-[10px] mt-1 transition-colors ${
            activeTab === 'home'
              ? 'text-brand-orange font-bold'
              : 'text-slate-500 dark:text-slate-400 font-medium'
          }`}>
            Home
          </span>
          {activeTab === 'home' && (
            <motion.div 
              layoutId="bottomTabIndicator"
              className="absolute top-0 w-8 h-1 bg-brand-orange rounded-b-full shadow-sm"
              transition={{ type: 'spring', stiffness: 500, damping: 35 }}
            />
          )}
        </button>

        {/* Tab 2: Categories */}
        <button
          onClick={() => handleTabClick('categories')}
          className="relative flex flex-col items-center justify-center h-full active:scale-95 transition-transform"
          aria-label="Categories"
        >
          <LayoutGrid className={`w-5 h-5 transition-colors ${
            activeTab === 'categories' 
              ? 'text-brand-orange stroke-[2.5]' 
              : 'text-slate-500 dark:text-slate-400'
          }`} />
          <span className={`text-[10px] mt-1 transition-colors ${
            activeTab === 'categories'
              ? 'text-brand-orange font-bold'
              : 'text-slate-500 dark:text-slate-400 font-medium'
          }`}>
            Categories
          </span>
          {activeTab === 'categories' && (
            <motion.div 
              layoutId="bottomTabIndicator"
              className="absolute top-0 w-8 h-1 bg-brand-orange rounded-b-full shadow-sm"
              transition={{ type: 'spring', stiffness: 500, damping: 35 }}
            />
          )}
        </button>

        {/* Tab 3: Cart (Live Badge) */}
        <button
          onClick={() => handleTabClick('cart')}
          className="relative flex flex-col items-center justify-center h-full active:scale-95 transition-transform"
          aria-label="Cart"
        >
          <div className="relative">
            <ShoppingCart className={`w-5 h-5 transition-colors ${
              totalItems > 0
                ? 'text-brand-orange stroke-[2.5]'
                : 'text-slate-500 dark:text-slate-400'
            }`} />
            
            {totalItems > 0 && (
              <span className="absolute -top-1.5 -right-2.5 min-w-[18px] h-4 px-1 rounded-full bg-brand-orange text-brand-navy font-black text-[10px] flex items-center justify-center shadow-sm">
                {totalItems}
              </span>
            )}
          </div>
          <span className={`text-[10px] mt-1 font-medium ${
            totalItems > 0 ? 'text-brand-orange font-bold' : 'text-slate-500 dark:text-slate-400'
          }`}>
            Cart
          </span>
        </button>

        {/* Tab 4: Profile */}
        <button
          onClick={() => handleTabClick('profile')}
          className="relative flex flex-col items-center justify-center h-full active:scale-95 transition-transform"
          aria-label="Profile"
        >
          <User className={`w-5 h-5 transition-colors ${
            activeTab === 'profile' 
              ? 'text-brand-orange stroke-[2.5]' 
              : 'text-slate-500 dark:text-slate-400'
          }`} />
          <span className={`text-[10px] mt-1 transition-colors ${
            activeTab === 'profile'
              ? 'text-brand-orange font-bold'
              : 'text-slate-500 dark:text-slate-400 font-medium'
          }`}>
            Profile
          </span>
          {activeTab === 'profile' && (
            <motion.div 
              layoutId="bottomTabIndicator"
              className="absolute top-0 w-8 h-1 bg-brand-orange rounded-b-full shadow-sm"
              transition={{ type: 'spring', stiffness: 500, damping: 35 }}
            />
          )}
        </button>

      </div>
    </div>
  );
};
