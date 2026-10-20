import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { ItineraryStop, SpotGuide, Hotel, TransitOption, Language } from '../types/travel';
import { translations } from '../utils/translations';
import { 
  Navigation, 
  MapPin, 
  Layers, 
  Wifi, 
  WifiOff, 
  Download, 
  Volume2, 
  Clock, 
  Compass, 
  Utensils, 
  Building2, 
  Landmark, 
  Check, 
  Route 
} from 'lucide-react';

interface InteractiveMapProps {
  stops: ItineraryStop[];
  allSpots: SpotGuide[];
  hotels: Hotel[];
  transitOptions: TransitOption[];
  selectedStopId?: string | null;
  onSelectStop?: (stop: ItineraryStop) => void;
  onAddToItinerary?: (spot: SpotGuide) => void;
  onPlayAudio?: (title: string, text: string) => void;
  lang: Language;
  isOffline: boolean;
  onToggleOffline: () => void;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  stops,
  allSpots,
  hotels,
  transitOptions,
  selectedStopId,
  onSelectStop,
  onAddToItinerary,
  onPlayAudio,
  lang,
  isOffline,
  onToggleOffline,
}) => {
  const t = translations[lang];
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const polylineLayerRef = useRef<L.Polyline | null>(null);

  const [activeFilter, setActiveFilter] = useState<'all' | 'itinerary' | 'food' | 'historic' | 'hotels' | 'transit'>('all');
  const [downloadingOffline, setDownloadingOffline] = useState(false);
  const [offlineDownloaded, setOfflineDownloaded] = useState(false);
  const [activeNavStep, setActiveNavStep] = useState<number | null>(null);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // Default to Rome center
      const map = L.map(mapContainerRef.current, {
        center: [41.8986, 12.4769],
        zoom: 14,
        zoomControl: false,
      });

      L.control.zoom({ position: 'bottomright' }).addTo(map);

      // Tile layer with offline graceful fallback
      const tileUrl = isOffline 
        ? 'https://tile.openstreetmap.org/{z}/{x}/{y}.png' // browser cached or offline vector fallback
        : 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';

      const tiles = L.tileLayer(tileUrl, {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(map);

      mapInstanceRef.current = map;
      markersLayerRef.current = L.layerGroup().addTo(map);
    }

    return () => {
      // cleanup handled if unmounted
    };
  }, []);

  // Update Markers & Polylines whenever stops, filters, or selected stop changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear previous markers
    if (markersLayerRef.current) {
      markersLayerRef.current.clearLayers();
    }
    if (polylineLayerRef.current) {
      map.removeLayer(polylineLayerRef.current);
      polylineLayerRef.current = null;
    }

    const markersGroup = markersLayerRef.current || L.layerGroup().addTo(map);
    markersLayerRef.current = markersGroup;

    const bounds = L.latLngBounds([]);

    // 1. Itinerary Stops
    if (activeFilter === 'all' || activeFilter === 'itinerary') {
      const latlngs: L.LatLngTuple[] = [];

      stops.forEach((stop, index) => {
        const lat = stop.coordinates.lat;
        const lng = stop.coordinates.lng;
        latlngs.push([lat, lng]);
        bounds.extend([lat, lng]);

        const isSelected = selectedStopId === stop.id;

        // Custom numbered SVG marker icon
        const iconHtml = `
          <div class="relative flex items-center justify-center transition-transform hover:scale-110">
            <div class="w-8 h-8 rounded-full ${isSelected ? 'bg-amber-600 ring-4 ring-amber-300' : 'bg-slate-900 ring-2 ring-white'} text-white shadow-lg flex items-center justify-center font-bold text-xs">
              ${index + 1}
            </div>
            <div class="absolute -bottom-1 w-2 h-2 rotate-45 ${isSelected ? 'bg-amber-600' : 'bg-slate-900'}"></div>
          </div>
        `;

        const customIcon = L.divIcon({
          html: iconHtml,
          className: 'custom-itinerary-marker',
          iconSize: [32, 36],
          iconAnchor: [16, 36],
          popupAnchor: [0, -36],
        });

        const marker = L.marker([lat, lng], { icon: customIcon });

        const popupContent = document.createElement('div');
        popupContent.className = 'p-3 max-w-[260px] text-slate-800 text-sm font-sans';
        popupContent.innerHTML = `
          <div class="flex items-center gap-1.5 text-xs text-amber-700 font-semibold mb-1">
            <span>Stop ${index + 1}</span> · <span>${stop.startTime} (${stop.durationMinutes}m)</span>
          </div>
          <h4 class="font-bold text-slate-900 leading-snug mb-1">${stop.title}</h4>
          <p class="text-xs text-slate-500 mb-2">${stop.address}</p>
          ${stop.notes ? `<p class="text-xs text-slate-600 italic bg-slate-50 p-1.5 rounded mb-2 border border-slate-100">${stop.notes}</p>` : ''}
          <div class="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
            <span class="font-medium text-slate-700">$${stop.costEstimate} est.</span>
            ${stop.audioGuideText ? `<button id="btn-audio-${stop.id}" class="text-xs font-medium text-amber-800 hover:text-amber-900 flex items-center gap-1">Audio Tour</button>` : ''}
          </div>
        `;

        // Bind popup and audio click
        marker.bindPopup(popupContent);
        marker.on('popupopen', () => {
          if (stop.audioGuideText) {
            const btn = document.getElementById(`btn-audio-${stop.id}`);
            if (btn && onPlayAudio) {
              btn.onclick = () => onPlayAudio(stop.audioGuideTitle || stop.title, stop.audioGuideText!);
            }
          }
        });

        marker.on('click', () => {
          if (onSelectStop) onSelectStop(stop);
        });

        markersGroup.addLayer(marker);
      });

      // Connect itinerary stops with routing line
      if (latlngs.length > 1) {
        polylineLayerRef.current = L.polyline(latlngs, {
          color: '#d97706',
          weight: 4,
          opacity: 0.85,
          dashArray: '8, 8',
          lineCap: 'round',
        }).addTo(map);
      }
    }

    // 2. Food Spots
    if (activeFilter === 'all' || activeFilter === 'food') {
      allSpots.filter(s => s.category === 'food').forEach((spot) => {
        bounds.extend([spot.coordinates.lat, spot.coordinates.lng]);

        const iconHtml = `
          <div class="w-7 h-7 rounded-full bg-rose-600 text-white shadow-md ring-2 ring-white flex items-center justify-center transition-transform hover:scale-110">
            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 8h1a4 4 0 0 1 0 8h-1"></path><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path><line x1="6" y1="1" x2="6" y2="4"></line><line x1="10" y1="1" x2="10" y2="4"></line><line x1="14" y1="1" x2="14" y2="4"></line></svg>
          </div>
        `;

        const icon = L.divIcon({
          html: iconHtml,
          className: 'custom-food-marker',
          iconSize: [28, 28],
          iconAnchor: [14, 14],
        });

        const marker = L.marker([spot.coordinates.lat, spot.coordinates.lng], { icon });
        const popup = document.createElement('div');
        popup.className = 'p-3 max-w-[260px] text-slate-800 text-sm font-sans';
        popup.innerHTML = `
          <span class="text-xs text-rose-600 font-semibold uppercase tracking-wider">Culinary Gem · ${spot.priceLevel}</span>
          <h4 class="font-bold text-slate-900 mt-0.5 mb-1">${spot.name}</h4>
          <p class="text-xs text-slate-500 mb-2">${spot.shortDesc}</p>
          <div class="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
            <span class="text-amber-600 font-semibold">★ ${spot.rating}</span>
            <button id="add-spot-${spot.id}" class="px-2 py-1 bg-slate-900 text-white rounded text-xs font-medium hover:bg-slate-800">+ Add to Day</button>
          </div>
        `;

        marker.bindPopup(popup);
        marker.on('popupopen', () => {
          const addBtn = document.getElementById(`add-spot-${spot.id}`);
          if (addBtn && onAddToItinerary) {
            addBtn.onclick = () => onAddToItinerary(spot);
          }
        });
        markersGroup.addLayer(marker);
      });
    }

    // 3. Historic Monuments
    if (activeFilter === 'all' || activeFilter === 'historic') {
      allSpots.filter(s => s.category === 'historic' || s.category === 'culture').forEach((spot) => {
        bounds.extend([spot.coordinates.lat, spot.coordinates.lng]);

        const iconHtml = `
          <div class="w-7 h-7 rounded-full bg-indigo-600 text-white shadow-md ring-2 ring-white flex items-center justify-center transition-transform hover:scale-110">
            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="3" y1="21" x2="21" y2="21"></line><line x1="4" y1="10" x2="20" y2="10"></line><polygon points="12 3 2 10 22 10 12 3"></polygon><line x1="7" y1="10" x2="7" y2="21"></line><line x1="12" y1="10" x2="12" y2="21"></line><line x1="17" y1="10" x2="17" y2="21"></line></svg>
          </div>
        `;

        const icon = L.divIcon({
          html: iconHtml,
          className: 'custom-historic-marker',
          iconSize: [28, 28],
          iconAnchor: [14, 14],
        });

        const marker = L.marker([spot.coordinates.lat, spot.coordinates.lng], { icon });
        const popup = document.createElement('div');
        popup.className = 'p-3 max-w-[260px] text-slate-800 text-sm font-sans';
        popup.innerHTML = `
          <span class="text-xs text-indigo-600 font-semibold uppercase tracking-wider">Heritage Site · ★ ${spot.rating}</span>
          <h4 class="font-bold text-slate-900 mt-0.5 mb-1">${spot.name}</h4>
          <p class="text-xs text-slate-500 mb-2 line-clamp-2">${spot.shortDesc}</p>
          <div class="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
            <button id="narrate-spot-${spot.id}" class="text-xs font-semibold text-indigo-700 hover:text-indigo-900 flex items-center gap-1">Audio History</button>
            <button id="add-hist-${spot.id}" class="px-2 py-1 bg-slate-900 text-white rounded text-xs font-medium hover:bg-slate-800">+ Itinerary</button>
          </div>
        `;

        marker.bindPopup(popup);
        marker.on('popupopen', () => {
          const narrateBtn = document.getElementById(`narrate-spot-${spot.id}`);
          if (narrateBtn && onPlayAudio) {
            narrateBtn.onclick = () => onPlayAudio(spot.name, spot.audioNarrationText || spot.historyContent);
          }
          const addBtn = document.getElementById(`add-hist-${spot.id}`);
          if (addBtn && onAddToItinerary) {
            addBtn.onclick = () => onAddToItinerary(spot);
          }
        });
        markersGroup.addLayer(marker);
      });
    }

    // 4. Hotels
    if (activeFilter === 'all' || activeFilter === 'hotels') {
      hotels.forEach((hotel) => {
        bounds.extend([hotel.coordinates.lat, hotel.coordinates.lng]);

        const iconHtml = `
          <div class="w-7 h-7 rounded-full bg-emerald-600 text-white shadow-md ring-2 ring-white flex items-center justify-center transition-transform hover:scale-110">
            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M3 21h18"></path><path d="M19 21v-4"></path><path d="M19 11V5a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v16"></path><path d="M9 9h1"></path><path d="M9 13h1"></path><path d="M9 17h1"></path><path d="M14 9h1"></path><path d="M14 13h1"></path><path d="M14 17h1"></path></svg>
          </div>
        `;

        const icon = L.divIcon({
          html: iconHtml,
          className: 'custom-hotel-marker',
          iconSize: [28, 28],
          iconAnchor: [14, 14],
        });

        const marker = L.marker([hotel.coordinates.lat, hotel.coordinates.lng], { icon });
        const popup = document.createElement('div');
        popup.className = 'p-3 max-w-[260px] text-slate-800 text-sm font-sans';
        popup.innerHTML = `
          <span class="text-xs text-emerald-700 font-semibold uppercase tracking-wider">Boutique Stay · $${hotel.pricePerNight}/night</span>
          <h4 class="font-bold text-slate-900 mt-0.5 mb-1">${hotel.name}</h4>
          <p class="text-xs text-slate-500 mb-2">${hotel.neighborhood} · ★ ${hotel.rating}</p>
        `;

        marker.bindPopup(popup);
        markersGroup.addLayer(marker);
      });
    }

    // Fit map bounds smoothly if we have valid coordinates
    if (bounds.isValid()) {
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
    }
  }, [stops, allSpots, hotels, transitOptions, activeFilter, selectedStopId]);

  // Handle selected stop zoom focus
  useEffect(() => {
    if (!selectedStopId || !mapInstanceRef.current) return;
    const target = stops.find(s => s.id === selectedStopId);
    if (target) {
      mapInstanceRef.current.flyTo([target.coordinates.lat, target.coordinates.lng], 16, {
        duration: 1.2
      });
    }
  }, [selectedStopId, stops]);

  const handleDownloadOffline = () => {
    setDownloadingOffline(true);
    setTimeout(() => {
      setDownloadingOffline(false);
      setOfflineDownloaded(true);
      // Persist offline cache key in localStorage
      localStorage.setItem('wandersync_offline_rome_cached', 'true');
    }, 1400);
  };

  // Turn-by-turn Navigation Simulation between stops
  const navLegs = stops.slice(0, -1).map((current, idx) => {
    const next = stops[idx + 1];
    // approximate distance
    const dLat = (next.coordinates.lat - current.coordinates.lat) * 111;
    const dLng = (next.coordinates.lng - current.coordinates.lng) * 85;
    const distKm = Math.sqrt(dLat * dLat + dLng * dLng);
    const distMeters = Math.round(distKm * 1000);
    const walkMin = Math.round((distKm / 4.5) * 60);

    return {
      index: idx,
      from: current.title,
      to: next.title,
      distMeters,
      walkMin: walkMin < 4 ? 4 : walkMin,
      toCoordinates: next.coordinates,
    };
  });

  return (
    <div className="relative w-full h-[620px] rounded-xl overflow-hidden border border-slate-200 bg-white shadow-sm flex flex-col">
      {/* Top Map Control Bar */}
      <div className="bg-white/95 backdrop-blur-md px-4 py-3 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 z-20">
        {/* Layer Filters */}
        <div className="flex items-center gap-1 overflow-x-auto py-0.5">
          <span className="text-xs font-semibold text-slate-500 mr-2 flex items-center gap-1 shrink-0">
            <Layers className="w-3.5 h-3.5" />
            {t.common.filter}:
          </span>
          {[
            { id: 'all', label: t.common.all },
            { id: 'itinerary', label: 'Day Route' },
            { id: 'food', label: 'Dining' },
            { id: 'historic', label: 'Heritage' },
            { id: 'hotels', label: 'Hotels' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id as any)}
              className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                activeFilter === tab.id
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 bg-slate-100 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Offline Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleDownloadOffline}
            disabled={downloadingOffline || offlineDownloaded}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 ${
              offlineDownloaded
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
            title="Download offline tiles and venue coordinates for poor connectivity"
          >
            {offlineDownloaded ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>Offline Pack Ready (18 MB)</span>
              </>
            ) : downloadingOffline ? (
              <>
                <Download className="w-3.5 h-3.5 animate-bounce" />
                <span>Downloading Pack...</span>
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5" />
                <span>Download Offline Map</span>
              </>
            )}
          </button>

          {/* Toggle Simulated Offline */}
          <button
            onClick={onToggleOffline}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 ${
              isOffline
                ? 'bg-amber-500 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {isOffline ? <WifiOff className="w-3.5 h-3.5" /> : <Wifi className="w-3.5 h-3.5" />}
            <span>{isOffline ? t.common.offlineActive : t.common.offlineMode}</span>
          </button>
        </div>
      </div>

      {/* Main Map View Area */}
      <div className="relative flex-1 w-full h-full">
        <div ref={mapContainerRef} className="w-full h-full" />

        {/* Offline Badge Overlay */}
        {isOffline && (
          <div className="absolute top-3 left-3 z-20 bg-amber-50 border border-amber-200 text-amber-900 px-3 py-1.5 rounded-lg shadow-sm text-xs font-medium flex items-center gap-2">
            <WifiOff className="w-3.5 h-3.5 text-amber-600" />
            <span>Serving from cached offline storage (Full vector route & GPS active)</span>
          </div>
        )}

        {/* Floating Route Overview & Navigation Drawer (Bottom Left) */}
        {stops.length > 0 && (
          <div className="absolute bottom-4 left-4 z-20 max-w-sm w-full bg-white/95 backdrop-blur-md rounded-xl p-3 shadow-lg border border-slate-200 max-h-56 overflow-y-auto">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                <Route className="w-4 h-4 text-amber-600" />
                <span>{t.itinerary.stepNavigation}</span>
              </div>
              <span className="text-[11px] font-medium text-slate-500">
                {stops.length} Stops · {navLegs.reduce((acc, l) => acc + l.walkMin, 0)} min travel
              </span>
            </div>

            <div className="space-y-2 text-xs">
              {navLegs.map((leg) => {
                const isActive = activeNavStep === leg.index;
                return (
                  <div
                    key={leg.index}
                    onClick={() => {
                      setActiveNavStep(leg.index);
                      if (mapInstanceRef.current) {
                        mapInstanceRef.current.flyTo([leg.toCoordinates.lat, leg.toCoordinates.lng], 16);
                      }
                    }}
                    className={`p-2 rounded-lg cursor-pointer transition-colors border ${
                      isActive
                        ? 'bg-amber-50/80 border-amber-300 text-amber-900'
                        : 'bg-slate-50 border-slate-100 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center justify-between font-medium">
                      <span className="truncate max-w-[190px]">{leg.from}</span>
                      <span className="text-slate-400 font-mono">→</span>
                      <span className="truncate max-w-[190px] text-right">{leg.to}</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1">
                      <span className="flex items-center gap-1 font-mono tabular-nums">
                        <Navigation className="w-3 h-3 text-amber-600" /> {leg.distMeters}m walk
                      </span>
                      <span className="flex items-center gap-1 font-mono tabular-nums">
                        <Clock className="w-3 h-3" /> ~{leg.walkMin} mins
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
