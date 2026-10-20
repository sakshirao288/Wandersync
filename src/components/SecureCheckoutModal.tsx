import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { BookingReceipt, Language } from '../types/travel';
import { translations } from '../utils/translations';
import { 
  ShieldCheck, 
  CreditCard, 
  Lock, 
  CheckCircle, 
  X, 
  Download, 
  QrCode, 
  Sparkles,
  Smartphone
} from 'lucide-react';

interface SecureCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingItem: {
    type: 'hotel' | 'transit' | 'experience';
    title: string;
    details: string;
    price: number;
  } | null;
  onPaymentSuccess: (receipt: BookingReceipt) => void;
  lang: Language;
}

export const SecureCheckoutModal: React.FC<SecureCheckoutModalProps> = ({
  isOpen,
  onClose,
  bookingItem,
  onPaymentSuccess,
  lang,
}) => {
  const t = translations[lang];

  const [paymentMethod, setPaymentMethod] = useState<'card' | 'wallet'>('card');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [expiry, setExpiry] = useState('11/28');
  const [cvv, setCvv] = useState('981');
  const [name, setName] = useState('Alex Rivers');
  const [promoCode, setPromoCode] = useState('');
  const [isPromoApplied, setIsPromoApplied] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedReceipt, setCompletedReceipt] = useState<BookingReceipt | null>(null);

  if (!isOpen || !bookingItem) return null;

  const basePrice = bookingItem.price;
  const discount = isPromoApplied ? Math.round(basePrice * 0.15) : 0;
  const taxes = Math.round((basePrice - discount) * 0.10);
  const totalDue = basePrice - discount + taxes;

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (promoCode.trim().toUpperCase() === 'WANDER2026' || promoCode.trim().toUpperCase() === 'EXPLORE') {
      setIsPromoApplied(true);
    } else {
      alert("Invalid code. Try using promo code 'WANDER2026' for 15% off!");
    }
  };

  const handleProcessPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      const code = `WS-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      const newReceipt: BookingReceipt = {
        id: `rec-${Date.now()}`,
        itemType: bookingItem.type,
        title: bookingItem.title,
        date: bookingItem.details,
        guests: 4,
        totalAmount: totalDue,
        currency: 'USD',
        status: 'confirmed',
        bookingCode: code,
        paymentMethod: paymentMethod === 'card' ? `Visa •••• ${cardNumber.slice(-4) || '4242'}` : 'Apple Pay Instant',
        cardLastFour: cardNumber.slice(-4) || '4242',
        bookedAt: new Date().toLocaleString(),
        qrCodeMock: `WANDERSYNC-AUTH-${code}`,
      };

      setCompletedReceipt(newReceipt);
      onPaymentSuccess(newReceipt);

      // Trigger celebration confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (err) {
        // fallback
      }
    }, 1800);
  };

  const handleClose = () => {
    setCompletedReceipt(null);
    setIsPromoApplied(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150 my-8">
        {/* Top Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 leading-tight">
                {completedReceipt ? t.booking.paymentSuccess : t.checkout.title}
              </h3>
              <p className="text-[11px] text-slate-500">
                {t.checkout.secureNote}
              </p>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="p-1.5 hover:bg-slate-200 text-slate-400 hover:text-slate-700 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        {completedReceipt ? (
          /* Confirmation & Offline Voucher View */
          <div className="p-6 space-y-6 text-center">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8" />
            </div>

            <div>
              <h4 className="text-xl font-bold text-slate-900 font-display">
                {completedReceipt.title}
              </h4>
              <p className="text-xs text-slate-500 mt-1">
                {t.booking.receiptDesc}
              </p>
            </div>

            {/* Voucher Box */}
            <div className="p-4 bg-slate-50 rounded-xl border border-dashed border-slate-300 text-left space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <span className="text-slate-500">CONFIRMATION REF:</span>
                <span className="font-bold text-slate-900 text-sm tracking-wider">
                  {completedReceipt.bookingCode}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-500">PAID VIA:</span>
                <span className="font-semibold text-slate-800">{completedReceipt.paymentMethod}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-500">TOTAL CHARGED:</span>
                <span className="font-bold text-emerald-700 text-sm">${completedReceipt.totalAmount} USD</span>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                <span className="text-slate-500">OFFLINE PASS STATUS:</span>
                <span className="text-emerald-700 font-semibold">Cached in Device Storage</span>
              </div>

              {/* QR Code Graphic Simulation */}
              <div className="pt-3 flex flex-col items-center justify-center text-center">
                <div className="p-3 bg-white rounded-lg border border-slate-200 shadow-xs inline-block">
                  <QrCode className="w-20 h-20 text-slate-900" />
                </div>
                <span className="text-[10px] text-slate-400 mt-1">Scan for Gate or Hotel Check-in</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  alert(`Voucher PDF [${completedReceipt.bookingCode}.pdf] prepared! Available offline.`);
                }}
                className="flex-1 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-xs"
              >
                <Download className="w-4 h-4" />
                <span>{t.booking.downloadReceipt}</span>
              </button>

              <button
                onClick={handleClose}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
              >
                {t.common.close}
              </button>
            </div>
          </div>
        ) : (
          /* Payment Form View */
          <form onSubmit={handleProcessPayment} className="p-6 space-y-4">
            {/* Item summary banner */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="text-[11px] font-semibold text-amber-700 uppercase tracking-wider">
                    {bookingItem.type.toUpperCase()} RESERVATION
                  </span>
                  <h4 className="text-sm font-bold text-slate-900 mt-0.5">
                    {bookingItem.title}
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {bookingItem.details}
                  </p>
                </div>
                <span className="text-base font-bold text-slate-900 font-mono tabular-nums shrink-0">
                  ${bookingItem.price}
                </span>
              </div>
            </div>

            {/* Payment Method Switcher */}
            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-lg">
              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`py-2 text-xs font-semibold rounded-md transition-colors flex items-center justify-center gap-1.5 ${
                  paymentMethod === 'card'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>{t.checkout.cardTab}</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('wallet')}
                className={`py-2 text-xs font-semibold rounded-md transition-colors flex items-center justify-center gap-1.5 ${
                  paymentMethod === 'wallet'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>{t.checkout.walletTab}</span>
              </button>
            </div>

            {/* Card Fields */}
            {paymentMethod === 'card' ? (
              <div className="space-y-3 text-xs">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    {t.checkout.cardNumber}
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      placeholder="4242 4242 4242 4242"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 font-mono text-xs"
                    />
                    <CreditCard className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-medium text-slate-700 mb-1">
                      {t.checkout.expiry}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="MM/YY"
                      value={expiry}
                      onChange={(e) => setExpiry(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 font-mono text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-slate-700 mb-1">
                      {t.checkout.cvv}
                    </label>
                    <input
                      type="password"
                      required
                      maxLength={4}
                      placeholder="•••"
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 font-mono text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    {t.checkout.cardholder}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Alex Rivers"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 text-xs"
                  />
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 text-center space-y-2">
                <Smartphone className="w-8 h-8 text-slate-700 mx-auto" />
                <p className="text-xs font-semibold text-slate-800">
                  Instant One-Touch Authorization
                </p>
                <p className="text-[11px] text-slate-500">
                  Ready with biometric Apple Pay / Google Pay. Charges will be billed to your linked travel pass card.
                </p>
              </div>
            )}

            {/* Promo Code Strip */}
            <div className="pt-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Promo Code (e.g. WANDER2026)"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="flex-1 px-3 py-1.5 border border-slate-300 rounded-lg text-xs uppercase"
                />
                <button
                  type="button"
                  onClick={handleApplyPromo}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold"
                >
                  {t.checkout.apply}
                </button>
              </div>
              {isPromoApplied && (
                <span className="text-[11px] text-emerald-700 font-semibold block mt-1">
                  ✓ {t.checkout.promoApplied}
                </span>
              )}
            </div>

            {/* Price Calculations */}
            <div className="pt-3 border-t border-slate-200 space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>{t.checkout.subtotal}</span>
                <span className="font-mono tabular-nums">${basePrice}</span>
              </div>
              {isPromoApplied && (
                <div className="flex justify-between text-emerald-700 font-medium">
                  <span>Group Discount (15%)</span>
                  <span className="font-mono tabular-nums">- ${discount}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-600">
                <span>{t.checkout.taxesAndFees}</span>
                <span className="font-mono tabular-nums">${taxes}</span>
              </div>
              <div className="flex justify-between text-slate-900 font-bold text-sm pt-2 border-t border-slate-100">
                <span>{t.checkout.total}</span>
                <span className="font-mono tabular-nums text-base">${totalDue} USD</span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isProcessing}
              className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2 shadow-xs disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>{t.checkout.processing}</span>
                </>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5" />
                  <span>{t.checkout.payNow} (${totalDue})</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
