import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, 
  Search, 
  ShoppingCart, 
  MapPin, 
  X, 
  Sun, 
  Moon, 
  Heart, 
  User, 
  ChevronDown,
  Sparkles 
} from 'lucide-react';
import { CategoryType } from '../../types';
import { useCart } from '../../context/CartContext';
import { useTheme } from '../../context/ThemeContext';
import { useWishlist } from '../../context/WishlistContext';
import { useStoreSettings } from '../../context/StoreSettingsContext';
import { SearchAutocomplete } from './SearchAutocomplete';
import { MobileDrawer } from './MobileDrawer';
import { triggerHaptic } from '../../utils/haptics';

interface GlobalHeaderProps {
  selectedCategory: CategoryType;
  onSelectCategory: (category: CategoryType) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onOpenProfile: () => void;
}

export const GlobalHeader: React.FC<GlobalHeaderProps> = ({
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  onOpenProfile
}) => {
  const { totalItems, subtotal, openCart } = useCart();
  const { isDark, toggleTheme } = useTheme();
  const { wishlistCount } = useWishlist();
  const { settings, currencySymbol } = useStoreSettings();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [cartBadgeAnimate, setCartBadgeAnimate] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Trigger bounce animation when totalItems changes
  useEffect(() => {
    if (totalItems > 0) {
      setCartBadgeAnimate(true);
      const timer = setTimeout(() => setCartBadgeAnimate(false), 600);
      return () => clearTimeout(timer);
    }
  }, [totalItems]);

  const handleClearSearch = () => {
    onSearchChange('');
    searchInputRef.current?.focus();
    triggerHaptic('light');
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearchFocused(false);
    triggerHaptic('medium');
    searchInputRef.current?.blur();
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-brand-navy text-white shadow-lg select-none pt-safe transition-colors">
        {/* Amazon-style Top Delivery Location & Utility Bar */}
        <div className="hidden sm:flex items-center justify-between px-4 lg:px-8 py-1.5 text-xs bg-brand-navy-deep/80 border-b border-white/10 text-white/80">
          <div className="flex items-center space-x-2">
            <MapPin className="w-3.5 h-3.5 text-brand-orange animate-pulse" />
            <span className="text-white/60">Deliver to</span>
            <button 
              onClick={onOpenProfile}
              className="font-semibold text-white hover:text-brand-orange flex items-center space-x-1 transition-colors"
            >
              <span>Shan • New York 10001</span>
              <ChevronDown className="w-3 h-3" />
            </button>
          </div>

          <div className="flex items-center space-x-6">
            <span className="flex items-center space-x-1 text-brand-orange font-medium">
              <Sparkles className="w-3 h-3" />
              <span>UR Prime: Free Next-Day Delivery on eligible orders</span>
            </span>
            <div className="flex items-center space-x-4">
              <button 
                onClick={onOpenProfile} 
                className="hover:text-white transition-colors"
              >
                Order Status
              </button>
              <button 
                onClick={onOpenProfile} 
                className="hover:text-white transition-colors"
              >
                Help & Contact
              </button>
            </div>
          </div>
        </div>

        {/* Main Header Container */}
        <div className="px-3 sm:px-6 lg:px-8 py-2.5 sm:py-3">
          <div className="flex items-center justify-between gap-2 sm:gap-4">
            
            {/* Left Section: Hamburger + Brand Logo */}
            <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
              {/* Hamburger Button */}
              <button
                onClick={() => {
                  triggerHaptic('light');
                  setIsDrawerOpen(true);
                }}
                className="p-2 -ml-1 rounded-xl text-white hover:bg-white/10 active:scale-95 transition-all focus:outline-none focus:ring-2 focus:ring-brand-orange"
                aria-label="Open Navigation Menu"
              >
                <Menu className="w-6 h-6 sm:w-7 sm:h-7" />
              </button>

              {/* Brand Logo - Powered by Dynamic Shop Name */}
              <div 
                onClick={() => onSelectCategory('All')}
                className="flex items-center space-x-2 cursor-pointer group"
              >
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-brand-orange to-amber-400 flex items-center justify-center font-black text-brand-navy shadow-md group-hover:scale-105 transition-transform">
                  <span className="text-base sm:text-lg tracking-tighter">
                    {settings.shopName.slice(0, 2).toUpperCase() || 'UR'}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="font-extrabold text-base sm:text-xl tracking-tight text-white leading-none">
                    {settings.shopName.toUpperCase()}
                  </span>
                  <span className="text-[9px] font-semibold tracking-widest text-brand-orange uppercase">
                    {settings.tagline || 'HAUTE & STREET'}
                  </span>
                </div>
              </div>
            </div>

            {/* Middle Section: Prominent Search Bar (Desktop / Tablet view) */}
            <div className="flex-1 max-w-3xl relative hidden md:block">
              <form onSubmit={handleSearchSubmit} className="relative flex items-center">
                {/* Embedded Category Dropdown */}
                <div className="relative shrink-0">
                  <select
                    value={selectedCategory}
                    onChange={(e) => onSelectCategory(e.target.value as CategoryType)}
                    className="h-11 pl-3 pr-8 rounded-l-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-semibold border-r border-slate-300 dark:border-slate-700 hover:bg-slate-200 cursor-pointer focus:outline-none appearance-none transition-colors"
                  >
                    <option value="All">All Departments</option>
                    <option value="Men">Men</option>
                    <option value="Women">Women</option>
                    <option value="Kids">Kids</option>
                    <option value="Accessories">Accessories</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>

                {/* Search Input Field */}
                <div className="relative flex-1">
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    onFocus={() => setIsSearchFocused(true)}
                    placeholder="Search overcoats, cashmere dresses, selvedge denim..."
                    className="w-full h-11 px-4 text-sm text-slate-900 bg-white placeholder:text-slate-400 focus:outline-none transition-shadow"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={handleClearSearch}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Vibrant Orange Action Button */}
                <button
                  type="submit"
                  className="h-11 px-5 rounded-r-xl bg-brand-orange hover:bg-brand-orange-hover active:bg-brand-orange-active text-brand-navy font-bold flex items-center justify-center transition-all shadow-glow-orange active:scale-[0.98]"
                  aria-label="Submit Search"
                >
                  <Search className="w-5 h-5 stroke-[2.5]" />
                </button>
              </form>

              {/* Autocomplete Dropdown */}
              <SearchAutocomplete
                isOpen={isSearchFocused}
                query={searchQuery}
                onSelectSuggestion={(term) => {
                  onSearchChange(term);
                  setIsSearchFocused(false);
                }}
                onClose={() => setIsSearchFocused(false)}
                selectedCategory={selectedCategory}
              />
            </div>

            {/* Right Section: Theme Toggle, Wishlist, Profile & Live Cart */}
            <div className="flex items-center space-x-1 sm:space-x-3 shrink-0">
              
              {/* Dark / Light Mode Toggle */}
              <button
                onClick={() => {
                  triggerHaptic('light');
                  toggleTheme();
                }}
                className="p-2 rounded-xl text-white/90 hover:text-white hover:bg-white/10 active:scale-95 transition-all"
                title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                aria-label="Toggle Theme"
              >
                {isDark ? (
                  <Sun className="w-5 h-5 text-amber-300" />
                ) : (
                  <Moon className="w-5 h-5 text-white/90" />
                )}
              </button>

              {/* Wishlist Icon (Desktop / Tablet) */}
              <button
                onClick={onOpenProfile}
                className="hidden sm:flex relative p-2 rounded-xl text-white/90 hover:text-white hover:bg-white/10 active:scale-95 transition-all"
                title="Wishlist"
              >
                <Heart className="w-5 h-5" />
                {wishlistCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center shadow">
                    {wishlistCount}
                  </span>
                )}
              </button>

              {/* Account / Profile (Desktop) */}
              <button
                onClick={onOpenProfile}
                className="hidden lg:flex items-center space-x-1.5 p-2 rounded-xl hover:bg-white/10 transition-colors text-left"
              >
                <div className="w-7 h-7 rounded-full bg-brand-orange text-brand-navy font-bold text-xs flex items-center justify-center">
                  S
                </div>
                <div className="text-xs leading-tight">
                  <span className="block text-white/60">Shan's</span>
                  <span className="font-bold text-white flex items-center space-x-0.5">
                    <span>Account</span>
                    <ChevronDown className="w-3 h-3 text-white/60" />
                  </span>
                </div>
              </button>

              {/* Live Cart Icon with Animated Badge & Subtotal */}
              <button
                onClick={() => {
                  triggerHaptic('medium');
                  openCart();
                }}
                className="relative flex items-center space-x-2 pl-2.5 pr-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 active:scale-95 transition-all border border-white/10"
                aria-label={`View Cart (${totalItems} items)`}
              >
                <div className="relative">
                  <ShoppingCart className="w-6 h-6 text-brand-orange" />
                  
                  {/* Animated Cart Badge */}
                  <AnimatePresence>
                    {totalItems > 0 && (
                      <motion.span
                        key={totalItems}
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ 
                          scale: cartBadgeAnimate ? [1, 1.4, 1] : 1, 
                          opacity: 1 
                        }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="absolute -top-2 -right-2 min-w-[20px] h-5 px-1 rounded-full bg-brand-orange text-brand-navy font-extrabold text-[11px] flex items-center justify-center shadow-lg border border-brand-navy"
                      >
                        {totalItems}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>

                {/* Cart Subtotal on Desktop */}
                <div className="hidden sm:flex flex-col text-left leading-none">
                  <span className="text-[10px] text-white/60 font-medium">Cart</span>
                  <span className="text-xs font-bold text-white tracking-tight">
                    {currencySymbol}{subtotal.toFixed(2)}
                  </span>
                </div>
              </button>
            </div>
          </div>

          {/* Mobile Search Bar (Prominent row below logo on small screens) */}
          <div className="mt-2.5 md:hidden relative">
            <form onSubmit={handleSearchSubmit} className="relative flex items-center">
              <div className="relative flex-1">
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  placeholder="Search overcoats, dresses, denim..."
                  className="w-full h-10 pl-10 pr-9 rounded-xl bg-white text-slate-900 placeholder:text-slate-400 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-brand-orange shadow-inner"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={handleClearSearch}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded-full"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </form>

            {/* Mobile Autocomplete */}
            <SearchAutocomplete
              isOpen={isSearchFocused}
              query={searchQuery}
              onSelectSuggestion={(term) => {
                onSearchChange(term);
                setIsSearchFocused(false);
              }}
              onClose={() => setIsSearchFocused(false)}
              selectedCategory={selectedCategory}
            />
          </div>
        </div>
      </header>

      {/* Slide-out Mobile Navigation Drawer */}
      <MobileDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        selectedCategory={selectedCategory}
        onSelectCategory={onSelectCategory}
        onOpenProfile={onOpenProfile}
      />
    </>
  );
};
