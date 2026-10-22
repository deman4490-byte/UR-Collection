import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Star, 
  ShoppingCart, 
  Sparkles, 
  Check, 
  Truck, 
  ShieldCheck, 
  Heart, 
  Plus, 
  Minus 
} from 'lucide-react';
import { Product } from '../../types';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useStoreSettings } from '../../context/StoreSettingsContext';
import { triggerHaptic } from '../../utils/haptics';

interface ProductQuickViewModalProps {
  product: Product | null;
  onClose: () => void;
  onInstantCheckout?: (product: Product, size: string, color: { name: string; hex: string }, qty: number) => void;
}

export const ProductQuickViewModal: React.FC<ProductQuickViewModalProps> = ({
  product,
  onClose,
  onInstantCheckout
}) => {
  if (!product) return null;

  const { addToCart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const { currencySymbol } = useStoreSettings();

  const [selectedImage, setSelectedImage] = useState<string>(product.image);
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes[0] || 'M');
  const [selectedColor, setSelectedColor] = useState(product.colors[0] || { name: 'Default', hex: '#0B192C' });
  const [quantity, setQuantity] = useState<number>(1);
  const [addedSuccess, setAddedSuccess] = useState(false);

  // Amazon-Style Dynamic Pricing
  const sellingPrice = product.sellingPrice !== undefined ? product.sellingPrice : product.price;
  const originalPrice = product.originalPrice || Math.round(sellingPrice * 1.35);
  const discountPercent = originalPrice > sellingPrice
    ? Math.round(((originalPrice - sellingPrice) / originalPrice) * 100)
    : (product.discountPercent || 0);
  const savingsAmount = originalPrice > sellingPrice ? (originalPrice - sellingPrice).toFixed(2) : '0.00';

  const favorited = isWishlisted(product.id);

  const handleAddToCart = () => {
    addToCart(product, selectedSize, selectedColor, quantity);
    setAddedSuccess(true);
    triggerHaptic('success');
    setTimeout(() => {
      setAddedSuccess(false);
      onClose();
    }, 1200);
  };

  const handleBuyNow = () => {
    triggerHaptic('medium');
    if (onInstantCheckout) {
      onInstantCheckout(product, selectedSize, selectedColor, quantity);
    } else {
      addToCart(product, selectedSize, selectedColor, quantity);
      onClose();
    }
  };

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

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 26, stiffness: 300 }}
          className="relative w-full max-w-3xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 z-10 my-auto"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors z-20"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2">
            
            {/* Gallery Column */}
            <div className="p-4 sm:p-6 bg-slate-50 dark:bg-slate-950/50 flex flex-col items-center justify-between space-y-4">
              <div className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden shadow-inner bg-slate-200 dark:bg-slate-800">
                <img
                  src={selectedImage}
                  alt={product.title}
                  className="w-full h-full object-cover transition-all duration-300"
                />
                <button
                  onClick={() => toggleWishlist(product.id)}
                  className="absolute top-3 left-3 p-2 rounded-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md text-slate-700 dark:text-slate-200 shadow-sm"
                >
                  <Heart className={`w-4 h-4 ${favorited ? 'fill-rose-500 text-rose-500' : ''}`} />
                </button>
              </div>

              {/* Thumbnail Swapper */}
              {product.secondaryImage && (
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setSelectedImage(product.image)}
                    className={`w-14 h-14 rounded-xl overflow-hidden border-2 transition-all ${
                      selectedImage === product.image ? 'border-brand-orange ring-2 ring-brand-orange/30' : 'border-transparent opacity-70'
                    }`}
                  >
                    <img src={product.image} alt="Primary" className="w-full h-full object-cover" />
                  </button>
                  <button
                    onClick={() => setSelectedImage(product.secondaryImage!)}
                    className={`w-14 h-14 rounded-xl overflow-hidden border-2 transition-all ${
                      selectedImage === product.secondaryImage ? 'border-brand-orange ring-2 ring-brand-orange/30' : 'border-transparent opacity-70'
                    }`}
                  >
                    <img src={product.secondaryImage} alt="Secondary" className="w-full h-full object-cover" />
                  </button>
                </div>
              )}
            </div>

            {/* Info & Purchase Column */}
            <div className="p-5 sm:p-8 flex flex-col justify-between space-y-5">
              
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="font-bold uppercase tracking-widest text-brand-orange">
                    {product.brand}
                  </span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center space-x-1">
                    <Check className="w-3.5 h-3.5" />
                    <span>In Stock ({product.stockCount || 15} left)</span>
                  </span>
                </div>

                <h1 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white leading-tight">
                  {product.title}
                </h1>

                {/* Rating & Prime */}
                <div className="flex items-center space-x-3 text-xs">
                  <div className="flex items-center text-amber-400">
                    <Star className="w-4 h-4 fill-amber-400 stroke-amber-400" />
                    <span className="ml-1 font-bold text-slate-800 dark:text-slate-200">
                      {product.rating}
                    </span>
                  </div>
                  <span className="text-slate-400">
                    {product.ratingCount.toLocaleString()} ratings
                  </span>
                  {product.primeEligible && (
                    <span className="px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 font-bold text-[10px]">
                      Prime Next-Day
                    </span>
                  )}
                </div>

                {/* Amazon-Style Price Display */}
                <div className="space-y-1 pt-1">
                  <div className="flex items-baseline space-x-2">
                    {discountPercent > 0 && (
                      <span className="text-xl sm:text-2xl font-black text-rose-600 dark:text-rose-500">
                        -{discountPercent}%
                      </span>
                    )}
                    <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                      <span className="text-sm font-bold align-top">{currencySymbol}</span>
                      {Math.floor(sellingPrice)}
                      <span className="text-sm font-bold align-top">
                        .{(sellingPrice % 1).toFixed(2).split('.')[1]}
                      </span>
                    </span>
                  </div>

                  {originalPrice > sellingPrice && (
                    <div className="flex items-center space-x-2 text-xs text-slate-500 dark:text-slate-400 flex-wrap gap-y-1">
                      <span>Typical price:</span>
                      <span className="line-through">{currencySymbol}{originalPrice.toFixed(2)}</span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full">
                        Save {currencySymbol}{savingsAmount} ({discountPercent}% off)
                      </span>
                    </div>
                  )}
                </div>

                {/* Description */}
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {product.description}
                </p>

                {/* Color Swatches */}
                {product.colors && product.colors.length > 0 && (
                  <div className="space-y-1.5 pt-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-700 dark:text-slate-300">
                        Color: <span className="text-slate-900 dark:text-white font-bold">{selectedColor.name}</span>
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      {product.colors.map((c) => (
                        <button
                          key={c.name}
                          onClick={() => {
                            setSelectedColor(c);
                            triggerHaptic('light');
                          }}
                          style={{ backgroundColor: c.hex }}
                          className={`w-7 h-7 rounded-full border-2 transition-transform ${
                            selectedColor.name === c.name
                              ? 'border-brand-orange scale-110 shadow-md ring-2 ring-brand-orange/40'
                              : 'border-slate-300 dark:border-slate-700 opacity-80'
                          }`}
                          title={c.name}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Size Pills */}
                {product.sizes && product.sizes.length > 0 && (
                  <div className="space-y-1.5 pt-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-700 dark:text-slate-300">
                        Size: <span className="text-slate-900 dark:text-white font-bold">{selectedSize}</span>
                      </span>
                      <button className="text-[11px] text-brand-orange font-medium hover:underline">
                        Size Chart
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {product.sizes.map((s) => (
                        <button
                          key={s}
                          onClick={() => {
                            setSelectedSize(s);
                            triggerHaptic('light');
                          }}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                            selectedSize === s
                              ? 'bg-brand-navy text-white dark:bg-brand-orange dark:text-brand-navy shadow-sm'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quantity Stepper */}
                <div className="flex items-center space-x-3 pt-2">
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Quantity:
                  </span>
                  <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-800">
                    <button
                      onClick={() => {
                        triggerHaptic('light');
                        setQuantity((q) => Math.max(1, q - 1));
                      }}
                      className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                      disabled={quantity <= 1}
                    >
                      <Minus className="w-3.5 h-3.5 text-slate-600 dark:text-slate-300" />
                    </button>
                    <span className="px-3 text-xs font-bold text-slate-800 dark:text-white">
                      {quantity}
                    </span>
                    <button
                      onClick={() => {
                        triggerHaptic('light');
                        setQuantity((q) => q + 1);
                      }}
                      className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5 text-slate-600 dark:text-slate-300" />
                    </button>
                  </div>
                </div>

              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  onClick={handleAddToCart}
                  disabled={addedSuccess}
                  className={`w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center space-x-2 transition-all active:scale-[0.98] shadow-glow-orange ${
                    addedSuccess
                      ? 'bg-emerald-600 text-white'
                      : 'bg-brand-orange hover:bg-brand-orange-hover text-brand-navy'
                  }`}
                >
                  {addedSuccess ? (
                    <>
                      <Check className="w-4 h-4 stroke-[3]" />
                      <span>Added to Your Cart!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-4 h-4" />
                      <span>Add to Cart - {currencySymbol}{(sellingPrice * quantity).toFixed(2)}</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleBuyNow}
                  className="w-full py-3 rounded-xl bg-brand-navy hover:bg-brand-navy-light text-white font-bold text-sm flex items-center justify-center space-x-2 transition-all active:scale-[0.98] shadow-md"
                >
                  <Sparkles className="w-4 h-4 text-brand-orange" />
                  <span>Buy Now with 1-Click</span>
                </button>
              </div>

            </div>

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
