import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  DollarSign, 
  ShoppingBag, 
  TrendingUp, 
  Package, 
  Users, 
  ArrowUpRight, 
  ArrowDownRight,
  Sparkles,
  Calendar,
  Layers,
  ChevronRight,
  Eye
} from 'lucide-react';
import { useStoreSettings } from '../../context/StoreSettingsContext';
import { AdminOrder, Product } from '../../types';

interface OverviewTabProps {
  orders: AdminOrder[];
  products: Product[];
  onNavigateTab: (tab: 'products' | 'orders' | 'settings') => void;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({
  orders,
  products,
  onNavigateTab
}) => {
  const { settings, currencySymbol } = useStoreSettings();
  const [timeframe, setTimeframe] = useState<'month' | 'quarter' | 'year'>('month');

  // Compute metrics from actual orders & products
  const activeOrders = orders.filter((o) => o.status === 'Pending' || o.status === 'Shipped');
  const deliveredOrders = orders.filter((o) => o.status === 'Delivered');
  const totalRevenue = orders.reduce((acc, o) => acc + o.total, 0) + 148200.00; // Simulated historical baseline
  const totalInventoryUnits = products.reduce((acc, p) => acc + (p.stockCount || 0), 0);
  const lowStockProducts = products.filter((p) => (p.stockCount || 0) < 15);

  // Mock monthly revenue data for visual chart
  const REVENUE_DATA = [
    { month: 'May', revenue: 18400, orders: 190 },
    { month: 'Jun', revenue: 22600, orders: 230 },
    { month: 'Jul', revenue: 26800, orders: 280 },
    { month: 'Aug', revenue: 24100, orders: 250 },
    { month: 'Sep', revenue: 31400, orders: 340 },
    { month: 'Oct', revenue: 38900, orders: 412, isCurrent: true }
  ];

  const maxRevenue = Math.max(...REVENUE_DATA.map((d) => d.revenue));

  // Category distribution
  const categoryStats = [
    { name: "Men's Sartorial", share: 38, count: products.filter(p => p.category === 'Men').length, color: 'bg-brand-navy' },
    { name: "Women's Haute", share: 34, count: products.filter(p => p.category === 'Women').length, color: 'bg-brand-orange' },
    { name: "Leather & Accessories", share: 18, count: products.filter(p => p.category === 'Accessories').length, color: 'bg-indigo-600' },
    { name: "Kids & Juniors", share: 10, count: products.filter(p => p.category === 'Kids').length, color: 'bg-emerald-500' }
  ];

  return (
    <div className="space-y-6">
      
      {/* Top Banner / Welcome Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-brand-navy via-brand-navy-surface to-brand-navy text-white p-6 rounded-2xl shadow-premium border border-white/10">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-brand-orange uppercase tracking-wider">
              {settings.shopName} Backoffice
            </span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-[10px] border border-emerald-500/30">
              Live & Synced
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight">
            Executive Overview & Sales Metrics
          </h1>
          <p className="text-xs text-slate-300 max-w-lg">
            Real-time analytics for multi-category catalog, active customer fulfillments, and revenue pipelines.
          </p>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <button 
            onClick={() => onNavigateTab('products')}
            className="px-4 py-2 rounded-xl bg-brand-orange hover:bg-brand-orange-hover text-brand-navy text-xs font-bold transition-all shadow-glow-orange active:scale-95"
          >
            Manage Catalog
          </button>
          <button 
            onClick={() => onNavigateTab('orders')}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold border border-white/15 transition-all"
          >
            View {activeOrders.length} Active Orders
          </button>
        </div>
      </div>

      {/* 4 Primary KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* KPI 1: Total Revenue */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Total Revenue
            </span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <DollarSign className="w-5 h-5 stroke-[2.5]" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              {currencySymbol}{totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="flex items-center space-x-1 text-xs text-emerald-600 dark:text-emerald-400 font-bold mt-1">
              <ArrowUpRight className="w-4 h-4" />
              <span>+24.8% vs last month</span>
            </div>
          </div>
        </div>

        {/* KPI 2: Total Active Orders */}
        <div 
          onClick={() => onNavigateTab('orders')}
          className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3 cursor-pointer hover:border-brand-orange transition-colors group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Total Active Orders
            </span>
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 flex items-center justify-center text-amber-500 group-hover:scale-105 transition-transform">
              <ShoppingBag className="w-5 h-5 stroke-[2.5]" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              {activeOrders.length} <span className="text-xs font-normal text-slate-400">active ({orders.length} total)</span>
            </div>
            <div className="flex items-center space-x-1 text-xs text-brand-orange font-bold mt-1">
              <span>{orders.filter(o => o.status === 'Pending').length} Pending Dispatch</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>

        {/* KPI 3: Total Inventory Units */}
        <div 
          onClick={() => onNavigateTab('products')}
          className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3 cursor-pointer hover:border-brand-orange transition-colors group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Inventory in Stock
            </span>
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <Package className="w-5 h-5 stroke-[2.5]" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              {totalInventoryUnits} <span className="text-xs font-normal text-slate-400">units</span>
            </div>
            <div className="flex items-center space-x-1 text-xs text-slate-500 dark:text-slate-400 mt-1">
              <span>{products.length} SKUs</span>
              <span>•</span>
              <span className="text-amber-500 font-semibold">{lowStockProducts.length} Low stock</span>
            </div>
          </div>
        </div>

        {/* KPI 4: Prime Member Ratio */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Customer Repeat Rate
            </span>
            <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/60 flex items-center justify-center text-purple-600 dark:text-purple-400">
              <Users className="w-5 h-5 stroke-[2.5]" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              72.4%
            </div>
            <div className="flex items-center space-x-1 text-xs text-purple-600 dark:text-purple-400 font-bold mt-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>UR Prime Loyalty Boost</span>
            </div>
          </div>
        </div>

      </div>

      {/* Charts & Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Mock Revenue Chart (Takes 2 Columns on desktop) */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white">
                Revenue Growth & Order Trajectory
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Monthly gross sales calculated across all payment methods
              </p>
            </div>

            <div className="flex items-center space-x-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs">
              <button 
                onClick={() => setTimeframe('month')}
                className={`px-3 py-1 rounded-lg font-bold transition-all ${timeframe === 'month' ? 'bg-white dark:bg-slate-700 text-brand-orange shadow-sm' : 'text-slate-500'}`}
              >
                6 Months
              </button>
              <button 
                onClick={() => setTimeframe('year')}
                className={`px-3 py-1 rounded-lg font-bold transition-all ${timeframe === 'year' ? 'bg-white dark:bg-slate-700 text-brand-orange shadow-sm' : 'text-slate-500'}`}
              >
                Annual
              </button>
            </div>
          </div>

          {/* Responsive Bar Chart with Tooltip Feel */}
          <div className="pt-6 pb-2">
            <div className="h-60 flex items-end justify-between gap-3 sm:gap-6 border-b border-slate-200 dark:border-slate-800 pb-2">
              {REVENUE_DATA.map((item) => {
                const heightPercent = Math.round((item.revenue / maxRevenue) * 100);
                return (
                  <div key={item.month} className="flex-1 flex flex-col items-center group relative h-full justify-end">
                    
                    {/* Hover Floating Stat Bubble */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-12 bg-brand-navy text-white text-[11px] font-bold px-2.5 py-1.5 rounded-lg shadow-xl pointer-events-none whitespace-nowrap z-20 border border-white/10">
                      <div>{currencySymbol}{item.revenue.toLocaleString()}</div>
                      <div className="text-[9px] text-brand-orange font-normal">{item.orders} Orders</div>
                    </div>

                    {/* Bar graphic with Framer Motion */}
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${heightPercent}%` }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                      className={`w-full max-w-[48px] rounded-t-xl transition-all cursor-pointer ${
                        item.isCurrent
                          ? 'bg-gradient-to-t from-brand-orange to-amber-400 shadow-glow-orange'
                          : 'bg-slate-200 dark:bg-slate-700 group-hover:bg-brand-navy group-hover:dark:bg-slate-600'
                      }`}
                    />

                    {/* Month Label */}
                    <span className={`text-xs mt-3 font-semibold ${item.isCurrent ? 'text-brand-orange font-bold' : 'text-slate-500 dark:text-slate-400'}`}>
                      {item.month}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400 pt-3">
              <span>Low: {currencySymbol}18,400 (May)</span>
              <span className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-brand-orange" />
                <span className="font-semibold text-slate-700 dark:text-slate-200">Current Month Velocity</span>
              </span>
              <span className="font-bold text-emerald-600">Peak: {currencySymbol}38,900 (Oct)</span>
            </div>
          </div>
        </div>

        {/* Category Share Distribution */}
        <div className="bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white">
              Category Sales Volume
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Department share in total store turnover
            </p>
          </div>

          <div className="space-y-4">
            {categoryStats.map((cat) => (
              <div key={cat.name} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-700 dark:text-slate-300">
                    {cat.name}
                  </span>
                  <span className="text-slate-500 font-mono font-semibold">
                    {cat.share}% ({cat.count} SKUs)
                  </span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${cat.color}`} 
                    style={{ width: `${cat.share}%` }} 
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="p-3.5 rounded-xl bg-brand-orange/10 dark:bg-brand-orange/20 border border-brand-orange/30 text-xs text-brand-navy dark:text-white flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="font-bold block">Top Performing: Men's Sartorial</span>
              <span className="text-[11px] text-slate-600 dark:text-slate-300">Overcoats drove 42% of October revenue</span>
            </div>
            <button 
              onClick={() => onNavigateTab('products')}
              className="p-1.5 rounded-lg bg-white dark:bg-slate-800 text-brand-orange shadow-sm hover:scale-105 transition-transform"
            >
              <Eye className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>

      {/* Recent Orders Action Ticker */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white">
              Recent Fulfillment Stream
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Latest transactions placed across web & mobile app
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('orders')}
            className="text-xs text-brand-orange font-bold hover:underline flex items-center space-x-1"
          >
            <span>View All Orders</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 uppercase font-semibold">
                <th className="pb-2.5">Order</th>
                <th className="pb-2.5">Customer</th>
                <th className="pb-2.5">Date</th>
                <th className="pb-2.5">Status</th>
                <th className="pb-2.5">Payment</th>
                <th className="pb-2.5 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {orders.slice(0, 4).map((order) => (
                <tr key={order.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 font-mono font-bold text-slate-900 dark:text-white">
                    #{order.id}
                  </td>
                  <td className="py-3">
                    <span className="font-semibold text-slate-800 dark:text-slate-200 block">
                      {order.customerName}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {order.shippingAddress.city}, {order.shippingAddress.state}
                    </span>
                  </td>
                  <td className="py-3 text-slate-500">{order.createdAt}</td>
                  <td className="py-3">
                    <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                      order.status === 'Delivered'
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400'
                        : order.status === 'Shipped'
                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400'
                        : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="py-3 text-slate-500 text-[11px]">{order.paymentMethod}</td>
                  <td className="py-3 text-right font-extrabold text-slate-900 dark:text-white">
                    {currencySymbol}{order.total.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
