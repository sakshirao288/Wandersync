import React, { useState } from 'react';
import { ItineraryDay, ItineraryStop, ActivityCategory, Language } from '../types/travel';
import { translations } from '../utils/translations';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Plus, 
  Trash2, 
  ChevronUp, 
  ChevronDown, 
  Volume2, 
  Landmark, 
  Utensils, 
  Compass, 
  Train, 
  Bed, 
  Sparkles,
  DollarSign
} from 'lucide-react';

interface ItineraryPlannerProps {
  days: ItineraryDay[];
  currentDayIndex: number;
  onSelectDay: (index: number) => void;
  onAddDay: () => void;
  onAddStop: (dayIndex: number, stop: Omit<ItineraryStop, 'id'>) => void;
  onDeleteStop: (dayIndex: number, stopId: string) => void;
  onMoveStop: (dayIndex: number, stopIndex: number, direction: 'up' | 'down') => void;
  selectedStopId: string | null;
  onSelectStop: (stop: ItineraryStop) => void;
  onPlayAudio: (title: string, text: string) => void;
  lang: Language;
}

export const ItineraryPlanner: React.FC<ItineraryPlannerProps> = ({
  days,
  currentDayIndex,
  onSelectDay,
  onAddDay,
  onAddStop,
  onDeleteStop,
  onMoveStop,
  selectedStopId,
  onSelectStop,
  onPlayAudio,
  lang,
}) => {
  const t = translations[lang];
  const currentDay = days[currentDayIndex] || days[0];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<ActivityCategory>('sightseeing');
  const [newStartTime, setNewStartTime] = useState('10:00');
  const [newDuration, setNewDuration] = useState(60);
  const [newAddress, setNewAddress] = useState('');
  const [newNotes, setNewNotes] = useState('');
  const [newCost, setNewCost] = useState(0);

  const getCategoryIcon = (category: ActivityCategory) => {
    switch (category) {
      case 'historic':
        return <Landmark className="w-4 h-4 text-indigo-600" />;
      case 'dining':
        return <Utensils className="w-4 h-4 text-rose-600" />;
      case 'transport':
        return <Train className="w-4 h-4 text-emerald-600" />;
      case 'hotel':
        return <Bed className="w-4 h-4 text-amber-600" />;
      case 'activity':
      case 'sightseeing':
      default:
        return <Compass className="w-4 h-4 text-sky-600" />;
    }
  };

  const handleCreateStop = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    // Use current day's approximate center or offset coordinates
    const baseLat = currentDay.stops.length > 0 
      ? currentDay.stops[currentDay.stops.length - 1].coordinates.lat + (Math.random() * 0.004 - 0.002)
      : 41.8986;
    const baseLng = currentDay.stops.length > 0
      ? currentDay.stops[currentDay.stops.length - 1].coordinates.lng + (Math.random() * 0.004 - 0.002)
      : 12.4769;

    onAddStop(currentDayIndex, {
      title: newTitle.trim(),
      category: newCategory,
      startTime: newStartTime,
      durationMinutes: Number(newDuration),
      coordinates: { lat: baseLat, lng: baseLng },
      address: newAddress.trim() || 'Central Rome',
      notes: newNotes.trim(),
      costEstimate: Number(newCost),
    });

    setNewTitle('');
    setNewAddress('');
    setNewNotes('');
    setNewCost(0);
    setIsModalOpen(false);
  };

  const totalCost = currentDay ? currentDay.stops.reduce((sum, s) => sum + s.costEstimate, 0) : 0;
  const totalMinutes = currentDay ? currentDay.stops.reduce((sum, s) => sum + s.durationMinutes, 0) : 0;
  const hours = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-col h-full">
      {/* Header & Day Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-1">
            <Calendar className="w-4 h-4 text-amber-600" />
            <span>Rome, Italy · {days.length} Days Planned</span>
            <span>·</span>
            <span>4 Travelers</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            {currentDay?.title || t.itinerary.title}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">{currentDay?.summary}</p>
        </div>

        {/* Action button */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-medium transition-colors shrink-0 whitespace-nowrap shadow-xs"
        >
          <Plus className="w-4 h-4" />
          {t.itinerary.addStop}
        </button>
      </div>

      {/* Day Tabs Strip */}
      <div className="flex items-center gap-2 pt-3 pb-2 overflow-x-auto">
        {days.map((day, idx) => (
          <button
            key={day.dayNumber}
            onClick={() => onSelectDay(idx)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-2 ${
              currentDayIndex === idx
                ? 'bg-amber-600 text-white shadow-xs font-semibold'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <span>{t.common.day} {day.dayNumber}</span>
            <span className="text-[11px] opacity-80 font-mono">({day.stops.length})</span>
          </button>
        ))}
        <button
          onClick={onAddDay}
          className="px-2.5 py-1.5 text-xs font-medium text-slate-600 bg-slate-50 hover:bg-slate-100 border border-dashed border-slate-300 rounded-lg whitespace-nowrap shrink-0 flex items-center gap-1"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Day</span>
        </button>
      </div>

      {/* Day Quick Metrics (No pills, clean typographic counters) */}
      <div className="flex items-center justify-between text-xs py-2 px-3 bg-slate-50 rounded-lg text-slate-600 my-3 border border-slate-100 font-mono tabular-nums">
        <span className="flex items-center gap-1">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          {t.itinerary.totalDayDuration}: <strong className="text-slate-900">{hours}h {mins}m</strong>
        </span>
        <span className="flex items-center gap-1">
          <DollarSign className="w-3.5 h-3.5 text-slate-400" />
          {t.itinerary.totalDayCost}: <strong className="text-slate-900">${totalCost}</strong>
        </span>
        <span className="text-slate-500 font-sans text-[11px]">
          {currentDay?.stops.length} Planned Stops
        </span>
      </div>

      {/* Timeline Stops List */}
      <div className="flex-1 overflow-y-auto pr-1 space-y-3 mt-1">
        {(!currentDay || currentDay.stops.length === 0) ? (
          <div className="p-8 text-center text-slate-400 text-xs border border-dashed border-slate-200 rounded-xl">
            {t.itinerary.emptyStops}
          </div>
        ) : (
          currentDay.stops.map((stop, sIndex) => {
            const isSelected = selectedStopId === stop.id;
            return (
              <div
                key={stop.id}
                onClick={() => onSelectStop(stop)}
                className={`relative group p-3.5 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'border-amber-500 bg-amber-50/40 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  {/* Left: Index badge + time */}
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className="flex flex-col items-center">
                      <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-800 font-bold text-xs flex items-center justify-center font-mono">
                        {sIndex + 1}
                      </div>
                      {sIndex < currentDay.stops.length - 1 && (
                        <div className="w-0.5 h-8 bg-slate-200 my-1" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      {/* Meta header (clean text with separators) */}
                      <div className="flex items-center gap-2 text-xs text-slate-500 mb-0.5">
                        <span className="font-mono font-medium text-slate-700">{stop.startTime}</span>
                        <span>·</span>
                        <span className="flex items-center gap-1">
                          {getCategoryIcon(stop.category)}
                          <span className="capitalize">{stop.category}</span>
                        </span>
                        <span>·</span>
                        <span>{stop.durationMinutes} mins</span>
                      </div>

                      <h3 className="text-sm font-bold text-slate-900 truncate">
                        {stop.title}
                      </h3>
                      <p className="text-xs text-slate-500 truncate mt-0.5">
                        {stop.address}
                      </p>

                      {stop.notes && (
                        <p className="text-xs text-slate-600 mt-2 bg-slate-50 p-2 rounded-md border border-slate-100 italic">
                          {stop.notes}
                        </p>
                      )}

                      {/* Bottom action row */}
                      <div className="flex items-center justify-between text-xs pt-2 mt-2 border-t border-slate-100">
                        <span className="font-mono font-medium text-slate-700 tabular-nums">
                          {stop.costEstimate > 0 ? `$${stop.costEstimate} / person` : 'Free entry'}
                        </span>

                        <div className="flex items-center gap-2">
                          {stop.audioGuideText && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onPlayAudio(stop.audioGuideTitle || stop.title, stop.audioGuideText!);
                              }}
                              className="inline-flex items-center gap-1 text-amber-700 hover:text-amber-900 font-medium text-xs px-2 py-0.5 rounded hover:bg-amber-100/50 transition-colors"
                            >
                              <Volume2 className="w-3.5 h-3.5" />
                              <span>{t.common.audioGuide}</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Reorder & Delete controls */}
                  <div className="flex flex-col items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => onMoveStop(currentDayIndex, sIndex, 'up')}
                      disabled={sIndex === 0}
                      className="p-1 hover:bg-slate-100 rounded text-slate-500 disabled:opacity-20"
                      title="Move up"
                    >
                      <ChevronUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onMoveStop(currentDayIndex, sIndex, 'down')}
                      disabled={sIndex === currentDay.stops.length - 1}
                      className="p-1 hover:bg-slate-100 rounded text-slate-500 disabled:opacity-20"
                      title="Move down"
                    >
                      <ChevronDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDeleteStop(currentDayIndex, stop.id)}
                      className="p-1 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded transition-colors"
                      title="Remove stop"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal: Add Itinerary Activity */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 max-w-md w-full p-6 animate-in fade-in zoom-in-95 duration-150">
            <h3 className="text-lg font-bold text-slate-900 mb-1">
              {t.itinerary.newStopTitle}
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Add a landmark, meal, transit, or custom activity to Day {currentDay?.dayNumber}
            </p>

            <form onSubmit={handleCreateStop} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  {t.itinerary.stopName} *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Roman Forum & Sunset Belvedere"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    {t.itinerary.category}
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as ActivityCategory)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 text-xs bg-white"
                  >
                    <option value="sightseeing">Sightseeing</option>
                    <option value="historic">Historic Monument</option>
                    <option value="dining">Food & Dining</option>
                    <option value="transport">Local Transit</option>
                    <option value="activity">Experience</option>
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    {t.itinerary.time}
                  </label>
                  <input
                    type="time"
                    value={newStartTime}
                    onChange={(e) => setNewStartTime(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    {t.itinerary.duration}
                  </label>
                  <input
                    type="number"
                    min="15"
                    step="15"
                    value={newDuration}
                    onChange={(e) => setNewDuration(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    {t.itinerary.cost}
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={newCost}
                    onChange={(e) => setNewCost(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Address / Meeting Point
                </label>
                <input
                  type="text"
                  placeholder="e.g. Piazza Navona 14, Roma"
                  value={newAddress}
                  onChange={(e) => setNewAddress(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 text-xs"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  {t.itinerary.notes}
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Bring water bottle, skip-the-line reservation ID #9981"
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 text-xs resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-lg font-medium"
                >
                  {t.common.cancel}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-medium shadow-xs"
                >
                  {t.common.add}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
