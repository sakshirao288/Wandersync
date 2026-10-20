import React, { useState } from 'react';
import { CurrencyRate, Language } from '../types/travel';
import { translations } from '../utils/translations';
import { MOCK_CURRENCY_RATES, MOCK_PRICE_ANCHORS } from '../data/mockTravelData';
import { 
  ArrowRightLeft, 
  Coins, 
  DollarSign, 
  Percent, 
  HelpCircle, 
  TrendingUp, 
  Calculator,
  UtensilsCrossed,
  Info
} from 'lucide-react';

interface CurrencyConverterProps {
  lang: Language;
}

export const CurrencyConverter: React.FC<CurrencyConverterProps> = ({ lang }) => {
  const t = translations[lang];

  // Converter state
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');
  const [amount, setAmount] = useState<number>(100);

  // Tip Calculator state
  const [billAmount, setBillAmount] = useState<number>(75);
  const [dinersCount, setDinersCount] = useState<number>(4);
  const [tipOption, setTipOption] = useState<'roundup' | '5' | '10' | 'none'>('roundup');
  const [hasCoperto, setHasCoperto] = useState<boolean>(true);
  const [copertoPerPerson, setCopertoPerPerson] = useState<number>(2.5);

  const fromRate = MOCK_CURRENCY_RATES.find(c => c.code === fromCurrency)?.rateToUSD || 1;
  const toRate = MOCK_CURRENCY_RATES.find(c => c.code === toCurrency)?.rateToUSD || 1;

  // Rate from base to target: (amount / fromRate) * toRate
  const convertedValue = ((amount / fromRate) * toRate);
  const singleExchangeRate = (toRate / fromRate);

  const handleSwapCurrencies = () => {
    const temp = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(temp);
  };

  // Tip calculations
  const copertoTotal = hasCoperto ? copertoPerPerson * dinersCount : 0;
  const baseSubtotal = billAmount + copertoTotal;

  let tipAmount = 0;
  if (tipOption === 'roundup') {
    // Round up by ~€1-€2 per diner or to nearest €5
    tipAmount = Math.max(dinersCount * 1.5, 4);
  } else if (tipOption === '5') {
    tipAmount = baseSubtotal * 0.05;
  } else if (tipOption === '10') {
    tipAmount = baseSubtotal * 0.10;
  }

  const finalTotal = baseSubtotal + tipAmount;
  const perPersonTotal = dinersCount > 0 ? (finalTotal / dinersCount) : finalTotal;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight font-display flex items-center gap-2">
          <Coins className="w-5 h-5 text-amber-600" />
          <span>{t.currency.title}</span>
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          {t.currency.subtitle}
        </p>

        {/* Currency Converter Interactive Box */}
        <div className="mt-6 p-5 bg-slate-50 rounded-xl border border-slate-200">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            {/* From Input (5 cols) */}
            <div className="md:col-span-5 space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                {t.currency.amountToConvert}
              </label>
              <div className="flex rounded-lg border border-slate-300 bg-white overflow-hidden focus-within:ring-2 focus-within:ring-slate-900">
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={amount || ''}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 text-base font-bold font-mono text-slate-900 focus:outline-none"
                />
                <select
                  value={fromCurrency}
                  onChange={(e) => setFromCurrency(e.target.value)}
                  className="px-3 py-2 bg-slate-100 text-xs font-bold text-slate-800 border-l border-slate-200 focus:outline-none cursor-pointer"
                >
                  {MOCK_CURRENCY_RATES.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.flag} {c.code}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Swap Button (2 cols) */}
            <div className="md:col-span-2 flex justify-center py-2 md:py-0">
              <button
                onClick={handleSwapCurrencies}
                className="p-2.5 rounded-full bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 transition-colors shadow-xs"
                title="Swap currencies"
              >
                <ArrowRightLeft className="w-4 h-4" />
              </button>
            </div>

            {/* To Result (5 cols) */}
            <div className="md:col-span-5 space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                {t.currency.convertedResult}
              </label>
              <div className="flex rounded-lg border border-slate-300 bg-white overflow-hidden focus-within:ring-2 focus-within:ring-slate-900">
                <div className="w-full px-3 py-2 text-base font-bold font-mono text-emerald-700 flex items-center bg-emerald-50/30">
                  {convertedValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <select
                  value={toCurrency}
                  onChange={(e) => setToCurrency(e.target.value)}
                  className="px-3 py-2 bg-slate-100 text-xs font-bold text-slate-800 border-l border-slate-200 focus:outline-none cursor-pointer"
                >
                  {MOCK_CURRENCY_RATES.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.flag} {c.code}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-200/70 flex items-center justify-between text-xs text-slate-500 font-mono">
            <span>
              1 {fromCurrency} = {singleExchangeRate.toFixed(4)} {toCurrency}
            </span>
            <span className="text-[11px] text-slate-400">
              Live Interbank Mid-Market Rate
            </span>
          </div>
        </div>
      </div>

      {/* Two Column Grid: Local Price Anchors & Dining Tip Calculator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Everyday Rome Price Benchmarks (6 cols) */}
        <div className="lg:col-span-6 bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 mb-1 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-slate-600" />
            <span>{t.currency.localPriceBenchmarks}</span>
          </h3>
          <p className="text-xs text-slate-500 mb-4">
            Avoid tourist traps: typical fair prices paid by Rome locals
          </p>

          <div className="divide-y divide-slate-100 text-xs">
            {MOCK_PRICE_ANCHORS.map((anchor, i) => {
              const inUserCurrency = (anchor.priceEur / 0.92) * toRate;
              return (
                <div key={i} className="py-2.5 flex items-center justify-between gap-3">
                  <div>
                    <span className="font-semibold text-slate-800 block">{anchor.item}</span>
                    <span className="text-[10px] text-slate-400">{anchor.category}</span>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="font-bold text-slate-900 font-mono tabular-nums block">
                      €{anchor.priceEur.toFixed(2)}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      ~ {toCurrency} {inUserCurrency.toFixed(2)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Tip & Coperto Dining Calculator (6 cols) */}
        <div className="lg:col-span-6 bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-1 flex items-center gap-2">
              <Calculator className="w-4 h-4 text-amber-600" />
              <span>Dining Tip &amp; Coperto Calculator</span>
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Calculate fair European group bill splits with Italian coperto
            </p>

            <div className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Bill Amount (€)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={billAmount || ''}
                    onChange={(e) => setBillAmount(Number(e.target.value))}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Number of Diners
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={dinersCount}
                    onChange={(e) => setDinersCount(Number(e.target.value))}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs font-mono font-bold"
                  />
                </div>
              </div>

              {/* Coperto Toggle */}
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-800 block">Table Bread &amp; Service (Coperto)</span>
                  <span className="text-[10px] text-slate-500">€{copertoPerPerson} per person bread fee</span>
                </div>
                <input
                  type="checkbox"
                  checked={hasCoperto}
                  onChange={(e) => setHasCoperto(e.target.checked)}
                  className="rounded text-slate-900 focus:ring-slate-900"
                />
              </div>

              {/* Tip Preset Options */}
              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Tip Selection
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { id: 'roundup', label: 'Round Up' },
                    { id: '5', label: '5%' },
                    { id: '10', label: '10%' },
                    { id: 'none', label: 'No Tip' },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setTipOption(opt.id as any)}
                      className={`py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                        tipOption === opt.id
                          ? 'bg-slate-900 text-white'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Calculated Results Box */}
              <div className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-2 font-mono text-xs">
                <div className="flex justify-between text-slate-700">
                  <span>Subtotal + Coperto:</span>
                  <span>€{baseSubtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-700">
                  <span>Calculated Tip:</span>
                  <span>€{tipAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-slate-900 pt-1 border-t border-emerald-200 text-sm">
                  <span>Total Bill:</span>
                  <span className="text-emerald-800">€{finalTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-600 text-[11px] pt-1">
                  <span>Per Person ({dinersCount} travelers):</span>
                  <span className="font-bold text-slate-900">€{perPersonTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Cultural Etiquette Notice */}
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-start gap-2 text-[11px] text-slate-500">
            <Info className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              {t.currency.tippingAdvice}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
