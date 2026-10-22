import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart3, 
  Package, 
  ShoppingBag, 
  Settings, 
  Store, 
  Menu, 
  X, 
  Sun, 
  Moon, 
  Sparkles, 
  Bell, 
  ArrowLeft,
  ShieldCheck,
  ChevronRight,
  LogOut
} from 'lucide-react';
import { AdminTab } from '../../types';
import { useStoreSettings } from '../../context/StoreSettingsContext';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { triggerHaptic } from '../../utils/haptics';

interface AdminLayoutProps {
  currentTab: AdminTab;
  onTabChange?: (tab: AdminTab) => void;
  onExitToStorefront?: () => void;
  activeOrdersCount: number;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  currentTab,
  onTabChange,
  onExitToStorefront,
  activeOrdersCount,
  children
}) => {
  const { settings } = useStoreSettings();
  const { isDark, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleExitToStorefront = () => {
    triggerHaptic('medium');
    if (onExitToStorefront) {
      onExitToStorefront();
    } else {
      navigate('/');
    }
  };

  const handleSignOut = async () => {
    triggerHaptic('medium');
    await logout();
    navigate('/admin/login');
  };

  const TABS: { id: AdminTab; label: string; icon: React.ElementType; badge?: string | number }[] = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'products', label: 'Products Manager', icon: Package },
    { id: 'orders', label: 'Orders', icon: ShoppingBag, badge: activeOrdersCount > 0 ? activeOrdersCount : undefined },
    { id: 'settings', label: 'Store Settings', icon: Settings, badge: 'Critical' }
  ];

  const handleSelectTab = (tab: AdminTab) => {
    triggerHaptic('light');
    if (onTabChange) {
      onTabChange(tab);
    }
    navigate(`/admin/${tab}`);
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col md:flex-row transition-colors selection:bg-brand-orange selection:text-white">
      
      {/* Desktop Persistent Sidebar (Navy Blue) */}
      <aside className="hidden md:flex flex-col w-64 lg:w-72 bg-brand-navy text-white shrink-0 shadow-2xl border-r border-brand-navy-surface z-30 justify-between">
        
        {/* Brand & Monogram Header */}
        <div>
          <div className="p-6 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-orange to-amber-400 flex items-center justify-center font-black text-brand-navy shadow-md">
                <span className="text-base tracking-tighter">
                  {settings.shopName.slice(0, 2).toUpperCase() || 'UR'}
                </span>
              </div>
              <div className="min-w-0">
                <span className="font-black text-sm lg:text-base text-white truncate block leading-tight">
                  {settings.shopName}
                </span>
                <span className="text-[10px] font-bold text-brand-orange uppercase tracking-wider block">
                  Admin Console
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="p-4 space-y-1.5">
            <span className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">
              Storefront Management
            </span>

            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = currentTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleSelectTab(tab.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-brand-orange text-brand-navy shadow-glow-orange font-extrabold'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'stroke-[2.5]' : ''}`} />
                    <span>{tab.label}</span>
                  </div>

                  {tab.badge && (
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                      isActive 
                        ? 'bg-brand-navy text-brand-orange' 
                        : tab.badge === 'Critical'
                        ? 'bg-rose-500 text-white'
                        : 'bg-brand-orange text-brand-navy'
                    }`}>
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Sidebar Bottom Actions */}
        <div className="p-4 border-t border-white/10 space-y-3">
          {/* Switch to Live Store Button */}
          <button
            onClick={handleExitToStorefront}
            className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold border border-white/10 transition-all group"
          >
            <div className="flex items-center space-x-2.5">
              <Store className="w-4 h-4 text-brand-orange group-hover:scale-110 transition-transform" />
              <span>View Live Storefront</span>
            </div>
            <ChevronRight className="w-4 h-4 text-white/50" />
          </button>

          {/* Admin Profile & Theme / Sign Out Toggle */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center space-x-2.5 min-w-0 pr-2">
              <div className="w-8 h-8 rounded-full bg-brand-orange text-brand-navy font-bold text-xs flex items-center justify-center shrink-0">
                {user?.email ? user.email.slice(0, 1).toUpperCase() : 'S'}
              </div>
              <div className="text-left text-xs leading-none min-w-0">
                <span className="font-bold text-white block truncate">
                  {user?.email ? user.email.split('@')[0] : 'Shan'}
                </span>
                <span className="text-[10px] text-white/50 truncate block">
                  {user ? 'Firebase Admin' : 'Store Owner'}
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-1 shrink-0">
              <button
                onClick={toggleTheme}
                className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                title="Toggle Theme"
              >
                {isDark ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4" />}
              </button>

              <button
                onClick={handleSignOut}
                className="p-1.5 rounded-lg text-rose-300 hover:text-rose-200 hover:bg-rose-500/20 transition-colors"
                title="Sign Out of Admin Console"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Header Bar */}
        <header className="sticky top-0 z-20 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-sm px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {/* Mobile Hamburger Trigger */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden p-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <Menu className="w-6 h-6" />
            </button>

            {/* Breadcrumb Title */}
            <div>
              <div className="flex items-center space-x-2 text-xs text-slate-400 font-medium">
                <span>{settings.shopName}</span>
                <span>/</span>
                <span className="text-slate-800 dark:text-slate-200 font-bold capitalize">
                  {currentTab === 'settings' ? 'Store Settings (Critical)' : currentTab}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Return to Live Store button on top bar */}
            <button
              onClick={handleExitToStorefront}
              className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 transition-colors"
            >
              <Store className="w-4 h-4 text-brand-orange" />
              <span>Back to Storefront</span>
            </button>

            {/* Sign Out Button */}
            <button
              onClick={handleSignOut}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/50 text-rose-600 dark:text-rose-400 text-xs font-bold transition-colors border border-rose-200 dark:border-rose-900/50"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </header>

        {/* Tab Page Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>

      </div>

      {/* Mobile Drawer Navigation */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 md:hidden overflow-hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              className="relative w-72 h-full bg-brand-navy text-white flex flex-col justify-between p-5 z-10"
            >
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-white/10">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-8 h-8 rounded-lg bg-brand-orange text-brand-navy font-bold flex items-center justify-center">
                      {settings.shopName.slice(0, 2).toUpperCase() || 'UR'}
                    </div>
                    <span className="font-extrabold text-sm">{settings.shopName}</span>
                  </div>
                  <button onClick={() => setIsMobileMenuOpen(false)}>
                    <X className="w-5 h-5 text-white/80" />
                  </button>
                </div>

                <div className="py-4 space-y-1.5">
                  {TABS.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = currentTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => handleSelectTab(tab.id)}
                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                          isActive
                            ? 'bg-brand-orange text-brand-navy font-extrabold'
                            : 'text-white/80 hover:bg-white/10'
                        }`}
                      >
                        <div className="flex items-center space-x-2.5">
                          <Icon className="w-4 h-4" />
                          <span>{tab.label}</span>
                        </div>
                        {tab.badge && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-brand-navy text-brand-orange font-bold">
                            {tab.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 space-y-2">
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    handleExitToStorefront();
                  }}
                  className="w-full py-2.5 rounded-xl bg-white/10 text-white font-bold text-xs flex items-center justify-center space-x-2"
                >
                  <Store className="w-4 h-4 text-brand-orange" />
                  <span>Exit to Storefront</span>
                </button>

                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    handleSignOut();
                  }}
                  className="w-full py-2.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 font-bold text-xs flex items-center justify-center space-x-2 border border-rose-500/30 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
