import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowUpDown, 
  Sparkles, 
  Filter, 
  PackageX, 
  RotateCcw,
  CheckCircle2
} from 'lucide-react';
import { Product, CategoryType } from '../../types';
import { ProductCard } from './ProductCard';
import { ProductQuickViewModal } from './ProductQuickViewModal';
import { triggerHaptic } from '../../utils/haptics';

interface ProductGridProps {
  products: Product[];
  isLoading?: boolean;
  selectedCategory: CategoryType;
  searchQuery: string;
  activeTag: string | null;
  onClearFilters: () => void;
  onInstantCheckout?: (product: Product, size: string, color: { name: string; hex: string }, qty: number) => void;
}

export type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'rating' | 'discount';

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  isLoading = false,
  selectedCategory,
  searchQuery,
  activeTag,
  onClearFilters,
  onInstantCheckout
}) => {
  const [sortBy, setSortBy] = useState<SortOption>('featured');
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [primeOnly, setPrimeOnly] = useState(false);

  // Filter and sort products
  const filteredProducts = products.filter((item) => {
    if (primeOnly && !item.primeEligible) return false;
    return true;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-asc':
        return a.price - b.price;
      case 'price-desc':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      case 'discount':
        return (b.discountPercent || 0) - (a.discountPercent || 0);
      case 'featured':
      default:
        return 0;
    }
  });

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-4">
      {/* Controls Bar: Results Count, Sort Dropdown & Prime Filter */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-slate-900/80 p-3 sm:p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
        
        {/* Results title & category breadcrumb */}
        <div className="flex items-center space-x-2">
          <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
            {selectedCategory === 'All' ? 'All Collections' : `${selectedCategory}'s Collection`}
          </span>
          <span className="text-xs text-slate-400">
            ({sortedProducts.length} items)
          </span>

          {searchQuery && (
            <span className="text-xs text-brand-orange font-semibold bg-brand-orange/10 px-2 py-0.5 rounded-full">
              "{searchQuery}"
            </span>
          )}

          {activeTag && (
            <span className="text-xs text-blue-600 dark:text-blue-400 font-semibold bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded-full">
              {activeTag}
            </span>
          )}
        </div>

        {/* Sort and Prime Controls */}
        <div className="flex items-center space-x-2 sm:space-x-3 ml-auto text-xs">
          
          {/* Prime Toggle Filter */}
          <button
            onClick={() => {
              triggerHaptic('light');
              setPrimeOnly((prev) => !prev);
            }}
            className={`px-3 py-1.5 rounded-xl font-bold flex items-center space-x-1.5 transition-all ${
              primeOnly
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Prime Fast</span>
            {primeOnly && <CheckCircle2 className="w-3.5 h-3.5 ml-0.5" />}
          </button>

          {/* Sort By Dropdown */}
          <div className="relative flex items-center">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 pointer-events-none" />
            <select
              value={sortBy}
              onChange={(e) => {
                triggerHaptic('light');
                setSortBy(e.target.value as SortOption);
              }}
              className="h-8 pl-8 pr-6 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-brand-orange cursor-pointer transition-colors"
            >
              <option value="featured">Featured / Best Match</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Highest Customer Rating</option>
              <option value="discount">Biggest Savings</option>
            </select>
          </div>
        </div>

      </div>

      {/* Loading Skeleton State */}
      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 animate-pulse p-3 space-y-3"
            >
              <div className="aspect-[3/4] bg-slate-200 dark:bg-slate-800 rounded-xl" />
              <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-2/3" />
              <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-full" />
              <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded-xl" />
            </div>
          ))}
        </div>
      ) : sortedProducts.length === 0 ? (
        /* Empty State */
        <div className="py-16 text-center space-y-4 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8">
          <div className="w-16 h-16 mx-auto rounded-full bg-orange-50 dark:bg-orange-950/40 flex items-center justify-center text-brand-orange">
            <PackageX className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-100">
              No UR Collection items match your filters
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
              We couldn't find any items matching "{searchQuery || activeTag || selectedCategory}". 
              Try resetting your filters or exploring our other luxury departments.
            </p>
          </div>
          <button
            onClick={() => {
              triggerHaptic('medium');
              setPrimeOnly(false);
              onClearFilters();
            }}
            className="px-5 py-2.5 rounded-xl bg-brand-navy hover:bg-brand-navy-light text-white font-bold text-xs inline-flex items-center space-x-2 shadow-md transition-all active:scale-95"
          >
            <RotateCcw className="w-4 h-4 text-brand-orange" />
            <span>Reset All Filters</span>
          </button>
        </div>
      ) : (
        /* The Required Product Grid: 2-column mobile layout, 4-column desktop */
        <motion.div 
          layout
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5"
        >
          <AnimatePresence>
            {sortedProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onQuickView={(p) => setQuickViewProduct(p)}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Quick View Modal */}
      <ProductQuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onInstantCheckout={onInstantCheckout}
      />
    </div>
  );
};
