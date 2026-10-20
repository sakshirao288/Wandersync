export type Language = 'en' | 'es' | 'fr';

export type ActivityCategory = 'sightseeing' | 'dining' | 'hotel' | 'transport' | 'activity' | 'culture' | 'historic';

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface ItineraryStop {
  id: string;
  title: string;
  category: ActivityCategory;
  startTime: string;
  durationMinutes: number;
  coordinates: Coordinates;
  address: string;
  notes: string;
  costEstimate: number;
  bookingRef?: string;
  imageUrl?: string;
  audioGuideTitle?: string;
  audioGuideText?: string;
}

export interface ItineraryDay {
  dayNumber: number;
  date: string;
  title: string;
  summary: string;
  stops: ItineraryStop[];
}

export interface RoomOption {
  id: string;
  name: string;
  capacity: number;
  bedType: string;
  pricePerNight: number;
  refundable: boolean;
  breakfastIncluded: boolean;
}

export interface Hotel {
  id: string;
  name: string;
  city: string;
  neighborhood: string;
  rating: number;
  reviewsCount: number;
  pricePerNight: number;
  imageUrl: string;
  coordinates: Coordinates;
  amenities: string[];
  description: string;
  rooms: RoomOption[];
}

export interface TransitOption {
  id: string;
  title: string;
  type: 'train' | 'metro' | 'shuttle' | 'scooter' | 'private_car' | 'ferry';
  operator: string;
  price: number;
  duration: string;
  departureSchedule: string;
  pickupPoint: string;
  dropoffPoint: string;
  features: string[];
  coordinates: Coordinates;
}

export interface SpotGuide {
  id: string;
  name: string;
  city: string;
  category: 'food' | 'historic' | 'culture' | 'viewpoint';
  rating: number;
  reviewsCount: number;
  priceLevel: '$' | '$$' | '$$$' | '$$$$';
  coordinates: Coordinates;
  address: string;
  imageUrl: string;
  shortDesc: string;
  historyContent: string;
  architecturalSignificance: string;
  audioNarrationText: string;
  insiderTips: string[];
  signatureItems?: string[];
  openingHours: string;
}

export interface GroupMember {
  id: string;
  name: string;
  avatar: string;
  role: 'organizer' | 'traveler';
  totalPaid: number;
  totalOwed: number;
}

export interface Expense {
  id: string;
  title: string;
  amount: number;
  category: 'lodging' | 'transport' | 'food' | 'activities' | 'misc';
  paidById: string;
  date: string;
  splitWithIds: string[];
  notes?: string;
}

export interface Settlement {
  fromId: string;
  toId: string;
  amount: number;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  timestamp: string;
  text: string;
  isLocation?: boolean;
  locationCoords?: Coordinates;
  poll?: {
    question: string;
    options: { text: string; votes: number; votedBy: string[] }[];
  };
}

export interface GalleryPhoto {
  id: string;
  uploaderId: string;
  uploaderName: string;
  uploaderAvatar: string;
  imageUrl: string;
  caption: string;
  location: string;
  date: string;
  likes: number;
  likedByMe?: boolean;
}

export interface SocialPost {
  id: string;
  author: string;
  authorAvatar: string;
  destination: string;
  date: string;
  title: string;
  story: string;
  imageUrl: string;
  tags: string[];
  likes: number;
  likedByMe?: boolean;
  commentsCount: number;
  comments: { user: string; text: string; time: string }[];
}

export interface BookingReceipt {
  id: string;
  itemType: 'hotel' | 'transit' | 'experience';
  title: string;
  date: string;
  guests: number;
  totalAmount: number;
  currency: string;
  status: 'confirmed' | 'pending';
  bookingCode: string;
  paymentMethod: string;
  cardLastFour: string;
  bookedAt: string;
  qrCodeMock: string;
}

export type PackingCategory = 'essentials' | 'clothing' | 'electronics' | 'health' | 'weather' | 'group';

export interface PackingItem {
  id: string;
  name: string;
  category: PackingCategory;
  assignedToId?: string; // member id or 'group'
  packed: boolean;
  weatherTriggered?: boolean;
  notes?: string;
}

export interface HourlyWeather {
  time: string;
  temp: number;
  condition: 'sunny' | 'cloudy' | 'rain' | 'partly_cloudy';
  rainProbability: number;
}

export interface WeatherDay {
  date: string;
  dayName: string;
  tempHigh: number;
  tempLow: number;
  condition: 'sunny' | 'cloudy' | 'rain' | 'partly_cloudy';
  rainProbability: number;
  windKmH: number;
  uvIndex: number;
  humidity: number;
  activityAdvice: string;
  packingTip: string;
  hourly: HourlyWeather[];
}

export interface CurrencyRate {
  code: string;
  name: string;
  symbol: string;
  rateToUSD: number;
  flag: string;
}

export interface FlightStatus {
  id: string;
  flightNumber: string;
  airline: string;
  airlineLogo?: string;
  departureCity: string;
  departureAirport: string; // e.g. JFK
  departureTerminal: string;
  departureGate: string;
  departureTime: string;
  arrivalCity: string;
  arrivalAirport: string; // e.g. FCO
  arrivalTerminal: string;
  arrivalGate: string;
  arrivalTime: string;
  status: 'scheduled' | 'boarding' | 'in_air' | 'landed' | 'delayed';
  progressPercent: number;
  aircraft: string;
  altitudeFeet?: number;
  speedMph?: number;
  duration: string;
  travelerNames: string[];
  baggageClaim?: string;
}

export type DiaryMood = 'inspired' | 'serene' | 'culinary' | 'energetic' | 'reflective';

export interface DiaryEntry {
  id: string;
  title: string;
  date: string;
  dayNumber: number;
  location: string;
  content: string;
  mood: DiaryMood;
  weatherSnippet?: string;
  photoUrl?: string;
  isPrivate: boolean;
  createdAt: string;
}


