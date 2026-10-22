import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Search, 
  Filter, 
  Trash2, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  ArrowUpDown,
  Edit,
  Package
} from 'lucide-react';
import { Product, CategoryType } from '../../types';
import { useStoreSettings } from '../../context/StoreSettingsContext';
import { AddProductModal } from './AddProductModal';
import { triggerHaptic } from '../../utils/haptics';

interface ProductsManagerTabProps {
  products: Product[];
  onAddProduct: (productData: any) => Promise<void> | void;
  onUpdateStock: (productId: string, newStock: number) => void;
  onDeleteProduct: (productId: string) => void;
}

export const ProductsManagerTab: React.FC<ProductsManagerTabProps> = ({
  products,
  onAddProduct,
  onUpdateStock,
  onDeleteProduct
}) => {
  const { currencySymbol } = useStoreSettings();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | 'All'>('All');
  const [stockFilter, setStockFilter] = useState<'all' | 'low' | 'out'>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Filter products
  const filteredProducts = products.filter((p) => {
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch = 
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    let matchesStock = true;
    if (stockFilter === 'low') matchesStock = (p.stockCount || 0) > 0 && (p.stockCount || 0) < 15;
    if (stockFilter === 'out') matchesStock = (p.stockCount || 0) === 0;

    return matchesCategory && matchesSearch && matchesStock;
  });

  const totalCatalogValue = products.reduce((acc, p) => acc + p.price * (p.stockCount || 0), 0);
  const lowStockCount = products.filter((p) => (p.stockCount || 0) > 0 && (p.stockCount || 0) < 15).length;
  const outOfStockCount = products.filter((p) => (p.stockCount || 0) === 0).length;

  return (
    <div className="space-y-5">
      
      {/* Top Header & Add Product Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="space-y-0.5">
          <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight">
            Inventory & Catalog Manager
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Real-time multi-category catalog and stock management
          </p>
        </div>

        <button
          onClick={() => {
            triggerHaptic('medium');
            setIsAddModalOpen(true);
          }}
          className="px-5 py-2.5 rounded-xl bg-brand-orange hover:bg-brand-orange-hover active:bg-brand-orange-active text-brand-navy font-black text-xs flex items-center justify-center space-x-2 shadow-glow-orange active:scale-95 transition-all shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Add Product</span>
        </button>
      </div>

      {/* Mini Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Total Catalog SKUs
          </span>
          <span className="text-xl font-black text-slate-900 dark:text-white mt-1 block">
            {products.length}
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Total Stock Value
          </span>
          <span className="text-xl font-black text-emerald-600 dark:text-emerald-400 mt-1 block">
            {currencySymbol}{totalCatalogValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>

        <div 
          onClick={() => setStockFilter(stockFilter === 'low' ? 'all' : 'low')}
          className={`p-3.5 rounded-xl border shadow-sm cursor-pointer transition-colors ${
            stockFilter === 'low'
              ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-400'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
          }`}
        >
          <span className="text-[11px] font-bold text-amber-500 uppercase tracking-wider block">
            Low Stock Alert
          </span>
          <span className="text-xl font-black text-amber-600 dark:text-amber-400 mt-1 block">
            {lowStockCount} items
          </span>
        </div>

        <div 
          onClick={() => setStockFilter(stockFilter === 'out' ? 'all' : 'out')}
          className={`p-3.5 rounded-xl border shadow-sm cursor-pointer transition-colors ${
            stockFilter === 'out'
              ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-400'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
          }`}
        >
          <span className="text-[11px] font-bold text-rose-500 uppercase tracking-wider block">
            Out of Stock
          </span>
          <span className="text-xl font-black text-rose-600 dark:text-rose-400 mt-1 block">
            {outOfStockCount} items
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          
          {/* Search Input */}
          <div className="relative w-full sm:max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter by title, brand, or product ID..."
              className="w-full h-10 pl-10 pr-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-orange"
            />
          </div>

          {/* Category Dropdown Pill Strip */}
          <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar w-full sm:w-auto">
            {(['All', 'Men', 'Women', 'Kids', 'Accessories'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  triggerHaptic('light');
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-brand-navy text-white dark:bg-brand-orange dark:text-brand-navy shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

        </div>
      </div>

      {/* Inventory Data Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 uppercase font-bold text-[11px]">
                <th className="py-3.5 px-4">Product Details</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Price</th>
                <th className="py-3.5 px-4">Inventory Stock</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400 space-y-2">
                    <Package className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-600" />
                    <p className="text-xs font-bold text-slate-600 dark:text-slate-400">No products match your filter criteria</p>
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setSelectedCategory('All');
                        setStockFilter('all');
                      }}
                      className="text-xs text-brand-orange font-bold hover:underline"
                    >
                      Clear all filters
                    </button>
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => {
                  const stockNum = product.stockCount || 0;
                  const isLow = stockNum > 0 && stockNum < 15;
                  const isOut = stockNum === 0;

                  return (
                    <tr 
                      key={product.id}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors group"
                    >
                      {/* Product Column */}
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-3">
                          <img
                            src={product.image}
                            alt={product.title}
                            className="w-12 h-14 object-cover rounded-xl bg-slate-100 dark:bg-slate-800 shrink-0 border border-slate-200 dark:border-slate-700"
                          />
                          <div className="min-w-0 max-w-xs space-y-0.5">
                            <span className="font-bold text-slate-900 dark:text-white block truncate hover:text-brand-orange transition-colors">
                              {product.title}
                            </span>
                            <div className="flex items-center space-x-2 text-[10px] text-slate-400">
                              <span className="font-semibold text-brand-orange">{product.brand}</span>
                              <span>•</span>
                              <span className="font-mono">ID: {product.id}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3 px-4">
                        <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-[11px]">
                          {product.category}
                        </span>
                      </td>

                      {/* Price */}
                      <td className="py-3 px-4">
                        <div className="flex flex-col">
                          <span className="font-black text-slate-900 dark:text-white">
                            {currencySymbol}{(product.sellingPrice !== undefined ? product.sellingPrice : product.price).toFixed(2)}
                          </span>
                          {product.originalPrice && product.originalPrice > (product.sellingPrice !== undefined ? product.sellingPrice : product.price) && (
                            <div className="flex items-center space-x-1">
                              <span className="text-[10px] text-slate-400 line-through">
                                {currencySymbol}{product.originalPrice.toFixed(2)}
                              </span>
                              <span className="text-[9px] font-black text-emerald-600 dark:text-emerald-400">
                                -{Math.round(((product.originalPrice - (product.sellingPrice !== undefined ? product.sellingPrice : product.price)) / product.originalPrice) * 100)}%
                              </span>
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Stock with quick stepper */}
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          <span className="font-mono font-bold text-slate-800 dark:text-slate-200 min-w-[28px]">
                            {stockNum}
                          </span>
                          <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden bg-slate-50 dark:bg-slate-800">
                            <button
                              onClick={() => {
                                onUpdateStock(product.id, Math.max(0, stockNum - 5));
                                triggerHaptic('light');
                              }}
                              className="px-1.5 py-0.5 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 font-bold"
                              title="Decrease 5 units"
                            >
                              -
                            </button>
                            <button
                              onClick={() => {
                                onUpdateStock(product.id, stockNum + 10);
                                triggerHaptic('light');
                              }}
                              className="px-1.5 py-0.5 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 font-bold"
                              title="Add 10 units"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4">
                        {isOut ? (
                          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-400 font-bold text-[10px]">
                            <XCircle className="w-3 h-3" />
                            <span>Out of Stock</span>
                          </span>
                        ) : isLow ? (
                          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400 font-bold text-[10px]">
                            <AlertTriangle className="w-3 h-3" />
                            <span>Low Stock</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400 font-bold text-[10px]">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Available</span>
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => {
                            if (window.confirm(`Delete "${product.title}" from catalog?`)) {
                              onDeleteProduct(product.id);
                              triggerHaptic('medium');
                            }
                          }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                          title="Delete product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Product Modal */}
      <AddProductModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onProductAdded={onAddProduct}
      />

    </div>
  );
};
