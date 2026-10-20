import React, { useState } from 'react';
import { Hotel, TransitOption, RoomOption, Language } from '../types/travel';
import { translations } from '../utils/translations';
import { 
  Building2, 
  Train, 
  Search, 
  Star, 
  MapPin, 
  Check, 
  Clock, 
  ShieldCheck, 
  ArrowRight,
  Wifi,
  Sparkles,
  Ticket
} from 'lucide-react';

interface HotelTransitBookingProps {
  hotels: Hotel[];
  transitOptions: TransitOption[];
  onInitiateBooking: (item: {
    type: 'hotel' | 'transit';
    title: string;
    details: string;
    price: number;
    rawItem: Hotel | TransitOption;
    room?: RoomOption;
  }) => void;
  lang: Language;
}

export const HotelTransitBooking: React.FC<HotelTransitBookingProps> = ({
  hotels,
  transitOptions,
  onInitiateBooking,
  lang,
}) => {
  const t = translations[lang];
  const [activeTab, setActiveTab] = useState<'hotels' | 'transit'>('hotels');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedHotelForRooms, setSelectedHotelForRooms] = useState<Hotel | null>(hotels[0] || null);

  const filteredHotels = hotels.filter((h) =>
    h.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    h.neighborhood.toLowerCase().includes(searchQuery.toLowerCase()) ||
    h.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredTransit = transitOptions.filter((tr) =>
    tr.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tr.operator.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tr.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Banner and Navigation Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight font-display">
              {t.booking.title}
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              {t.booking.subtitle}
            </p>
          </div>

          {/* Tab Switcher */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg shrink-0">
            <button
              onClick={() => setActiveTab('hotels')}
              className={`px-4 py-2 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 flex items-center gap-2 ${
                activeTab === 'hotels'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Building2 className="w-4 h-4 text-emerald-600" />
              <span>{t.booking.hotelsTab}</span>
            </button>
            <button
              onClick={() => setActiveTab('transit')}
              className={`px-4 py-2 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 flex items-center gap-2 ${
                activeTab === 'transit'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Train className="w-4 h-4 text-indigo-600" />
              <span>{t.booking.transitTab}</span>
            </button>
          </div>
        </div>

        {/* Search input */}
        <div className="pt-4 flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={t.booking.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {activeTab === 'hotels' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Hotel List (Left 7 Cols) */}
          <div className="lg:col-span-7 space-y-4">
            {filteredHotels.map((hotel) => {
              const isSelected = selectedHotelForRooms?.id === hotel.id;
              return (
                <div
                  key={hotel.id}
                  onClick={() => setSelectedHotelForRooms(hotel)}
                  className={`bg-white rounded-xl border p-4 transition-all cursor-pointer shadow-xs ${
                    isSelected
                      ? 'border-emerald-600 ring-2 ring-emerald-100'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row gap-4">
                    {/* Hotel Image with Fallback */}
                    <div className="relative sm:w-48 h-40 sm:h-auto rounded-lg overflow-hidden shrink-0 bg-slate-100">
                      <img
                        src={hotel.imageUrl}
                        alt={hotel.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 flex flex-col justify-between min-w-0">
                      <div>
                        <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                          <span className="flex items-center gap-1 font-medium text-slate-700">
                            <MapPin className="w-3.5 h-3.5 text-slate-400" />
                            {hotel.neighborhood}, {hotel.city}
                          </span>
                          <span className="flex items-center gap-1 font-semibold text-amber-700">
                            <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                            {hotel.rating} ({hotel.reviewsCount})
                          </span>
                        </div>

                        <h3 className="text-base font-bold text-slate-900 leading-snug">
                          {hotel.name}
                        </h3>

                        <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                          {hotel.description}
                        </p>

                        {/* Amenities preview */}
                        <div className="flex flex-wrap gap-x-2 gap-y-1 mt-2 text-[11px] text-slate-600">
                          {hotel.amenities.slice(0, 3).map((amenity, i) => (
                            <span key={i} className="flex items-center gap-1">
                              <Check className="w-3 h-3 text-emerald-600" />
                              <span>{amenity}</span>
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-100">
                        <div>
                          <span className="text-lg font-bold text-slate-900 font-mono tabular-nums">
                            ${hotel.pricePerNight}
                          </span>
                          <span className="text-xs text-slate-500 ml-1">
                            {t.common.perNight}
                          </span>
                        </div>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedHotelForRooms(hotel);
                          }}
                          className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1"
                        >
                          <span>{t.booking.roomTypes}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Selected Hotel Room Tiers Panel (Right 5 Cols) */}
          <div className="lg:col-span-5">
            {selectedHotelForRooms ? (
              <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm sticky top-6">
                <div className="pb-4 border-b border-slate-200">
                  <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">
                    {selectedHotelForRooms.neighborhood} · Rome
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                    {selectedHotelForRooms.name}
                  </h3>
                  <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                    <span>★ {selectedHotelForRooms.rating} / 5</span>
                    <span>·</span>
                    <span className="text-emerald-700 font-medium">Free Cancellation</span>
                  </div>
                </div>

                <div className="space-y-3 mt-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Available Room Configurations
                  </h4>

                  {selectedHotelForRooms.rooms.map((room) => (
                    <div
                      key={room.id}
                      className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h5 className="text-xs font-bold text-slate-900">
                            {room.name}
                          </h5>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            {room.bedType} · Sleeps {room.capacity} Guests
                          </p>
                          <div className="flex items-center gap-2 text-[11px] text-slate-600 mt-1">
                            {room.breakfastIncluded && (
                              <span className="text-emerald-700 font-medium">Breakfast Included</span>
                            )}
                            {room.refundable && (
                              <span>· Refundable</span>
                            )}
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="text-base font-bold text-slate-900 font-mono tabular-nums block">
                            ${room.pricePerNight}
                          </span>
                          <span className="text-[10px] text-slate-400">per night</span>
                        </div>
                      </div>

                      <button
                        onClick={() =>
                          onInitiateBooking({
                            type: 'hotel',
                            title: `${selectedHotelForRooms.name} — ${room.name}`,
                            details: `Check-in Oct 24, 2026 · 3 Nights · ${room.capacity} Guests`,
                            price: room.pricePerNight * 3,
                            rawItem: selectedHotelForRooms,
                            room: room,
                          })
                        }
                        className="w-full mt-3 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
                      >
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Book Room ($ {room.pricePerNight * 3} Total)</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-dashed border-slate-200 p-8 text-center text-xs text-slate-400">
                Select a hotel to view room configurations and lock in group rates.
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Local Transit Hub List */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredTransit.map((transit) => (
            <div
              key={transit.id}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
                  <span className="font-semibold text-indigo-700 uppercase tracking-wider text-[11px]">
                    {transit.operator}
                  </span>
                  <span className="flex items-center gap-1 font-mono text-slate-700">
                    <Clock className="w-3 h-3" />
                    {transit.duration}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 leading-snug">
                  {transit.title}
                </h3>

                <div className="mt-3 space-y-1 text-xs text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <div className="flex items-start gap-1.5">
                    <span className="font-semibold text-slate-700 shrink-0">Pickup:</span>
                    <span>{transit.pickupPoint}</span>
                  </div>
                  <div className="flex items-start gap-1.5">
                    <span className="font-semibold text-slate-700 shrink-0">Dropoff:</span>
                    <span>{transit.dropoffPoint}</span>
                  </div>
                  <div className="flex items-start gap-1.5 text-slate-500 pt-1">
                    <span className="font-semibold text-slate-700 shrink-0">Schedule:</span>
                    <span>{transit.departureSchedule}</span>
                  </div>
                </div>

                {/* Features */}
                <div className="flex flex-wrap gap-x-3 gap-y-1 mt-3 text-[11px] text-slate-600">
                  {transit.features.map((feat, i) => (
                    <span key={i} className="flex items-center gap-1">
                      <Check className="w-3 h-3 text-emerald-600" />
                      <span>{feat}</span>
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-100">
                <div>
                  <span className="text-xl font-bold text-slate-900 font-mono tabular-nums">
                    ${transit.price}
                  </span>
                  <span className="text-xs text-slate-500 ml-1">/ traveler</span>
                </div>

                <button
                  onClick={() =>
                    onInitiateBooking({
                      type: 'transit',
                      title: transit.title,
                      details: `${transit.operator} · Schedule: ${transit.departureSchedule}`,
                      price: transit.price * 4, // 4 group travelers default
                      rawItem: transit,
                    })
                  }
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-xs"
                >
                  <Ticket className="w-3.5 h-3.5" />
                  <span>Book Group Pass ($ {transit.price * 4})</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
