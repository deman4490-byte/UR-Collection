import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, TrendingUp, Sparkles, Clock, ArrowUpRight } from 'lucide-react';
import { CategoryType } from '../../types';

interface SearchAutocompleteProps {
  isOpen: boolean;
  query: string;
  onSelectSuggestion: (term: string) => void;
  onClose: () => void;
  selectedCategory: CategoryType;
}

const TRENDING_KEYWORDS = [
  'Italian Wool Overcoat',
  'Cashmere Knit Dress',
  'Selvedge Denim',
  'Artisan Leather Bag',
  'Titanium Sunglasses',
  'Supima Cotton Hoodie',
  'Kids Puffer Parka'
];

const RECENT_SEARCHES = [
  'Winter Jacket',
  'Prime Deals',
  'Oxford Shirt'
];

export const SearchAutocomplete: React.FC<SearchAutocompleteProps> = ({
  isOpen,
  query,
  onSelectSuggestion,
  onClose,
  selectedCategory
}) => {
  if (!isOpen) return null;

  const filteredTrending = query.trim()
    ? TRENDING_KEYWORDS.filter((k) => k.toLowerCase().includes(query.toLowerCase()))
    : TRENDING_KEYWORDS;

  return (
    <AnimatePresence>
      <div className="absolute left-0 right-0 top-full mt-1.5 z-50">
        {/* Backdrop for click outside */}
        <div 
          onClick={onClose} 
          className="fixed inset-0 bg-black/20 dark:bg-black/40 z-[-1]" 
        />

        <motion.div
          initial={{ opacity: 0, y: -6, scale: 0.99 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -6, scale: 0.99 }}
          transition={{ duration: 0.15 }}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-xl"
        >
          {query.trim().length > 0 && (
            <div 
              onClick={() => onSelectSuggestion(query)}
              className="p-3 bg-brand-orange/10 dark:bg-brand-orange/20 border-b border-brand-orange/20 flex items-center justify-between cursor-pointer hover:bg-brand-orange/15 transition-colors"
            >
              <div className="flex items-center space-x-2 text-brand-navy dark:text-white font-medium text-xs sm:text-sm">
                <Search className="w-4 h-4 text-brand-orange" />
                <span>
                  Search for "<span className="font-bold text-brand-orange">{query}</span>" 
                  {selectedCategory !== 'All' ? ` in ${selectedCategory}` : ''}
                </span>
              </div>
              <ArrowUpRight className="w-4 h-4 text-brand-orange" />
            </div>
          )}

          <div className="p-4 space-y-4 max-h-[380px] overflow-y-auto custom-scrollbar">
            {/* Recent Searches */}
            {!query && (
              <div>
                <div className="flex items-center space-x-1.5 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Recent Searches</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {RECENT_SEARCHES.map((term) => (
                    <button
                      key={term}
                      onClick={() => onSelectSuggestion(term)}
                      className="px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-xs text-slate-700 dark:text-slate-300 hover:bg-brand-orange/10 hover:text-brand-orange transition-colors flex items-center space-x-1"
                    >
                      <span>{term}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Trending Suggestions */}
            <div>
              <div className="flex items-center space-x-1.5 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
                <TrendingUp className="w-3.5 h-3.5 text-brand-orange" />
                <span>Trending on UR Collection</span>
              </div>
              <div className="space-y-1">
                {filteredTrending.map((term) => (
                  <button
                    key={term}
                    onClick={() => onSelectSuggestion(term)}
                    className="w-full flex items-center justify-between p-2 rounded-xl text-left text-xs sm:text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors group"
                  >
                    <div className="flex items-center space-x-2.5">
                      <Sparkles className="w-3.5 h-3.5 text-slate-400 group-hover:text-brand-orange transition-colors" />
                      <span className="group-hover:translate-x-0.5 transition-transform">{term}</span>
                    </div>
                    <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
