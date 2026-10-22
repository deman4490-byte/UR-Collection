import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Flame, SlidersHorizontal } from 'lucide-react';
import { CategoryType } from '../../types';
import { triggerHaptic } from '../../utils/haptics';

interface CategoryPillsProps {
  selectedCategory: CategoryType;
  onSelectCategory: (category: CategoryType) => void;
  activeTag: string | null;
  onToggleTag: (tag: string | null) => void;
  productsCount: number;
}

const CATEGORIES: { label: string; value: CategoryType; icon?: string }[] = [
  { label: 'All', value: 'All' },
  { label: 'Men', value: 'Men' },
  { label: 'Women', value: 'Women' },
  { label: 'Kids', value: 'Kids' },
  { label: 'Accessories', value: 'Accessories' }
];

export const CategoryPills: React.FC<CategoryPillsProps> = ({
  selectedCategory,
  onSelectCategory,
  activeTag,
  onToggleTag,
  productsCount
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const handleSelect = (category: CategoryType) => {
    triggerHaptic('light');
    onSelectCategory(category);
  };

  return (
    <nav 
      aria-label="Category Navigation"
      className="sticky top-[96px] sm:top-[104px] md:top-[68px] z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 shadow-sm transition-colors"
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between gap-3">
        
        {/* Horizontal Scrollable Categories Container */}
        <div 
          ref={containerRef}
          className="flex items-center space-x-2 overflow-x-auto no-scrollbar scroll-smooth py-0.5 flex-1"
        >
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.value && activeTag === null;
            return (
              <button
                key={cat.value}
                onClick={() => {
                  onToggleTag(null);
                  handleSelect(cat.value);
                }}
                className={`relative px-4 py-2 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap transition-all active:scale-95 shrink-0 select-none ${
                  isSelected
                    ? 'text-brand-navy dark:text-brand-navy font-bold shadow-md'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100/80 dark:bg-slate-800/80 hover:bg-slate-200/80 dark:hover:bg-slate-700/80'
                }`}
              >
                {/* Framer Motion Active Spring Pill Indicator */}
                {isSelected && (
                  <motion.div
                    layoutId="activeCategoryPill"
                    className="absolute inset-0 bg-brand-orange rounded-full -z-10 shadow-glow-orange"
                    transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                  />
                )}

                <span className="relative z-10 flex items-center space-x-1.5">
                  <span>{cat.label}</span>
                  {isSelected && (
                    <span className="text-[10px] opacity-80 font-mono">
                      ({productsCount})
                    </span>
                  )}
                </span>
              </button>
            );
          })}

          <div className="h-4 w-px bg-slate-300 dark:bg-slate-700 shrink-0 mx-1" />

          {/* Quick Filter Pill: Deals */}
          <button
            onClick={() => {
              triggerHaptic('light');
              onToggleTag(activeTag === 'Prime' ? null : 'Prime');
            }}
            className={`px-3 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all shrink-0 flex items-center space-x-1 border ${
              activeTag === 'Prime'
                ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                : 'text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-900 bg-blue-50/50 dark:bg-blue-950/40 hover:bg-blue-100/60'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Prime Fast</span>
          </button>

          {/* Quick Filter Pill: Best Seller */}
          <button
            onClick={() => {
              triggerHaptic('light');
              onToggleTag(activeTag === 'Best Seller' ? null : 'Best Seller');
            }}
            className={`px-3 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all shrink-0 flex items-center space-x-1 border ${
              activeTag === 'Best Seller'
                ? 'bg-amber-500 text-brand-navy font-bold border-amber-500 shadow-sm'
                : 'text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-900 bg-amber-50/50 dark:bg-amber-950/40 hover:bg-amber-100/60'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            <span>Best Sellers</span>
          </button>
        </div>

        {/* Live Filter Indicator count on larger screens */}
        <div className="hidden lg:flex items-center space-x-2 text-xs text-slate-500 dark:text-slate-400 shrink-0 font-medium">
          <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
          <span>Showing {productsCount} results</span>
        </div>
      </div>
    </nav>
  );
};
