import React, { useState } from 'react';
import { PackingItem, GroupMember, Language } from '../types/travel';
import { translations } from '../utils/translations';
import { SmartPacking } from './SmartPacking';
import { CurrencyConverter } from './CurrencyConverter';
import { WeatherForecastView } from './WeatherForecastView';
import { Luggage, Coins, Sun } from 'lucide-react';

interface ExpeditionToolsHubProps {
  packingItems: PackingItem[];
  members: GroupMember[];
  onTogglePacked: (itemId: string) => void;
  onAddPackingItem: (item: Omit<PackingItem, 'id'>) => void;
  onDeletePackingItem: (itemId: string) => void;
  onAssignPackingItem: (itemId: string, memberId: string | undefined) => void;
  lang: Language;
  initialSubTab?: 'packing' | 'converter' | 'weather';
}

export const ExpeditionToolsHub: React.FC<ExpeditionToolsHubProps> = ({
  packingItems,
  members,
  onTogglePacked,
  onAddPackingItem,
  onDeletePackingItem,
  onAssignPackingItem,
  lang,
  initialSubTab = 'packing',
}) => {
  const t = translations[lang];
  const [activeSubTab, setActiveSubTab] = useState<'packing' | 'converter' | 'weather'>(initialSubTab);

  return (
    <div className="space-y-6">
      {/* Sub-navigation Segmented Control Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-2 shadow-xs flex items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
          <button
            onClick={() => setActiveSubTab('packing')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-2 ${
              activeSubTab === 'packing'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Luggage className="w-4 h-4 text-amber-500" />
            <span>{t.tools.packingTab}</span>
          </button>

          <button
            onClick={() => setActiveSubTab('converter')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-2 ${
              activeSubTab === 'converter'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Coins className="w-4 h-4 text-emerald-500" />
            <span>{t.tools.converterTab}</span>
          </button>

          <button
            onClick={() => setActiveSubTab('weather')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-2 ${
              activeSubTab === 'weather'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Sun className="w-4 h-4 text-amber-500" />
            <span>{t.tools.weatherTab}</span>
          </button>
        </div>

        <div className="hidden md:flex items-center gap-2 text-xs text-slate-500 pr-3">
          <span>Rome, Italy</span>
          <span>·</span>
          <span>Live Field Hub</span>
        </div>
      </div>

      {/* Render Active Tool */}
      {activeSubTab === 'packing' && (
        <SmartPacking
          items={packingItems}
          members={members}
          onTogglePacked={onTogglePacked}
          onAddItem={onAddPackingItem}
          onDeleteItem={onDeletePackingItem}
          onAssignItem={onAssignPackingItem}
          lang={lang}
        />
      )}

      {activeSubTab === 'converter' && (
        <CurrencyConverter lang={lang} />
      )}

      {activeSubTab === 'weather' && (
        <WeatherForecastView
          onGoToPacking={() => setActiveSubTab('packing')}
          lang={lang}
        />
      )}
    </div>
  );
};
