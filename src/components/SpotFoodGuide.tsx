import React, { useState } from 'react';
import { SpotGuide, Language } from '../types/travel';
import { translations } from '../utils/translations';
import { 
  Landmark, 
  Utensils, 
  Star, 
  Volume2, 
  VolumeX, 
  MapPin, 
  Clock, 
  Sparkles, 
  Plus, 
  BookOpen, 
  CheckCircle2,
  Compass,
  ArrowRight
} from 'lucide-react';

interface SpotFoodGuideProps {
  spots: SpotGuide[];
  onAddToItinerary: (spot: SpotGuide) => void;
  onNavigateToSpot: (spot: SpotGuide) => void;
  onPlayAudio: (title: string, text: string) => void;
  currentAudioTitle: string | null;
  isPlayingAudio: boolean;
  onStopAudio: () => void;
  lang: Language;
}

export const SpotFoodGuide: React.FC<SpotFoodGuideProps> = ({
  spots,
  onAddToItinerary,
  onNavigateToSpot,
  onPlayAudio,
  currentAudioTitle,
  isPlayingAudio,
  onStopAudio,
  lang,
}) => {
  const t = translations[lang];
  const [filter, setFilter] = useState<'all' | 'food' | 'historic'>('all');
  const [selectedSpot, setSelectedSpot] = useState<SpotGuide>(spots[0]);

  const filteredSpots = spots.filter((s) => {
    if (filter === 'all') return true;
    if (filter === 'food') return s.category === 'food';
    if (filter === 'historic') return s.category === 'historic' || s.category === 'culture';
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight font-display">
              {t.spots.title}
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              {t.spots.subtitle}
            </p>
          </div>

          {/* Segmented Filter */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg shrink-0">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 ${
                filter === 'all'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t.spots.allCategory}
            </button>
            <button
              onClick={() => setFilter('historic')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                filter === 'historic'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Landmark className="w-3.5 h-3.5 text-indigo-600" />
              <span>{t.spots.historicCategory}</span>
            </button>
            <button
              onClick={() => setFilter('food')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                filter === 'food'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Utensils className="w-3.5 h-3.5 text-rose-600" />
              <span>{t.spots.foodCategory}</span>
            </button>
          </div>
        </div>

        {/* Global Audio Controller if playing */}
        {isPlayingAudio && currentAudioTitle && (
          <div className="mt-4 p-3 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-between text-xs text-amber-900 animate-in fade-in">
            <div className="flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-amber-600 animate-pulse shrink-0" />
              <span>
                <strong>{t.common.playing}</strong> {currentAudioTitle}
              </span>
            </div>
            <button
              onClick={onStopAudio}
              className="px-2.5 py-1 bg-amber-200 hover:bg-amber-300 rounded font-semibold text-[11px] text-amber-900 transition-colors flex items-center gap-1"
            >
              <VolumeX className="w-3.5 h-3.5" />
              <span>{t.common.stopAudio}</span>
            </button>
          </div>
        )}
      </div>

      {/* Two Column Layout: Cards list & Selected Spot Deep Dive */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Spot Cards (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          {filteredSpots.map((spot) => {
            const isSelected = selectedSpot?.id === spot.id;
            return (
              <div
                key={spot.id}
                onClick={() => setSelectedSpot(spot)}
                className={`bg-white rounded-xl border p-4 transition-all cursor-pointer shadow-xs ${
                  isSelected
                    ? 'border-slate-900 ring-2 ring-slate-200'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex gap-3">
                  <div className="w-20 h-20 rounded-lg overflow-hidden shrink-0 bg-slate-100">
                    <img
                      src={spot.imageUrl}
                      alt={spot.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between text-xs text-slate-500 mb-0.5">
                      <span className="capitalize font-semibold text-slate-700">
                        {spot.category === 'historic' ? 'Heritage Monument' : 'Gastronomic Spot'}
                      </span>
                      <span className="font-mono text-amber-600 font-semibold">
                        ★ {spot.rating}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-slate-900 truncate">
                      {spot.name}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2 mt-0.5">
                      {spot.shortDesc}
                    </p>

                    <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2 pt-2 border-t border-slate-100">
                      <span>{spot.priceLevel} · {spot.city}</span>
                      <span className="text-slate-900 font-medium">Explore History →</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Deep Architectural, Cultural & Culinary Guide (7 cols) */}
        <div className="lg:col-span-7">
          {selectedSpot && (
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-5">
              {/* Spot Hero Image & Quick Actions */}
              <div className="relative h-56 rounded-xl overflow-hidden bg-slate-100">
                <img
                  src={selectedSpot.imageUrl}
                  alt={selectedSpot.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-5 text-white">
                  <div className="flex items-center gap-2 text-xs text-amber-300 font-medium mb-1">
                    <span>{selectedSpot.city}</span>
                    <span>·</span>
                    <span>{selectedSpot.category.toUpperCase()}</span>
                    <span>·</span>
                    <span>★ {selectedSpot.rating} ({selectedSpot.reviewsCount} reviews)</span>
                  </div>
                  <h3 className="text-xl font-bold font-display leading-tight">
                    {selectedSpot.name}
                  </h3>
                  <p className="text-xs text-slate-300 mt-1 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>{selectedSpot.address}</span>
                  </p>
                </div>
              </div>

              {/* Action Toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onPlayAudio(selectedSpot.name, selectedSpot.audioNarrationText || selectedSpot.historyContent)}
                    className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-xs"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>{t.spots.listenAudio}</span>
                  </button>

                  <button
                    onClick={() => onNavigateToSpot(selectedSpot)}
                    className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-xs"
                  >
                    <Compass className="w-3.5 h-3.5" />
                    <span>{t.common.navigateHere}</span>
                  </button>
                </div>

                <button
                  onClick={() => onAddToItinerary(selectedSpot)}
                  className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-100 text-slate-800 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{t.common.addToItinerary}</span>
                </button>
              </div>

              {/* History & Cultural Significance */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-700 flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4" />
                  <span>Historical & Cultural Origins</span>
                </h4>
                <p className="text-xs text-slate-700 leading-relaxed bg-slate-50/70 p-3 rounded-lg border border-slate-100">
                  {selectedSpot.historyContent}
                </p>
              </div>

              {/* Architectural Significance */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                  <Landmark className="w-4 h-4 text-slate-600" />
                  <span>{t.spots.architecturalHeritage}</span>
                </h4>
                <p className="text-xs text-slate-700 leading-relaxed bg-slate-50/70 p-3 rounded-lg border border-slate-100">
                  {selectedSpot.architecturalSignificance}
                </p>
              </div>

              {/* Signature items if food */}
              {selectedSpot.signatureItems && selectedSpot.signatureItems.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-rose-700 flex items-center gap-1.5">
                    <Utensils className="w-4 h-4" />
                    <span>{t.spots.signatureCuisine}</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {selectedSpot.signatureItems.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded-lg border border-rose-100 bg-rose-50/40 text-xs font-medium text-slate-800 flex items-center gap-2"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Curated Local Tips by Experts */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <span>{t.spots.insiderNotes}</span>
                </h4>
                <div className="space-y-2">
                  {selectedSpot.insiderTips.map((tip, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-lg border border-emerald-100 bg-emerald-50/30 text-xs text-slate-700 flex items-start gap-2"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{tip}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Operating hours */}
              <div className="flex items-center gap-2 text-xs text-slate-500 pt-2 border-t border-slate-100">
                <Clock className="w-4 h-4 text-slate-400" />
                <span className="font-semibold text-slate-700">{t.spots.openHours}:</span>
                <span>{selectedSpot.openingHours}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
