import React, { useState } from 'react';
import { FlightStatus, GroupMember, Language } from '../types/travel';
import { translations } from '../utils/translations';
import { 
  Plane, 
  Clock, 
  MapPin, 
  Search, 
  Plus, 
  Users, 
  ShieldCheck, 
  Luggage, 
  Compass, 
  ArrowRight,
  Gauge,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface FlightTrackerProps {
  flights: FlightStatus[];
  members: GroupMember[];
  onAddFlight: (flight: Omit<FlightStatus, 'id'>) => void;
  lang: Language;
}

export const FlightTracker: React.FC<FlightTrackerProps> = ({
  flights,
  members,
  onAddFlight,
  lang,
}) => {
  const t = translations[lang];
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Flight Modal State
  const [newFlightNumber, setNewFlightNumber] = useState('');
  const [newAirline, setNewAirline] = useState('ITA Airways');
  const [newDepCity, setNewDepCity] = useState('');
  const [newDepAirport, setNewDepAirport] = useState('JFK');
  const [newDepTime, setNewDepTime] = useState('21:00');
  const [newArrTime, setNewArrTime] = useState('08:30 AM');
  const [newAircraft, setNewAircraft] = useState('Airbus A350');
  const [newTravelers, setNewTravelers] = useState<string[]>(['Alex Rivers']);

  const filteredFlights = flights.filter(f => 
    f.flightNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.airline.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.departureCity.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.travelerNames.some(name => name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const getStatusBadge = (status: FlightStatus['status']) => {
    switch (status) {
      case 'in_air':
        return (
          <span className="text-xs font-semibold text-sky-700 bg-sky-50 border border-sky-200 px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
            <Plane className="w-3.5 h-3.5 animate-pulse text-sky-600" />
            <span>{t.flights.statusInAir}</span>
          </span>
        );
      case 'boarding':
        return (
          <span className="text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            <span>{t.flights.statusBoarding}</span>
          </span>
        );
      case 'landed':
        return (
          <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>{t.flights.statusLanded}</span>
          </span>
        );
      case 'delayed':
        return (
          <span className="text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200 px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
            <span>Delayed</span>
          </span>
        );
      default:
        return (
          <span className="text-xs font-semibold text-slate-700 bg-slate-100 border border-slate-200 px-2.5 py-0.5 rounded-full">
            {t.flights.statusScheduled}
          </span>
        );
    }
  };

  const handleCreateFlight = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFlightNumber.trim() || !newDepCity.trim()) return;

    onAddFlight({
      flightNumber: newFlightNumber.trim().toUpperCase(),
      airline: newAirline,
      departureCity: newDepCity.trim(),
      departureAirport: newDepAirport.trim().toUpperCase(),
      departureTerminal: 'Terminal 1',
      departureGate: 'Gate TBA',
      departureTime: newDepTime,
      arrivalCity: 'Rome (FCO)',
      arrivalAirport: 'FCO',
      arrivalTerminal: 'Terminal 3',
      arrivalGate: 'Gate TBA',
      arrivalTime: newArrTime,
      status: 'scheduled',
      progressPercent: 0,
      aircraft: newAircraft,
      duration: '8h 20m',
      travelerNames: newTravelers,
      baggageClaim: 'Carousel 8'
    });

    setNewFlightNumber('');
    setNewDepCity('');
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight font-display flex items-center gap-2">
              <Plane className="w-5 h-5 text-sky-600" />
              <span>{t.flights.title}</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {t.flights.subtitle}
            </p>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 shrink-0 whitespace-nowrap shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>{t.flights.trackFlight}</span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="pt-4 flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={t.flights.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>
        </div>
      </div>

      {/* Flight Cards Grid */}
      <div className="space-y-4">
        {filteredFlights.map((flight) => (
          <div
            key={flight.id}
            className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:border-slate-300 transition-all space-y-4"
          >
            {/* Top row: Airline & Flight No, Status, Passengers */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-700 font-bold text-xs shrink-0">
                  <Plane className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-base font-mono">
                      {flight.flightNumber}
                    </span>
                    <span className="text-xs text-slate-500">· {flight.airline}</span>
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {flight.aircraft} · {flight.duration}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {getStatusBadge(flight.status)}

                {/* Travelers tagged on this flight */}
                <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200/80 text-xs text-slate-700">
                  <Users className="w-3.5 h-3.5 text-slate-400" />
                  <span className="font-medium">{flight.travelerNames.join(', ')}</span>
                </div>
              </div>
            </div>

            {/* Flight Route & Radar Progress Visualization */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center py-2">
              {/* Origin */}
              <div className="md:col-span-4 space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                  {t.flights.departure}
                </span>
                <span className="text-2xl font-bold font-mono text-slate-900 block">
                  {flight.departureAirport}
                </span>
                <p className="text-xs text-slate-600 font-medium">
                  {flight.departureCity}
                </p>
                <div className="text-[11px] text-slate-500 space-x-2 font-mono">
                  <span>{flight.departureTerminal}</span>
                  <span>·</span>
                  <span>{flight.departureGate}</span>
                </div>
                <div className="text-xs font-semibold text-slate-900 font-mono pt-1">
                  {flight.departureTime}
                </div>
              </div>

              {/* Progress Radar Bar (4 cols) */}
              <div className="md:col-span-4 flex flex-col items-center justify-center text-center space-y-2">
                <div className="w-full relative flex items-center">
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-900 shrink-0" />
                  <div className="flex-1 bg-slate-200 h-1 relative overflow-hidden mx-1">
                    <div
                      className="h-full bg-sky-600 transition-all duration-500"
                      style={{ width: `${flight.progressPercent}%` }}
                    />
                  </div>
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-600 shrink-0" />

                  {/* Airplane icon along path */}
                  <div
                    className="absolute -top-2.5 transition-all duration-500"
                    style={{ left: `${Math.max(5, Math.min(90, flight.progressPercent))}%` }}
                  >
                    <Plane className="w-5 h-5 text-sky-600 fill-sky-100 rotate-90" />
                  </div>
                </div>

                <div className="flex items-center justify-between w-full text-[10px] text-slate-400 font-mono">
                  <span>Cruising</span>
                  <span className="font-bold text-sky-700">{flight.progressPercent}% Completed</span>
                  <span>Arrival ETA</span>
                </div>

                {flight.altitudeFeet && flight.speedMph && (
                  <div className="flex items-center gap-3 text-[11px] text-slate-500 font-mono pt-1">
                    <span>{flight.altitudeFeet.toLocaleString()} FT</span>
                    <span>·</span>
                    <span>{flight.speedMph} MPH</span>
                  </div>
                )}
              </div>

              {/* Destination (Rome FCO) */}
              <div className="md:col-span-4 text-right space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                  {t.flights.arrival}
                </span>
                <span className="text-2xl font-bold font-mono text-slate-900 block">
                  {flight.arrivalAirport}
                </span>
                <p className="text-xs text-slate-600 font-medium">
                  {flight.arrivalCity}
                </p>
                <div className="text-[11px] text-slate-500 space-x-2 font-mono">
                  <span>{flight.arrivalTerminal}</span>
                  <span>·</span>
                  <span>{flight.arrivalGate}</span>
                </div>
                <div className="text-xs font-semibold text-emerald-700 font-mono pt-1">
                  {flight.arrivalTime}
                </div>
              </div>
            </div>

            {/* Bottom Info Bar: Baggage Carousel & Ground Transit Advice */}
            <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
              <div className="flex items-center gap-2">
                <Luggage className="w-4 h-4 text-slate-400" />
                <span>
                  <strong>{t.flights.baggage}:</strong> {flight.baggageClaim || 'Terminal 3 Carousel 8'}
                </span>
              </div>

              <div className="flex items-center gap-2 text-slate-600">
                <span className="text-[11px]">Connecting directly to Leonardo Express rail to Roma Termini</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Track Custom Flight Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 max-w-md w-full p-6 animate-in fade-in zoom-in-95 duration-150">
            <h3 className="text-lg font-bold text-slate-900 mb-1">
              {t.flights.trackFlight}
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Add a flight number to track radar arrival times and gate changes for your group.
            </p>

            <form onSubmit={handleCreateFlight} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Flight Number *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. AZ 611"
                    value={newFlightNumber}
                    onChange={(e) => setNewFlightNumber(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 text-xs font-mono uppercase"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Airline
                  </label>
                  <select
                    value={newAirline}
                    onChange={(e) => setNewAirline(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 text-xs bg-white"
                  >
                    <option value="ITA Airways">ITA Airways</option>
                    <option value="Delta Air Lines">Delta Air Lines</option>
                    <option value="British Airways">British Airways</option>
                    <option value="Lufthansa">Lufthansa</option>
                    <option value="Air France">Air France</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Departure City &amp; Airport Code *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. New York (JFK) or London (LHR)"
                  value={newDepCity}
                  onChange={(e) => setNewDepCity(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Departure Time
                  </label>
                  <input
                    type="text"
                    value={newDepTime}
                    onChange={(e) => setNewDepTime(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Arrival in Rome (FCO)
                  </label>
                  <input
                    type="text"
                    value={newArrTime}
                    onChange={(e) => setNewArrTime(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Group Passengers Onboard
                </label>
                <div className="grid grid-cols-2 gap-2 p-2 bg-slate-50 rounded-lg border border-slate-200">
                  {members.map(m => (
                    <label key={m.id} className="flex items-center gap-2 text-[11px] text-slate-700">
                      <input
                        type="checkbox"
                        checked={newTravelers.includes(m.name)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setNewTravelers([...newTravelers, m.name]);
                          } else {
                            setNewTravelers(newTravelers.filter(name => name !== m.name));
                          }
                        }}
                      />
                      <span>{m.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-lg font-medium"
                >
                  {t.common.cancel}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-semibold shadow-xs"
                >
                  Start Tracking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
