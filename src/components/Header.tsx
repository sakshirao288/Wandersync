import React from 'react';
import { Language } from '../types/travel';
import { translations } from '../utils/translations';
import { 
  Compass, 
  Globe, 
  Ticket, 
  Sun, 
  Share2, 
  MapPin, 
  Building2, 
  Wallet, 
  Landmark, 
  Plane, 
  Sparkles, 
  BookHeart, 
  MessageSquare, 
  Camera, 
  Flame
} from 'lucide-react';

interface HeaderProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  lang: Language;
  onSelectLang: (lang: Language) => void;
  isOffline: boolean;
  onToggleOffline: () => void;
  bookingsCount: number;
  onOpenBookings: () => void;
  onOpenExport: () => void;
  onPlanTripCta: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  lang,
  onSelectLang,
  isOffline,
  onToggleOffline,
  bookingsCount,
  onOpenBookings,
  onOpenExport,
  onPlanTripCta,
}) => {
  const t = translations[lang];

  const navItems = [
    { id: 'itinerary', label: t.nav.itinerary, icon: MapPin },
    { id: 'booking', label: t.nav.booking, icon: Building2 },
    { id: 'budget', label: t.nav.budget, icon: Wallet },
    { id: 'spots', label: t.nav.spots, icon: Landmark },
    { id: 'flights', label: t.nav.flights, icon: Plane },
    { id: 'tools', label: t.nav.tools, icon: Sparkles },
    { id: 'diary', label: t.nav.diary, icon: BookHeart },
    { id: 'chat', label: t.nav.chat, icon: MessageSquare },
    { id: 'gallery', label: t.nav.gallery, icon: Camera },
    { id: 'social', label: t.nav.social, icon: Flame },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Bar Contract: Zone 1 (Wordmark) — Zone 2 (Nav Links) — Zone 3 (Primary Actions) */}
        <div className="flex items-center justify-between gap-4 h-16">
          {/* Zone 1: Single text wordmark */}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onSelectTab('itinerary');
            }}
            className="text-xl font-bold tracking-tight text-slate-900 font-display whitespace-nowrap shrink-0 flex items-center gap-2"
          >
            <Compass className="w-5 h-5 text-amber-600" />
            <span>WanderSync</span>
          </a>

          {/* Zone 2: Concise single-line text navigation links (desktop) */}
          <nav className="hidden 2xl:flex items-center gap-5 text-xs font-semibold text-slate-600">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 pb-1 border-b-2 flex items-center gap-1.5 ${
                  currentTab === item.id ? 'border-slate-900 text-slate-900 font-bold' : 'border-transparent'
                }`}
              >
                <span>{item.label}</span>
              </button>
            ))}
          </nav>

          {/* Zone 3: Primary Action + Quick Utilities & Prominent Language Toggle */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            {/* Live Weather Forecast Snippet */}
            <button
              onClick={() => onSelectTab('tools')}
              className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200/80 rounded-lg text-xs font-medium transition-colors cursor-pointer"
              title="Click to view 5-day weather & activity forecast"
            >
              <Sun className="w-3.5 h-3.5 text-amber-500" />
              <span className="font-mono font-semibold">23°C Rome</span>
            </button>

            {/* Prominent Language Switcher / Toggle */}
            <div 
              className="flex items-center gap-0.5 p-1 bg-slate-100 rounded-lg border border-slate-200 text-xs font-semibold shadow-2xs"
              role="group"
              aria-label="Language selector"
            >
              <Globe className="w-3.5 h-3.5 text-slate-500 ml-1 mr-0.5 shrink-0" />
              <button
                type="button"
                onClick={() => onSelectLang('en')}
                className={`px-2 py-0.5 rounded transition-all font-semibold ${
                  lang === 'en' 
                    ? 'bg-slate-900 text-white shadow-xs' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
                title="English (US/UK)"
                aria-pressed={lang === 'en'}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => onSelectLang('es')}
                className={`px-2 py-0.5 rounded transition-all font-semibold ${
                  lang === 'es' 
                    ? 'bg-slate-900 text-white shadow-xs' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
                title="Español (ES/LATAM)"
                aria-pressed={lang === 'es'}
              >
                ES
              </button>
              <button
                type="button"
                onClick={() => onSelectLang('fr')}
                className={`px-2 py-0.5 rounded transition-all font-semibold ${
                  lang === 'fr' 
                    ? 'bg-slate-900 text-white shadow-xs' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
                title="Français (FR)"
                aria-pressed={lang === 'fr'}
              >
                FR
              </button>
            </div>

            {/* Export Trip Action */}
            <button
              onClick={onOpenExport}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 border border-slate-200"
              title="Export itinerary to calendar (.ICS), PDF, or JSON backup"
            >
              <Share2 className="w-3.5 h-3.5 text-amber-600" />
              <span className="hidden sm:inline">{t.nav.exportTrip}</span>
            </button>

            {/* My Bookings Button */}
            <button
              onClick={onOpenBookings}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 border border-slate-200"
            >
              <Ticket className="w-3.5 h-3.5 text-slate-600" />
              <span>{t.nav.myBookings}</span>
              {bookingsCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-slate-900 text-white text-[10px] flex items-center justify-center font-mono">
                  {bookingsCount}
                </span>
              )}
            </button>

            {/* Primary Action CTA */}
            <button
              onClick={onPlanTripCta}
              className="px-3.5 sm:px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0 shadow-xs"
            >
              Plan Group Tour
            </button>
          </div>
        </div>
      </div>

      {/* Universal Responsive Secondary Tab Strip for All Viewports */}
      <div className="border-t border-slate-200/80 bg-slate-50/90 backdrop-blur-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto py-2 scrollbar-none text-xs">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                    isActive
                      ? 'bg-white text-slate-900 shadow-xs border border-slate-200 font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-600' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                  {item.id === 'flights' && (
                    <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse ml-0.5" />
                  )}
                  {item.id === 'diary' && (
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 ml-0.5" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </header>
  );
};

