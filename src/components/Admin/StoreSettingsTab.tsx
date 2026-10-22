import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Building2, 
  MapPin, 
  CreditCard, 
  Coins, 
  Save, 
  Check, 
  Sparkles, 
  AlertCircle, 
  RefreshCw,
  Eye,
  CheckCircle2
} from 'lucide-react';
import { useStoreSettings } from '../../context/StoreSettingsContext';
import { triggerHaptic } from '../../utils/haptics';

const CURRENCIES = [
  { code: 'USD', symbol: '$', label: 'USD - United States Dollar ($)' },
  { code: 'EUR', symbol: '€', label: 'EUR - Euro (€)' },
  { code: 'GBP', symbol: '£', label: 'GBP - British Pound (£)' },
  { code: 'CAD', symbol: '$', label: 'CAD - Canadian Dollar ($)' },
  { code: 'INR', symbol: '₹', label: 'INR - Indian Rupee (₹)' },
  { code: 'JPY', symbol: '¥', label: 'JPY - Japanese Yen (¥)' },
  { code: 'AUD', symbol: '$', label: 'AUD - Australian Dollar ($)' }
] as const;

export const StoreSettingsTab: React.FC = () => {
  const { settings, updateSettings, isSaving } = useStoreSettings();

  // Controlled Form State
  const [shopName, setShopName] = useState(settings.shopName);
  const [tagline, setTagline] = useState(settings.tagline || 'HAUTE & STREET');
  const [street, setStreet] = useState(settings.physicalAddress.street);
  const [city, setCity] = useState(settings.physicalAddress.city);
  const [state, setState] = useState(settings.physicalAddress.state);
  const [zipCode, setZipCode] = useState(settings.physicalAddress.zipCode);
  const [country, setCountry] = useState(settings.physicalAddress.country);
  
  // Currency
  const [currencyCode, setCurrencyCode] = useState(settings.defaultCurrency.code);

  // Payment Toggles
  const [enableCod, setEnableCod] = useState(settings.payments.enableCod);
  const [enableStripe, setEnableStripe] = useState(settings.payments.enableStripe);
  const [enableApplePay, setEnableApplePay] = useState(settings.payments.enableApplePay);

  // Status feedback
  const [saveSuccessMessage, setSaveSuccessMessage] = useState<string | null>(null);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();

    const selectedCurrencyObj = CURRENCIES.find((c) => c.code === currencyCode) || CURRENCIES[0];

    const result = await updateSettings({
      shopName: shopName.trim() || 'UR Collection',
      tagline: tagline.trim(),
      physicalAddress: {
        street: street.trim(),
        city: city.trim(),
        state: state.trim(),
        zipCode: zipCode.trim(),
        country: country.trim()
      },
      defaultCurrency: {
        code: selectedCurrencyObj.code as any,
        symbol: selectedCurrencyObj.symbol
      },
      payments: {
        enableCod,
        enableStripe,
        enableApplePay
      }
    });

    if (result.success) {
      setSaveSuccessMessage(result.message);
      setTimeout(() => setSaveSuccessMessage(null), 4000);
    }
  };

  const selectedCurrencyObj = CURRENCIES.find((c) => c.code === currencyCode) || CURRENCIES[0];

  return (
    <div className="space-y-6">
      
      {/* Header Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="space-y-0.5">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-brand-orange uppercase tracking-wider">
              Store Configuration
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight">
            Storefront Settings & Brand Engine
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Configure your brand identity, business address, currency formatting, and accepted payment methods.
          </p>
        </div>

        {saveSuccessMessage && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="px-4 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-xs font-bold text-emerald-700 dark:text-emerald-300 flex items-center space-x-2"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{saveSuccessMessage}</span>
          </motion.div>
        )}
      </div>

      <form onSubmit={handleSaveSettings} className="space-y-6">
        
        {/* Section 1: Dynamic Shop Name (Updates logo/text globally) */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl bg-orange-50 dark:bg-orange-950/60 flex items-center justify-center text-brand-orange">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                  Dynamic Brand Identity & Shop Name
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Controls the primary navigation logo, header branding, and transactional invoices globally
                </p>
              </div>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-brand-orange/10 text-brand-orange uppercase">
              Global Sync
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Dynamic Shop Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={shopName}
                onChange={(e) => setShopName(e.target.value)}
                placeholder="e.g. UR Collection"
                className="w-full h-11 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-orange"
                required
              />
              <p className="text-[11px] text-slate-400">
                Updating this dynamically changes the storefront header logo and title tags immediately.
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Brand Tagline
              </label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                placeholder="e.g. HAUTE & STREET"
                className="w-full h-11 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-orange"
              />
              <p className="text-[11px] text-slate-400">
                Secondary sub-branding displayed under the primary monogram.
              </p>
            </div>
          </div>

          {/* Live Global Header Preview Pill */}
          <div className="p-3 rounded-xl bg-brand-navy text-white flex items-center justify-between border border-white/10 shadow-inner">
            <div className="flex items-center space-x-2">
              <Eye className="w-4 h-4 text-brand-orange" />
              <span className="text-xs text-white/60">Live Header Preview:</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-brand-orange to-amber-400 flex items-center justify-center font-black text-brand-navy text-xs">
                {shopName.slice(0, 2).toUpperCase() || 'UR'}
              </div>
              <div className="flex flex-col text-left">
                <span className="font-extrabold text-sm text-white leading-none">
                  {shopName.toUpperCase() || 'UR COLLECTION'}
                </span>
                <span className="text-[8px] font-bold text-brand-orange tracking-widest uppercase">
                  {tagline.toUpperCase() || 'HAUTE & STREET'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Physical Address */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-5 sm:p-6 space-y-4">
          <div className="flex items-center space-x-2.5 border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/60 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                Physical Headquarters & Fulfillment Address
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Printed on customer invoices, return slips, and used for regional sales tax computation
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2 space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Street Address <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                placeholder="450 Lexington Ave, Suite 1200"
                className="w-full h-10 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-orange"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                City <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="New York"
                className="w-full h-10 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-orange"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                State / Province <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={state}
                onChange={(e) => setState(e.target.value)}
                placeholder="NY"
                className="w-full h-10 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-orange"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Postal / Zip Code <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
                placeholder="10017"
                className="w-full h-10 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-orange"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Country <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder="United States"
                className="w-full h-10 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-orange"
                required
              />
            </div>
          </div>
        </div>

        {/* Section 3: Default Currency */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-5 sm:p-6 space-y-4">
          <div className="flex items-center space-x-2.5 border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="w-9 h-9 rounded-xl bg-purple-50 dark:bg-purple-950/60 flex items-center justify-center text-purple-600 dark:text-purple-400">
              <Coins className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                Default Currency Formatting
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Sets default price formatting across product cards, cart totals, and invoices
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Select Storefront Currency <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {CURRENCIES.map((c) => {
                const isSelected = currencyCode === c.code;
                return (
                  <button
                    key={c.code}
                    type="button"
                    onClick={() => {
                      setCurrencyCode(c.code as any);
                      triggerHaptic('light');
                    }}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'border-brand-orange bg-brand-orange/10 dark:bg-brand-orange/20 ring-1 ring-brand-orange shadow-sm'
                        : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-base font-black text-slate-900 dark:text-white">
                        {c.symbol} {c.code}
                      </span>
                      {isSelected && <Check className="w-4 h-4 text-brand-orange stroke-[3]" />}
                    </div>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 block mt-0.5 truncate">
                      {c.label.split('-')[1]?.trim()}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Section 4: Payment Toggles (COD & Stripe) */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-5 sm:p-6 space-y-4">
          <div className="flex items-center space-x-2.5 border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                Payment Gateways & Customer Checkout Toggles
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Activate or disable payment methods accepted during customer checkout
              </p>
            </div>
          </div>

          <div className="space-y-3">
            
            {/* Toggle 1: Cash on Delivery */}
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-slate-900 dark:text-white block">
                  Enable Cash on Delivery (COD)
                </span>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Allows customers to pay in physical cash or mobile terminal upon parcel delivery.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setEnableCod(!enableCod);
                  triggerHaptic('light');
                }}
                className={`w-12 h-6 rounded-full relative p-0.5 transition-colors ${
                  enableCod ? 'bg-brand-orange' : 'bg-slate-300 dark:bg-slate-700'
                }`}
              >
                <motion.div
                  layout
                  className={`w-5 h-5 rounded-full bg-white shadow-md ${
                    enableCod ? 'ml-auto' : 'ml-0'
                  }`}
                />
              </button>
            </div>

            {/* Toggle 2: Stripe Credit / Debit Cards */}
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-slate-900 dark:text-white block">
                  Enable Stripe Payments (Credit & Debit Cards)
                </span>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Accept Visa, Mastercard, American Express via 256-bit encrypted Stripe Elements.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setEnableStripe(!enableStripe);
                  triggerHaptic('light');
                }}
                className={`w-12 h-6 rounded-full relative p-0.5 transition-colors ${
                  enableStripe ? 'bg-brand-orange' : 'bg-slate-300 dark:bg-slate-700'
                }`}
              >
                <motion.div
                  layout
                  className={`w-5 h-5 rounded-full bg-white shadow-md ${
                    enableStripe ? 'ml-auto' : 'ml-0'
                  }`}
                />
              </button>
            </div>

            {/* Toggle 3: Apple Pay / Google Pay */}
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-slate-900 dark:text-white block">
                  Enable 1-Touch Apple Pay & Google Pay
                </span>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Biometric touch/face authentication for instant conversion on native Capacitor mobile.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setEnableApplePay(!enableApplePay);
                  triggerHaptic('light');
                }}
                className={`w-12 h-6 rounded-full relative p-0.5 transition-colors ${
                  enableApplePay ? 'bg-brand-orange' : 'bg-slate-300 dark:bg-slate-700'
                }`}
              >
                <motion.div
                  layout
                  className={`w-5 h-5 rounded-full bg-white shadow-md ${
                    enableApplePay ? 'ml-auto' : 'ml-0'
                  }`}
                />
              </button>
            </div>

          </div>
        </div>

        {/* Primary Save Changes CTA */}
        <div className="flex items-center justify-between pt-2">
          <p className="text-xs text-slate-400">
            All updates sync across your storefront and checkout in real-time.
          </p>

          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-3 rounded-xl bg-brand-orange hover:bg-brand-orange-hover active:bg-brand-orange-active text-brand-navy font-black text-xs sm:text-sm flex items-center space-x-2 shadow-glow-orange active:scale-95 transition-all disabled:opacity-70"
          >
            {isSaving ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Saving Changes...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4 stroke-[2.5]" />
                <span>Save Store Settings</span>
              </>
            )}
          </button>
        </div>

      </form>

    </div>
  );
};
