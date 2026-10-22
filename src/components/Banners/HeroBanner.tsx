import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  Truck, 
  ShieldCheck, 
  RotateCcw, 
  Flame, 
  Clock, 
  ArrowRight 
} from 'lucide-react';
import { CategoryType } from '../../types';
import { triggerHaptic } from '../../utils/haptics';

interface HeroBannerProps {
  onExploreCategory: (category: CategoryType) => void;
  onExploreDeals: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  onExploreCategory,
  onExploreDeals
}) => {
  // Urgency countdown timer for flash deals
  const [timeLeft, setTimeLeft] = useState({ hours: 8, minutes: 42, seconds: 19 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 12, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDigits = (n: number) => n.toString().padStart(2, '0');

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-4 pb-2 space-y-4">
      {/* Prime Hero Promotional Card */}
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-r from-brand-navy via-brand-navy-surface to-brand-navy text-white shadow-xl border border-white/10">
        
        {/* Subtle background glow decorative circles */}
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-brand-orange/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute left-1/3 -bottom-20 w-60 h-60 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 p-5 sm:p-8 lg:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* Left Content */}
          <div className="space-y-3 sm:space-y-4 text-center md:text-left max-w-xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brand-orange/20 border border-brand-orange/40 text-brand-orange text-xs font-bold tracking-wide">
              <Flame className="w-3.5 h-3.5 fill-brand-orange animate-bounce" />
              <span>UR EXCLUSIVE FLASH SALE</span>
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
              Elevate Your Wardrobe with <span className="text-brand-orange">UR Luxury</span>
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-lg">
              Curated Italian wool overcoats, grade-A Mongolian cashmere, and artisan leather goods. 
              Engineered for timeless confidence and effortless luxury.
            </p>

            {/* Countdown Urgency Timer */}
            <div className="flex items-center justify-center md:justify-start space-x-2 pt-1 text-xs">
              <span className="text-slate-400 flex items-center space-x-1 font-medium">
                <Clock className="w-3.5 h-3.5 text-brand-orange" />
                <span>Offer ends in:</span>
              </span>
              <div className="flex items-center space-x-1 font-mono font-bold text-white bg-black/40 px-2.5 py-1 rounded-lg border border-white/10">
                <span className="text-brand-orange">{formatDigits(timeLeft.hours)}</span>h :
                <span className="text-brand-orange">{formatDigits(timeLeft.minutes)}</span>m :
                <span className="text-brand-orange">{formatDigits(timeLeft.seconds)}</span>s
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-2">
              <button
                onClick={() => {
                  triggerHaptic('medium');
                  onExploreDeals();
                }}
                className="px-5 py-2.5 sm:px-6 sm:py-3 rounded-xl bg-brand-orange hover:bg-brand-orange-hover active:bg-brand-orange-active text-brand-navy font-bold text-xs sm:text-sm flex items-center space-x-2 shadow-glow-orange active:scale-95 transition-all"
              >
                <span>Shop Season Finale (Up to 50% Off)</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  triggerHaptic('light');
                  onExploreCategory('Men');
                }}
                className="px-4 py-2.5 sm:px-5 sm:py-3 rounded-xl bg-white/10 hover:bg-white/15 active:scale-95 text-white font-semibold text-xs sm:text-sm border border-white/15 transition-all"
              >
                Explore Men's
              </button>

              <button
                onClick={() => {
                  triggerHaptic('light');
                  onExploreCategory('Women');
                }}
                className="px-4 py-2.5 sm:px-5 sm:py-3 rounded-xl bg-white/10 hover:bg-white/15 active:scale-95 text-white font-semibold text-xs sm:text-sm border border-white/15 transition-all"
              >
                Explore Women's
              </button>
            </div>
          </div>

          {/* Right Visual Image Showcase with floating badge */}
          <div className="relative shrink-0 w-full sm:w-auto flex justify-center">
            <div className="relative w-64 sm:w-72 h-48 sm:h-64 rounded-2xl overflow-hidden shadow-2xl border-2 border-white/20 group">
              <img
                src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=800&auto=format&fit=crop"
                alt="UR Collection Editorial"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-brand-orange uppercase tracking-wider block">
                    EDITORIAL DROP
                  </span>
                  <span className="text-xs font-bold text-white">Autumn / Winter '26</span>
                </div>
                <span className="text-xs font-black px-2 py-1 rounded bg-brand-orange text-brand-navy">
                  -30% OFF
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Trust Badges Strip (Amazon Standard) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3">
        <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center space-x-3">
          <div className="w-9 h-9 rounded-lg bg-orange-50 dark:bg-orange-950/50 flex items-center justify-center text-brand-orange shrink-0">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xs font-bold text-slate-800 dark:text-slate-100">Free Express Delivery</h2>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">On all orders over $75</p>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center space-x-3">
          <div className="w-9 h-9 rounded-lg bg-blue-50 dark:bg-blue-950/50 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xs font-bold text-slate-800 dark:text-slate-100">100% Authentic</h2>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">Verified Italian & US mills</p>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center space-x-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
            <RotateCcw className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xs font-bold text-slate-800 dark:text-slate-100">30-Day Easy Returns</h2>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">Pre-paid return shipping</p>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center space-x-3">
          <div className="w-9 h-9 rounded-lg bg-purple-50 dark:bg-purple-950/50 flex items-center justify-center text-purple-600 dark:text-purple-400 shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xs font-bold text-slate-800 dark:text-slate-100">UR Prime Rewards</h2>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">Earn 5% back on every cart</p>
          </div>
        </div>
      </div>
    </div>
  );
};
