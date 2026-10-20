import React, { useState } from 'react';
import { ItineraryDay, Hotel, TransitOption, GroupMember, BookingReceipt, Expense, Language } from '../types/travel';
import { translations } from '../utils/translations';
import { 
  Download, 
  Calendar, 
  Printer, 
  FileJson, 
  Share2, 
  Check, 
  X, 
  ShieldCheck, 
  MapPin, 
  Compass,
  QrCode
} from 'lucide-react';

interface TripExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  tripName: string;
  destination: string;
  days: ItineraryDay[];
  hotels: Hotel[];
  transitOptions: TransitOption[];
  members: GroupMember[];
  bookings: BookingReceipt[];
  expenses: Expense[];
  lang: Language;
}

export const TripExportModal: React.FC<TripExportModalProps> = ({
  isOpen,
  onClose,
  tripName,
  destination,
  days,
  hotels,
  transitOptions,
  members,
  bookings,
  expenses,
  lang,
}) => {
  const t = translations[lang];
  const [copiedLink, setCopiedLink] = useState(false);

  if (!isOpen) return null;

  // 1. Generate & Download real RFC 5545 .ICS Calendar File
  const handleDownloadICS = () => {
    let icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//WanderSync//Tour Planner//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      `X-WR-CALNAME:${tripName}`,
      'X-WR-TIMEZONE:Europe/Rome',
    ];

    days.forEach((day) => {
      day.stops.forEach((stop) => {
        // Parse date and time into YYYYMMDDTHHMMSS
        const dateClean = day.date.replace(/-/g, '');
        const timeParts = stop.startTime.split(':');
        const startHour = timeParts[0] || '09';
        const startMin = timeParts[1] || '00';
        const startFormatted = `${dateClean}T${startHour}${startMin}00`;

        // Calculate end time
        const durationMin = stop.durationMinutes || 60;
        const startTotalMin = parseInt(startHour, 10) * 60 + parseInt(startMin, 10);
        const endTotalMin = startTotalMin + durationMin;
        const endHour = String(Math.floor(endTotalMin / 60)).padStart(2, '0');
        const endMin = String(endTotalMin % 60).padStart(2, '0');
        const endFormatted = `${dateClean}T${endHour}${endMin}00`;

        icsContent.push('BEGIN:VEVENT');
        icsContent.push(`UID:wandersync-${stop.id}@wandersync.com`);
        icsContent.push(`DTSTAMP:${dateClean}T000000Z`);
        icsContent.push(`DTSTART:${startFormatted}`);
        icsContent.push(`DTEND:${endFormatted}`);
        icsContent.push(`SUMMARY:${stop.title}`);
        icsContent.push(`DESCRIPTION:${(stop.notes || stop.title).replace(/\n/g, ' ')}`);
        icsContent.push(`LOCATION:${stop.address}`);
        icsContent.push(`GEO:${stop.coordinates.lat};${stop.coordinates.lng}`);
        icsContent.push('STATUS:CONFIRMED');
        icsContent.push('END:VEVENT');
      });
    });

    icsContent.push('END:VCALENDAR');

    const blob = new Blob([icsContent.join('\r\n')], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${tripName.replace(/\s+/g, '_')}_Itinerary.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // 2. Download Offline JSON Backup
  const handleDownloadJSON = () => {
    const backupData = {
      tripName,
      destination,
      exportDate: new Date().toISOString(),
      travelers: members,
      itineraryDays: days,
      confirmedBookings: bookings,
      expenseLedger: expenses,
    };

    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${tripName.replace(/\s+/g, '_')}_Backup.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // 3. Print / PDF Dossier
  const handlePrintPDF = () => {
    window.print();
  };

  // 4. Copy Public Link
  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-2xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150 my-8">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <Share2 className="w-5 h-5 text-amber-600" />
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {t.export.title}
              </h3>
              <p className="text-xs text-slate-500">
                {tripName} · {destination}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 hover:bg-slate-200 text-slate-400 hover:text-slate-700 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Export Options Grid */}
        <div className="p-6 space-y-4 max-h-[500px] overflow-y-auto">
          {/* 1. Calendar .ICS Export */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-amber-600" />
                <h4 className="text-sm font-bold text-slate-900">
                  {t.export.calendarTitle}
                </h4>
              </div>
              <p className="text-xs text-slate-500 max-w-md">
                {t.export.calendarDesc}
              </p>
            </div>

            <button
              onClick={handleDownloadICS}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 shrink-0 whitespace-nowrap shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{t.export.downloadIcs}</span>
            </button>
          </div>

          {/* 2. Formatted Printable PDF Itinerary */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Printer className="w-4 h-4 text-indigo-600" />
                <h4 className="text-sm font-bold text-slate-900">
                  {t.export.pdfTitle}
                </h4>
              </div>
              <p className="text-xs text-slate-500 max-w-md">
                {t.export.pdfDesc}
              </p>
            </div>

            <button
              onClick={handlePrintPDF}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 shrink-0 whitespace-nowrap shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{t.export.printPdf}</span>
            </button>
          </div>

          {/* 3. JSON Offline Backup */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <FileJson className="w-4 h-4 text-emerald-600" />
                <h4 className="text-sm font-bold text-slate-900">
                  {t.export.jsonTitle}
                </h4>
              </div>
              <p className="text-xs text-slate-500 max-w-md">
                {t.export.jsonDesc}
              </p>
            </div>

            <button
              onClick={handleDownloadJSON}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 shrink-0 whitespace-nowrap"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{t.export.downloadJson}</span>
            </button>
          </div>

          {/* 4. Copy Formatted Text Itinerary */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-amber-600" />
                <h4 className="text-sm font-bold text-slate-900">
                  Copy Formatted Text Itinerary
                </h4>
              </div>
              <p className="text-xs text-slate-500 max-w-md">
                Copy an organized plain-text itinerary for messaging apps, notes, or email updates to your group.
              </p>
            </div>

            <button
              onClick={() => {
                let summary = `✈️ ${tripName}\n📍 Destination: ${destination}\n👥 Travelers: ${members.map(m => m.name).join(', ')}\n\n`;
                days.forEach(day => {
                  summary += `--- Day ${day.dayNumber}: ${day.title} (${day.date}) ---\n`;
                  day.stops.forEach((stop, i) => {
                    summary += `${i + 1}. [${stop.startTime}] ${stop.title} - ${stop.address} (Est. $${stop.costEstimate || 0})\n`;
                  });
                  summary += `\n`;
                });
                if (bookings.length > 0) {
                  summary += `📋 Confirmed Reservations:\n`;
                  bookings.forEach(b => {
                    summary += `• ${b.title} (Code: ${b.bookingCode}) - $${b.totalAmount}\n`;
                  });
                }
                navigator.clipboard.writeText(summary);
                setCopiedLink(true);
                setTimeout(() => setCopiedLink(false), 2000);
              }}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 shrink-0 whitespace-nowrap shadow-xs"
            >
              {copiedLink ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Itinerary Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Copy Text Summary</span>
                </>
              )}
            </button>
          </div>

          {/* 5. Public Shareable Link */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Share2 className="w-4 h-4 text-slate-600" />
                <h4 className="text-sm font-bold text-slate-900">
                  {t.export.shareLinkTitle}
                </h4>
              </div>
              <p className="text-xs text-slate-500 font-mono truncate max-w-xs">
                {window.location.href}
              </p>
            </div>

            <button
              onClick={handleCopyLink}
              className="px-4 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 shrink-0 whitespace-nowrap"
            >
              {copiedLink ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">{t.export.linkCopied}</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5" />
                  <span>{t.export.copyLink}</span>
                </>
              )}
            </button>
          </div>
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
