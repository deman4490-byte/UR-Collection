import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  UploadCloud, 
  Image as ImageIcon, 
  Trash2, 
  Check, 
  AlertCircle, 
  RefreshCw,
  Sparkles
} from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase';
import { CategoryType, Product } from '../../types';
import { useStoreSettings } from '../../context/StoreSettingsContext';
import { triggerHaptic } from '../../utils/haptics';

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProductAdded?: (newProduct: any) => Promise<void> | void;
}

export const AddProductModal: React.FC<AddProductModalProps> = ({
  isOpen,
  onClose,
  onProductAdded
}) => {
  const { currencySymbol } = useStoreSettings();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form Fields
  const [title, setTitle] = useState('');
  const [sellingPrice, setSellingPrice] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [category, setCategory] = useState<'Men' | 'Women' | 'Kids' | 'Accessories'>('Men');
  const [stock, setStock] = useState('25');
  const [description, setDescription] = useState('');
  const [brand, setBrand] = useState('UR Studio');

  // Image Upload State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFileName, setImageFileName] = useState<string>('');
  const [isDragging, setIsDragging] = useState(false);

  // Submission & Loading State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingPhase, setLoadingPhase] = useState<'idle' | 'uploading' | 'saving'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  // Live Discount Calculation for Amazon-Style Pricing
  const numOriginal = parseFloat(originalPrice) || 0;
  const numSelling = parseFloat(sellingPrice) || 0;
  const liveDiscountPercent = numOriginal > numSelling && numOriginal > 0
    ? Math.round(((numOriginal - numSelling) / numOriginal) * 100)
    : 0;
  const liveSavings = numOriginal > numSelling ? (numOriginal - numSelling).toFixed(2) : '0.00';

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setErrorMessage('Please select a valid image file (PNG, JPG, WEBP).');
      return;
    }
    setErrorMessage(null);
    setSelectedFile(file);
    setImageFileName(file.name);
    setImagePreview(URL.createObjectURL(file));
    triggerHaptic('light');
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleClearImage = () => {
    setImagePreview(null);
    setSelectedFile(null);
    setImageFileName('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Validation
    if (!title.trim()) {
      setErrorMessage('Product Title is required.');
      return;
    }
    if (!sellingPrice || Number(sellingPrice) <= 0) {
      setErrorMessage('Please enter a valid Selling Price.');
      return;
    }
    if (!originalPrice || Number(originalPrice) <= 0) {
      setErrorMessage('Please enter a valid Original Price (MRP).');
      return;
    }
    if (Number(sellingPrice) > Number(originalPrice)) {
      setErrorMessage('Selling Price cannot exceed Original Price (MRP).');
      return;
    }
    if (!selectedFile && !imagePreview) {
      setErrorMessage('Please select an image file to upload to Cloudinary.');
      return;
    }
    if (!description.trim()) {
      setErrorMessage('Product description is required.');
      return;
    }

    setIsSubmitting(true);
    setLoadingPhase('uploading');
    setErrorMessage(null);
    triggerHaptic('medium');

    try {
      let finalImageUrl = imagePreview || '';

      // 2. Upload image directly to Cloudinary using their REST API & unsigned preset
      if (selectedFile) {
        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('upload_preset', 'ur_collection_store');

        const cloudinaryEndpoint = 'https://api.cloudinary.com/v1_1/ctxdk31f/image/upload';

        const cloudinaryResponse = await fetch(cloudinaryEndpoint, {
          method: 'POST',
          body: formData
        });

        if (!cloudinaryResponse.ok) {
          const errData = await cloudinaryResponse.json().catch(() => ({}));
          const errorMsg = errData?.error?.message || `Cloudinary upload failed (HTTP ${cloudinaryResponse.status})`;
          throw new Error(errorMsg);
        }

        const cloudinaryData = await cloudinaryResponse.json();
        finalImageUrl = cloudinaryData.secure_url;
        console.log('Cloudinary direct upload successful. secure_url:', finalImageUrl);
      }

      // 3. Immediately create the new product document in Firebase Firestore
      setLoadingPhase('saving');

      const firestoreDocument = {
        title: title.trim(),
        description: description.trim(),
        originalPrice: parseFloat(Number(originalPrice).toFixed(2)),
        sellingPrice: parseFloat(Number(sellingPrice).toFixed(2)),
        category, // Men, Women, Kids, or Accessories
        imageUrl: finalImageUrl,
        brand: brand.trim() || 'UR Studio',
        stock: parseInt(stock, 10) || 15,
        discountPercent: liveDiscountPercent,
        createdAt: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, 'products'), firestoreDocument);
      console.log('Firestore document successfully created with ID:', docRef.id);

      // 4. Notify parent table to update local state without full page reload
      if (onProductAdded) {
        const completeProductObj: Product = {
          id: docRef.id,
          title: firestoreDocument.title,
          subtitle: firestoreDocument.brand,
          brand: firestoreDocument.brand,
          price: firestoreDocument.sellingPrice,
          sellingPrice: firestoreDocument.sellingPrice,
          originalPrice: firestoreDocument.originalPrice,
          discountPercent: liveDiscountPercent,
          category: firestoreDocument.category as CategoryType,
          image: firestoreDocument.imageUrl,
          description: firestoreDocument.description,
          rating: 5.0,
          ratingCount: 1,
          tags: ['New Arrival', 'UR Prime'],
          sizes: ['S', 'M', 'L', 'XL'],
          colors: [{ name: 'Default', hex: '#0B192C' }],
          inStock: firestoreDocument.stock > 0,
          stockCount: firestoreDocument.stock,
          primeEligible: true
        };
        await onProductAdded(completeProductObj);
      }

      triggerHaptic('success');
      setIsSubmitting(false);
      setLoadingPhase('idle');
      onClose();
    } catch (err: any) {
      console.error('Error in AddProductModal:', err);
      setIsSubmitting(false);
      setLoadingPhase('idle');
      setErrorMessage(err?.message || 'Failed to complete Cloudinary upload or Firestore document creation.');
      triggerHaptic('error');
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
          onClick={() => !isSubmitting && onClose()}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 26, stiffness: 300 }}
          className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 z-10 my-auto"
        >
          {/* Modal Header */}
          <div className="bg-brand-navy p-5 sm:p-6 text-white flex items-center justify-between border-b border-brand-navy-surface shadow-md">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-orange to-amber-400 flex items-center justify-center font-black text-brand-navy shadow-md">
                <UploadCloud className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div>
                <h3 className="font-extrabold text-base sm:text-lg tracking-tight">
                  Add New Product
                </h3>
                <p className="text-xs text-white/70">
                  Cloudinary Direct Upload & Firebase Firestore Sync
                </p>
              </div>
            </div>

            <button
              onClick={() => !isSubmitting && onClose()}
              disabled={isSubmitting}
              className="p-1.5 rounded-full text-white/80 hover:text-white hover:bg-white/10 disabled:opacity-50 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 max-h-[82vh] overflow-y-auto custom-scrollbar">
            
            {/* Error Message Banner */}
            {errorMessage && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-xs text-rose-600 dark:text-rose-400 flex items-start space-x-2.5"
              >
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <span className="font-bold block">Upload or Save Failed</span>
                  <p className="text-[11px] leading-relaxed">{errorMessage}</p>
                </div>
              </motion.div>
            )}

            {/* Product Title & Brand */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2 space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Product Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  disabled={isSubmitting}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Tailored Italian Wool Blend Overcoat"
                  className="w-full h-10 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-orange disabled:opacity-60"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Brand / Line
                </label>
                <input
                  type="text"
                  value={brand}
                  disabled={isSubmitting}
                  onChange={(e) => setBrand(e.target.value)}
                  placeholder="e.g. UR Studio"
                  className="w-full h-10 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-orange disabled:opacity-60"
                />
              </div>
            </div>

            {/* Amazon-Style Pricing: Original Price (MRP) & Selling Price */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200">
                  Amazon-Style Pricing
                </span>
                {liveDiscountPercent > 0 && (
                  <span className="text-[11px] font-black px-2.5 py-0.5 rounded-full bg-rose-600 text-white shadow-sm flex items-center space-x-1">
                    <span>-{liveDiscountPercent}% Customer Discount</span>
                    <span>(Save {currencySymbol}{liveSavings})</span>
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Original Price (MRP) */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <label className="font-bold text-slate-700 dark:text-slate-300">
                      Original Price (MRP) ({currencySymbol}) <span className="text-rose-500">*</span>
                    </label>
                    <span className="text-[10px] text-slate-400">Strikethrough font</span>
                  </div>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                      {currencySymbol}
                    </span>
                    <input
                      type="number"
                      step="0.01"
                      min="1"
                      value={originalPrice}
                      disabled={isSubmitting}
                      onChange={(e) => setOriginalPrice(e.target.value)}
                      placeholder="249.00"
                      className="w-full h-10 pl-7 pr-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-orange disabled:opacity-60"
                      required
                    />
                  </div>
                </div>

                {/* Selling Price */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <label className="font-bold text-slate-700 dark:text-slate-300">
                      Selling Price ({currencySymbol}) <span className="text-rose-500">*</span>
                    </label>
                    <span className="text-[10px] text-brand-orange font-bold">Featured price</span>
                  </div>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                      {currencySymbol}
                    </span>
                    <input
                      type="number"
                      step="0.01"
                      min="1"
                      value={sellingPrice}
                      disabled={isSubmitting}
                      onChange={(e) => setSellingPrice(e.target.value)}
                      placeholder="169.00"
                      className="w-full h-10 pl-7 pr-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-orange disabled:opacity-60"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Category Dropdown (Men, Women, Kids) & Stock Units */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Category Dropdown: Men, Women, Kids */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Category Dropdown <span className="text-rose-500">*</span>
                </label>
                <select
                  value={category}
                  disabled={isSubmitting}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-orange cursor-pointer disabled:opacity-60"
                  required
                >
                  <option value="Men">Men</option>
                  <option value="Women">Women</option>
                  <option value="Kids">Kids</option>
                  <option value="Accessories">Accessories</option>
                </select>
              </div>

              {/* Stock Units */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Stock Units <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  min="0"
                  value={stock}
                  disabled={isSubmitting}
                  onChange={(e) => setStock(e.target.value)}
                  placeholder="50"
                  className="w-full h-10 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-orange disabled:opacity-60"
                  required
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Description <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={3}
                value={description}
                disabled={isSubmitting}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe fabric blend, craftsmanship, fit recommendations, and styling notes..."
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-orange resize-none disabled:opacity-60"
                required
              />
            </div>

            {/* Cloudinary Image Upload Zone */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <label className="font-bold text-slate-700 dark:text-slate-300 flex items-center space-x-1.5">
                  <ImageIcon className="w-3.5 h-3.5 text-brand-orange" />
                  <span>Product Image</span>
                  <span className="text-rose-500">*</span>
                </label>

                <div className="flex items-center space-x-1.5">
                  <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                    Cloudinary: ctxdk31f (ur_collection_store)
                  </span>
                </div>
              </div>

              {/* Hidden File Input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                disabled={isSubmitting}
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFileSelect(e.target.files[0]);
                  }
                }}
                className="hidden"
              />

              {/* Drag & Drop Visual Zone */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => !isSubmitting && fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-4 sm:p-5 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                  isDragging
                    ? 'border-brand-orange bg-brand-orange/10 dark:bg-brand-orange/20 scale-[0.99]'
                    : imagePreview
                    ? 'border-emerald-400/80 bg-emerald-50/40 dark:bg-emerald-950/20'
                    : 'border-slate-300 dark:border-slate-700 hover:border-brand-orange bg-slate-50/50 dark:bg-slate-800/40'
                } ${isSubmitting ? 'pointer-events-none opacity-80' : ''}`}
              >
                {imagePreview ? (
                  <div className="flex items-center space-x-4 w-full">
                    <img
                      src={imagePreview}
                      alt="Upload Preview"
                      className="w-16 h-20 object-cover rounded-xl shadow-md border border-slate-200 dark:border-slate-700"
                    />
                    <div className="flex-1 text-left space-y-1">
                      <div className="flex items-center space-x-1.5 text-emerald-600 dark:text-emerald-400 font-bold text-xs">
                        <Check className="w-4 h-4" />
                        <span>Asset selected for Cloudinary upload</span>
                      </div>
                      <p className="text-[11px] text-slate-500 truncate max-w-xs font-mono">
                        {imageFileName || 'Selected Image'}
                      </p>
                      {!isSubmitting && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleClearImage();
                          }}
                          className="text-[11px] text-rose-500 hover:underline flex items-center space-x-1 font-semibold"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Remove and pick another file</span>
                        </button>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="w-12 h-12 mx-auto rounded-xl bg-orange-50 dark:bg-orange-950/60 flex items-center justify-center text-brand-orange">
                      <UploadCloud className="w-6 h-6" />
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        Click to browse or drag & drop product photo
                      </p>
                      <p className="text-[11px] text-slate-400">
                        Will be uploaded directly to Cloudinary (preset: <code className="text-brand-orange">ur_collection_store</code>)
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Actions & Submit Button with Loading State */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs hover:bg-slate-200 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              
              {/* Submit Button with Loading State */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-xl bg-brand-orange hover:bg-brand-orange-hover active:bg-brand-orange-active text-brand-navy font-extrabold text-xs shadow-glow-orange transition-all active:scale-95 flex items-center space-x-2 disabled:opacity-80 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <div className="flex items-center space-x-2">
                    <RefreshCw className="w-4 h-4 animate-spin text-brand-navy" />
                    <span>
                      {loadingPhase === 'uploading' 
                        ? 'Uploading to Cloudinary...' 
                        : 'Saving document to Firestore...'}
                    </span>
                  </div>
                ) : (
                  <>
                    <Check className="w-4 h-4 stroke-[2.5]" />
                    <span>Upload & Add Product</span>
                  </>
                )}
              </button>
            </div>

          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
