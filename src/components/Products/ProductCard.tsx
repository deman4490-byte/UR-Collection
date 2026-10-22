import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Star, 
  ShoppingCart, 
  Heart, 
  Check, 
  Sparkles, 
  Eye, 
  Plus 
} from 'lucide-react';
import { Product } from '../../types';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useStoreSettings } from '../../context/StoreSettingsContext';
import { triggerHaptic } from '../../utils/haptics';

interface ProductCardProps {
  product: Product;
  onQuickView: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onQuickView
}) => {
  const { addToCart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const { currencySymbol } = useStoreSettings();

  const [isHovered, setIsHovered] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes[0] || 'M');
  const [selectedColor, setSelectedColor] = useState(product.colors[0] || { name: 'Default', hex: '#0B192C' });
  const [justAdded, setJustAdded] = useState(false);
  const [showSizePicker, setShowSizePicker] = useState(false);

  const favorited = isWishlisted(product.id);

  // Amazon-Style Dynamic Pricing Computation
  const sellingPrice = product.sellingPrice !== undefined ? product.sellingPrice : product.price;
  const originalPrice = product.originalPrice || Math.round(sellingPrice * 1.35);
  const discountPercent = originalPrice > sellingPrice
    ? Math.round(((originalPrice - sellingPrice) / originalPrice) * 100)
    : (product.discountPercent || 0);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    // If product has multiple sizes and size picker is not already open, open size selection or add default
    addToCart(product, selectedSize, selectedColor, 1);
    
    setJustAdded(true);
    triggerHaptic('success');
    setTimeout(() => setJustAdded(false), 1800);
  };

  const handleHeartClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.25 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setShowSizePicker(false);
      }}
      className="group relative bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-premium transition-all duration-300 flex flex-col justify-between"
    >
      {/* Product Image Container */}
      <div 
        onClick={() => onQuickView(product)}
        className="relative aspect-[3/4] w-full bg-slate-100 dark:bg-slate-800/80 overflow-hidden cursor-pointer"
      >
        {/* Main Product Image */}
        <img
          src={isHovered && product.secondaryImage ? product.secondaryImage : product.image}
          alt={product.title}
          loading="lazy"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
        />

        {/* Amazon-style Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 items-start z-10 pointer-events-none">
          {product.tags?.[0] && (
            <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider shadow-sm ${
              product.tags[0].includes('Best')
                ? 'bg-amber-500 text-brand-navy'
                : product.tags[0].includes('Choice') || product.tags[0].includes('Prime')
                ? 'bg-blue-600 text-white'
                : 'bg-brand-navy text-white'
            }`}>
              {product.tags[0]}
            </span>
          )}

          {discountPercent > 0 && (
            <span className="px-1.5 py-0.5 rounded-md bg-rose-600 text-white text-[10px] font-black shadow-sm">
              -{discountPercent}% OFF
            </span>
          )}
        </div>

        {/* Wishlist Heart Button */}
        <button
          onClick={handleHeartClick}
          className={`absolute top-2.5 right-2.5 p-2 rounded-full backdrop-blur-md transition-all active:scale-90 z-20 ${
            favorited
              ? 'bg-rose-50 text-rose-500 shadow-sm'
              : 'bg-white/80 dark:bg-slate-900/80 text-slate-600 dark:text-slate-300 hover:text-rose-500 hover:bg-white'
          }`}
          aria-label={favorited ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart className={`w-4 h-4 ${favorited ? 'fill-rose-500 text-rose-500' : ''}`} />
        </button>

        {/* Quick View Floating Pill (Desktop hover) */}
        <div className="absolute inset-x-3 bottom-3 hidden md:flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 pointer-events-none">
          <div className="px-3.5 py-1.5 rounded-full bg-brand-navy/90 backdrop-blur-md text-white text-xs font-semibold flex items-center space-x-1.5 shadow-lg">
            <Eye className="w-3.5 h-3.5 text-brand-orange" />
            <span>Quick View</span>
          </div>
        </div>

        {/* Color Swatch Dots Overlay */}
        {product.colors && product.colors.length > 1 && (
          <div 
            onClick={(e) => e.stopPropagation()}
            className="absolute bottom-2 left-2.5 flex items-center space-x-1 bg-black/40 backdrop-blur-md px-1.5 py-1 rounded-full md:opacity-0 group-hover:opacity-100 transition-opacity"
          >
            {product.colors.map((c) => (
              <button
                key={c.name}
                onClick={() => {
                  setSelectedColor(c);
                  triggerHaptic('light');
                }}
                style={{ backgroundColor: c.hex }}
                className={`w-2.5 h-2.5 rounded-full border border-white/60 transition-transform ${
                  selectedColor.name === c.name ? 'scale-125 ring-1 ring-white' : 'opacity-80'
                }`}
                title={c.name}
              />
            ))}
          </div>
        )}
      </div>

      {/* Product Details Section */}
      <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between space-y-2">
        <div className="space-y-1">
          {/* Brand & Prime Fast Indicator */}
          <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
            <span className="font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 truncate max-w-[120px]">
              {product.brand}
            </span>
            {product.primeEligible && (
              <span className="flex items-center space-x-0.5 text-blue-600 dark:text-blue-400 font-extrabold text-[10px]">
                <Sparkles className="w-2.5 h-2.5 fill-blue-600 dark:fill-blue-400" />
                <span>PRIME</span>
              </span>
            )}
          </div>

          {/* Title */}
          <h2 
            onClick={() => onQuickView(product)}
            className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 line-clamp-2 leading-snug cursor-pointer hover:text-brand-orange transition-colors"
          >
            {product.title}
          </h2>

          {/* Amazon Star Rating */}
          <div className="flex items-center space-x-1 pt-0.5">
            <div className="flex items-center text-amber-400">
              <Star className="w-3.5 h-3.5 fill-amber-400 stroke-amber-400" />
            </div>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
              {product.rating}
            </span>
            <span className="text-[11px] text-slate-400 dark:text-slate-500">
              ({product.ratingCount.toLocaleString()})
            </span>
          </div>
        </div>

        {/* Price & Add to Cart Action Row - Amazon-Style Pricing */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-end justify-between gap-2">
          {/* Price Block */}
          <div className="space-y-0.5 min-w-0">
            {/* Prominent Selling Price with Dynamic Discount Badge */}
            <div className="flex items-baseline space-x-1.5 flex-wrap">
              {discountPercent > 0 && (
                <span className="text-xs sm:text-sm font-black text-rose-600 dark:text-rose-500">
                  -{discountPercent}%
                </span>
              )}

              <span className="text-sm sm:text-lg font-black text-slate-900 dark:text-white tracking-tight">
                <span className="text-xs font-bold align-top">{currencySymbol}</span>
                {Math.floor(sellingPrice)}
                <span className="text-xs font-bold align-top">
                  .{(sellingPrice % 1).toFixed(2).split('.')[1]}
                </span>
              </span>
            </div>

            {/* Original Price (MRP) in smaller gray font with strikethrough */}
            {originalPrice > sellingPrice && (
              <div className="text-[11px] text-slate-400 dark:text-slate-500 flex items-center space-x-1">
                <span>M.R.P.:</span>
                <span className="line-through">{currencySymbol}{originalPrice.toFixed(2)}</span>
              </div>
            )}

            <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
              Free Delivery
            </p>
          </div>

          {/* Quick "Add" Button (Amazon-grade vibrant orange) */}
          <button
            onClick={handleQuickAdd}
            disabled={justAdded}
            className={`h-8 sm:h-9 px-3 sm:px-4 rounded-xl font-bold text-xs flex items-center justify-center space-x-1.5 transition-all active:scale-95 shadow-sm ${
              justAdded
                ? 'bg-emerald-600 text-white shadow-emerald-600/30'
                : 'bg-brand-orange hover:bg-brand-orange-hover active:bg-brand-orange-active text-brand-navy shadow-glow-orange'
            }`}
            aria-label={`Add ${product.title} to cart`}
          >
            {justAdded ? (
              <>
                <Check className="w-3.5 h-3.5 stroke-[3]" />
                <span className="hidden xs:inline">Added</span>
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5 stroke-[3]" />
                <span>Add</span>
              </>
            )}
          </button>
        </div>

      </div>
    </motion.div>
  );
};
