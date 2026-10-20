import React, { useState } from 'react';
import { Language } from '../types/travel';
import { translations } from '../utils/translations';
import { X, Calendar, MapPin, Users, DollarSign, Sparkles } from 'lucide-react';

interface PlanTripModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartPlan: (plan: {
    tripName: string;
    destination: string;
    startDate: string;
    endDate: string;
    travelersCount: number;
    budget: number;
  }) => void;
  lang: Language;
}

export const PlanTripModal: React.FC<PlanTripModalProps> = ({
  isOpen,
  onClose,
  onStartPlan,
  lang,
}) => {
  const t = translations[lang];

  const [tripName, setTripName] = useState('Rome Mediterranean Odyssey');
  const [destination, setDestination] = useState('Rome, Italy');
  const [startDate, setStartDate] = useState('2026-10-24');
  const [endDate, setEndDate] = useState('2026-10-28');
  const [travelersCount, setTravelersCount] = useState(4);
  const [budget, setBudget] = useState(3200);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onStartPlan({
      tripName: tripName.trim(),
      destination,
      startDate,
      endDate,
      travelersCount,
      budget,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150 my-8">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Plan New Tour in Advance
            </h3>
            <p className="text-xs text-slate-500">
              Set up itinerary timeline, group budget, and synchronized mapping
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-slate-200 text-slate-400 hover:text-slate-700 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div>
            <label className="block font-medium text-slate-700 mb-1">
              Tour / Expedition Name *
            </label>
            <input
              type="text"
              required
              value={tripName}
              onChange={(e) => setTripName(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 text-xs"
            />
          </div>

          <div>
            <label className="block font-medium text-slate-700 mb-1">
              Primary Destination *
            </label>
            <select
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 text-xs bg-white"
            >
              <option value="Rome, Italy">Rome, Italy (Colosseum, Vatican &amp; Trastevere)</option>
              <option value="Kyoto, Japan">Kyoto, Japan (Torii Shrines, Arashiyama &amp; Gion)</option>
              <option value="Barcelona, Spain">Barcelona, Spain (Gaudí Architecture &amp; Gothic Quarter)</option>
              <option value="Paris, France">Paris, France (Louvre, Seine &amp; Montmartre)</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-slate-700 mb-1">
                Departure Date
              </label>
              <input
                type="date"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 text-xs"
              />
            </div>
            <div>
              <label className="block font-medium text-slate-700 mb-1">
                Return Date
              </label>
              <input
                type="date"
                required
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-slate-700 mb-1">
                Travelers Count
              </label>
              <input
                type="number"
                min="1"
                max="20"
                value={travelersCount}
                onChange={(e) => setTravelersCount(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 text-xs font-mono"
              />
            </div>
            <div>
              <label className="block font-medium text-slate-700 mb-1">
                Total Group Budget ($)
              </label>
              <input
                type="number"
                min="100"
                step="100"
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 text-xs font-mono"
              />
            </div>
          </div>

          <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200/70 text-slate-700 flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              WanderSync will initialize collaborative expense tracking, offline vector mapping, and curated culinary guides tailored to your destination.
            </p>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-lg font-medium"
            >
              {t.common.cancel}
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-semibold shadow-xs"
            >
              Create Expedition
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
