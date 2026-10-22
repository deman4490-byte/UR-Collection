import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Filter, 
  Truck, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  ExternalLink, 
  X, 
  MapPin, 
  Mail, 
  Phone, 
  ShoppingBag,
  CreditCard
} from 'lucide-react';
import { AdminOrder, OrderStatus } from '../../types';
import { useStoreSettings } from '../../context/StoreSettingsContext';
import { triggerHaptic } from '../../utils/haptics';

interface OrdersTabProps {
  orders: AdminOrder[];
  onUpdateStatus: (orderId: string, status: OrderStatus) => void;
}

export const OrdersTab: React.FC<OrdersTabProps> = ({
  orders,
  onUpdateStatus
}) => {
  const { currencySymbol } = useStoreSettings();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | OrderStatus>('All');
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);

  // Filter orders
  const filteredOrders = orders.filter((order) => {
    const matchesStatus = statusFilter === 'All' || order.status === statusFilter;
    const matchesSearch = 
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.shippingAddress.city.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'Delivered':
        return {
          bg: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400 border-emerald-300 dark:border-emerald-800',
          icon: CheckCircle2
        };
      case 'Shipped':
        return {
          bg: 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400 border-blue-300 dark:border-blue-800',
          icon: Truck
        };
      case 'Pending':
        return {
          bg: 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400 border-amber-300 dark:border-amber-800',
          icon: Clock
        };
      case 'Cancelled':
      default:
        return {
          bg: 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-400 border-rose-300 dark:border-rose-800',
          icon: XCircle
        };
    }
  };

  return (
    <div className="space-y-5">
      
      {/* Header Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="space-y-0.5">
          <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight">
            Orders & Fulfillment Stream
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Monitor real-time customer purchases, dispatch statuses, and delivery updates
          </p>
        </div>

        {/* Quick status summary counts */}
        <div className="flex items-center space-x-2 text-xs">
          <span className="px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 font-bold border border-amber-200 dark:border-amber-900">
            {orders.filter(o => o.status === 'Pending').length} Pending
          </span>
          <span className="px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-bold border border-blue-200 dark:border-blue-900">
            {orders.filter(o => o.status === 'Shipped').length} Shipped
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative w-full sm:max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Order ID, Customer, or City..."
            className="w-full h-10 pl-10 pr-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-orange"
          />
        </div>

        {/* Status Filter Pill Buttons */}
        <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar w-full sm:w-auto">
          {(['All', 'Pending', 'Shipped', 'Delivered'] as const).map((st) => (
            <button
              key={st}
              onClick={() => {
                setStatusFilter(st);
                triggerHaptic('light');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                statusFilter === st
                  ? 'bg-brand-navy text-white dark:bg-brand-orange dark:text-brand-navy shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Data Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 uppercase font-bold text-[11px]">
                <th className="py-3.5 px-4">Order ID</th>
                <th className="py-3.5 px-4">Customer Details</th>
                <th className="py-3.5 px-4">Status & Dispatch</th>
                <th className="py-3.5 px-4">Payment & Date</th>
                <th className="py-3.5 px-4">Total</th>
                <th className="py-3.5 px-4 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    No orders found matching "{searchQuery}".
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const badge = getStatusBadge(order.status);
                  const Icon = badge.icon;

                  return (
                    <tr
                      key={order.id}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      {/* Order ID */}
                      <td className="py-3.5 px-4 font-mono font-black text-slate-900 dark:text-white">
                        #{order.id}
                      </td>

                      {/* Customer Details */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-0.5">
                          <span className="font-bold text-slate-900 dark:text-white block">
                            {order.customerName}
                          </span>
                          <span className="text-[11px] text-slate-400 block">
                            {order.customerEmail}
                          </span>
                          <span className="text-[10px] text-slate-500 flex items-center space-x-1">
                            <MapPin className="w-3 h-3 text-brand-orange" />
                            <span>{order.shippingAddress.city}, {order.shippingAddress.state}</span>
                          </span>
                        </div>
                      </td>

                      {/* Status (with inline dropdown updater) */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center space-x-2">
                          <select
                            value={order.status}
                            onChange={(e) => {
                              onUpdateStatus(order.id, e.target.value as OrderStatus);
                              triggerHaptic('success');
                            }}
                            className={`px-2.5 py-1 rounded-full font-bold text-[11px] border cursor-pointer focus:outline-none transition-colors ${badge.bg}`}
                          >
                            <option value="Pending">Pending</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </div>
                      </td>

                      {/* Payment & Date */}
                      <td className="py-3.5 px-4 text-slate-500 space-y-0.5">
                        <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block">
                          {order.paymentMethod}
                        </span>
                        <span className="text-[10px] text-slate-400 block">
                          {order.createdAt}
                        </span>
                      </td>

                      {/* Total */}
                      <td className="py-3.5 px-4 font-black text-sm text-slate-900 dark:text-white">
                        {currencySymbol}{order.total.toFixed(2)}
                      </td>

                      {/* Action: Open Drawer */}
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => {
                            setSelectedOrder(order);
                            triggerHaptic('light');
                          }}
                          className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold hover:bg-brand-orange hover:text-brand-navy transition-all"
                        >
                          View
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

      {/* Order Details Slide-over / Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedOrder(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 z-10 overflow-hidden my-auto"
            >
              {/* Modal Header */}
              <div className="bg-brand-navy px-6 py-4 text-white flex items-center justify-between">
                <div>
                  <h3 className="font-extrabold text-base">Order #{selectedOrder.id} Details</h3>
                  <p className="text-xs text-white/70">Placed {selectedOrder.createdAt}</p>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="p-1 rounded-full text-white/80 hover:text-white hover:bg-white/10"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto custom-scrollbar text-xs">
                {/* Customer card */}
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-1.5">
                  <span className="font-bold text-slate-900 dark:text-white block text-sm">
                    {selectedOrder.customerName}
                  </span>
                  <div className="text-slate-500 space-y-1 text-xs">
                    <p className="flex items-center space-x-1.5">
                      <Mail className="w-3.5 h-3.5 text-brand-orange" />
                      <span>{selectedOrder.customerEmail}</span>
                    </p>
                    <p className="flex items-center space-x-1.5">
                      <MapPin className="w-3.5 h-3.5 text-brand-orange" />
                      <span>
                        {selectedOrder.shippingAddress.street}, {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.zipCode}
                      </span>
                    </p>
                    {selectedOrder.trackingNumber && (
                      <p className="flex items-center space-x-1.5 pt-1 font-mono font-bold text-blue-600 dark:text-blue-400">
                        <Truck className="w-3.5 h-3.5" />
                        <span>Tracking: {selectedOrder.trackingNumber}</span>
                      </p>
                    )}
                  </div>
                </div>

                {/* Items in order */}
                <div className="space-y-2">
                  <span className="font-bold text-slate-700 dark:text-slate-300">
                    Ordered Items ({selectedOrder.items.length})
                  </span>
                  <div className="space-y-2">
                    {selectedOrder.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between space-x-3"
                      >
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-12 h-14 object-cover rounded-lg bg-slate-100 dark:bg-slate-800"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-slate-900 dark:text-white truncate">
                            {item.title}
                          </h4>
                          <span className="text-[11px] text-slate-400">
                            Qty: {item.quantity} {item.selectedSize ? `• Size: ${item.selectedSize}` : ''}
                          </span>
                        </div>
                        <span className="font-black text-slate-900 dark:text-white">
                          {currencySymbol}{(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Financial Summary */}
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-1.5">
                  <div className="flex justify-between text-slate-600 dark:text-slate-400">
                    <span>Payment Method</span>
                    <span className="font-semibold text-slate-900 dark:text-white">{selectedOrder.paymentMethod}</span>
                  </div>
                  <div className="flex justify-between font-black text-sm text-slate-900 dark:text-white pt-1 border-t border-slate-200 dark:border-slate-700">
                    <span>Total Amount Paid</span>
                    <span className="text-base text-brand-orange">{currencySymbol}{selectedOrder.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
