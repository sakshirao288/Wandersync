import React from 'react';
import { BookingReceipt, Language } from '../types/travel';
import { translations } from '../utils/translations';
import { 
  X, 
  CheckCircle, 
  Ticket, 
  Building2, 
  Download, 
  QrCode, 
  Calendar,
  ShieldCheck
} from 'lucide-react';

interface BookingsListModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookings: BookingReceipt[];
  lang: Language;
}

export const BookingsListModal: React.FC<BookingsListModalProps> = ({
  isOpen,
  onClose,
  bookings,
  lang,
}) => {
  const t = translations[lang];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-2xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150 my-8">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <Ticket className="w-5 h-5 text-slate-800" />
            <h3 className="text-base font-bold text-slate-900">
              {t.nav.myBookings} ({bookings.length})
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-slate-200 text-slate-400 hover:text-slate-700 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 max-h-[500px] overflow-y-auto">
          {bookings.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">
              No confirmed bookings yet. Book hotels and transit passes to see your vouchers here.
            </div>
          ) : (
            bookings.map((booking) => (
              <div
                key={booking.id}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
                      {booking.itemType === 'hotel' ? (
                        <Building2 className="w-5 h-5 text-emerald-700" />
                      ) : (
                        <Ticket className="w-5 h-5 text-indigo-700" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 text-[11px] text-emerald-700 font-semibold mb-0.5">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="uppercase">CONFIRMED &amp; GUARANTEED</span>
                        <span>·</span>
                        <span className="font-mono text-slate-600 font-normal">REF: {booking.bookingCode}</span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 leading-snug">
                        {booking.title}
                      </h4>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {booking.date}
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-base font-bold text-slate-900 font-mono tabular-nums block">
                      ${booking.totalAmount}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      Paid via {booking.paymentMethod}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-200/60 text-xs">
                  <span className="text-[11px] text-slate-500 flex items-center gap-1 font-mono">
                    <QrCode className="w-3.5 h-3.5" />
                    Offline pass active
                  </span>

                  <button
                    onClick={() => alert(`Downloaded offline digital pass ${booking.bookingCode}.pdf`)}
                    className="px-3 py-1 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-lg text-xs font-medium transition-colors flex items-center gap-1"
                  >
                    <Download className="w-3 h-3" />
                    <span>Download Pass</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold"
          >
            {t.common.close}
          </button>
        </div>
      </div>
    </div>
  );
};
