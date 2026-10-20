import React, { useState, useEffect } from 'react';
import { 
  Language, 
  ItineraryDay, 
  ItineraryStop, 
  Hotel, 
  TransitOption, 
  SpotGuide, 
  GroupMember, 
  Expense, 
  ChatMessage, 
  GalleryPhoto, 
  SocialPost, 
  BookingReceipt,
  RoomOption,
  PackingItem,
  FlightStatus,
  DiaryEntry
} from './types/travel';
import { translations } from './utils/translations';
import { 
  INITIAL_GROUP_MEMBERS, 
  INITIAL_ITINERARY_DAYS, 
  MOCK_HOTELS, 
  MOCK_TRANSIT_OPTIONS, 
  MOCK_SPOT_GUIDES, 
  INITIAL_EXPENSES, 
  INITIAL_CHAT_MESSAGES, 
  INITIAL_GALLERY_PHOTOS, 
  INITIAL_SOCIAL_POSTS, 
  INITIAL_BOOKINGS,
  INITIAL_PACKING_ITEMS,
  INITIAL_FLIGHTS,
  INITIAL_DIARY_ENTRIES
} from './data/mockTravelData';

import { Header } from './components/Header';
import { ItineraryPlanner } from './components/ItineraryPlanner';
import { InteractiveMap } from './components/InteractiveMap';
import { HotelTransitBooking } from './components/HotelTransitBooking';
import { BudgetTracker } from './components/BudgetTracker';
import { SpotFoodGuide } from './components/SpotFoodGuide';
import { GroupChat } from './components/GroupChat';
import { PhotoGallery } from './components/PhotoGallery';
import { SocialFeed } from './components/SocialFeed';
import { SecureCheckoutModal } from './components/SecureCheckoutModal';
import { BookingsListModal } from './components/BookingsListModal';
import { PlanTripModal } from './components/PlanTripModal';
import { ExpeditionToolsHub } from './components/ExpeditionToolsHub';
import { FlightTracker } from './components/FlightTracker';
import { PersonalDiary } from './components/PersonalDiary';
import { TripExportModal } from './components/TripExportModal';

import { 
  Compass, 
  Calendar, 
  MapPin, 
  Users, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  WifiOff, 
  ArrowRight,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

export default function App() {
  // Global Language State
  const [lang, setLang] = useState<Language>('en');
  const t = translations[lang];

  // Current Active Main Navigation Tab
  const [currentTab, setCurrentTab] = useState<string>('itinerary');

  // Offline Mode State
  const [isOffline, setIsOffline] = useState<boolean>(() => {
    return localStorage.getItem('wandersync_offline_sim') === 'true';
  });

  // Trip Data States
  const [tripName, setTripName] = useState('Eternal City Grand Tour — Rome');
  const [currentDestination, setCurrentDestination] = useState('Rome, Italy');
  const [days, setDays] = useState<ItineraryDay[]>(INITIAL_ITINERARY_DAYS);
  const [currentDayIndex, setCurrentDayIndex] = useState<number>(0);
  const [selectedStopId, setSelectedStopId] = useState<string | null>(null);

  // Booking & Stays
  const [hotels, setHotels] = useState<Hotel[]>(MOCK_HOTELS);
  const [transitOptions, setTransitOptions] = useState<TransitOption[]>(MOCK_TRANSIT_OPTIONS);
  const [spots, setSpots] = useState<SpotGuide[]>(MOCK_SPOT_GUIDES);
  const [bookings, setBookings] = useState<BookingReceipt[]>(INITIAL_BOOKINGS);

  // Group & Collaboration
  const [members, setMembers] = useState<GroupMember[]>(INITIAL_GROUP_MEMBERS);
  const [expenses, setExpenses] = useState<Expense[]>(INITIAL_EXPENSES);
  const [totalTripBudget, setTotalTripBudget] = useState<number>(3200);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(INITIAL_CHAT_MESSAGES);
  const [galleryPhotos, setGalleryPhotos] = useState<GalleryPhoto[]>(INITIAL_GALLERY_PHOTOS);
  const [socialPosts, setSocialPosts] = useState<SocialPost[]>(INITIAL_SOCIAL_POSTS);
  const [packingItems, setPackingItems] = useState<PackingItem[]>(INITIAL_PACKING_ITEMS);
  const [flights, setFlights] = useState<FlightStatus[]>(INITIAL_FLIGHTS);
  const [diaryEntries, setDiaryEntries] = useState<DiaryEntry[]>(INITIAL_DIARY_ENTRIES);

  // Modals
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutItem, setCheckoutItem] = useState<{
    type: 'hotel' | 'transit' | 'experience';
    title: string;
    details: string;
    price: number;
  } | null>(null);

  const [isBookingsModalOpen, setIsBookingsModalOpen] = useState(false);
  const [isPlanTripModalOpen, setIsPlanTripModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // Audio Guide Voice Player (Web Speech API)
  const [currentAudioTitle, setCurrentAudioTitle] = useState<string | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const handlePlayAudio = (title: string, text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      utterance.pitch = 1.0;
      utterance.onend = () => {
        setIsPlayingAudio(false);
        setCurrentAudioTitle(null);
      };
      utterance.onerror = () => {
        setIsPlayingAudio(false);
        setCurrentAudioTitle(null);
      };
      setCurrentAudioTitle(title);
      setIsPlayingAudio(true);
      window.speechSynthesis.speak(utterance);
    } else {
      alert(`Audio Narration: ${title}\n\n${text}`);
    }
  };

  const handleStopAudio = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlayingAudio(false);
    setCurrentAudioTitle(null);
  };

  // Toggle Offline Mode
  const handleToggleOffline = () => {
    const nextState = !isOffline;
    setIsOffline(nextState);
    localStorage.setItem('wandersync_offline_sim', String(nextState));
  };

  // Itinerary Handlers
  const handleAddDay = () => {
    const nextDayNum = days.length + 1;
    const newDay: ItineraryDay = {
      dayNumber: nextDayNum,
      date: `2026-10-${23 + nextDayNum}`,
      title: `Day ${nextDayNum}: Exploration & Free Roam`,
      summary: 'Explore charming squares, artisans and neighborhood trattorias at your own pace.',
      stops: []
    };
    setDays([...days, newDay]);
    setCurrentDayIndex(days.length);
  };

  const handleAddStop = (dayIndex: number, stopData: Omit<ItineraryStop, 'id'>) => {
    const newStop: ItineraryStop = {
      ...stopData,
      id: `stop-${Date.now()}`
    };
    const updatedDays = [...days];
    updatedDays[dayIndex].stops.push(newStop);
    setDays(updatedDays);
    setSelectedStopId(newStop.id);
  };

  const handleDeleteStop = (dayIndex: number, stopId: string) => {
    const updatedDays = [...days];
    updatedDays[dayIndex].stops = updatedDays[dayIndex].stops.filter(s => s.id !== stopId);
    setDays(updatedDays);
    if (selectedStopId === stopId) setSelectedStopId(null);
  };

  const handleMoveStop = (dayIndex: number, stopIndex: number, direction: 'up' | 'down') => {
    const updatedDays = [...days];
    const stopsList = [...updatedDays[dayIndex].stops];
    const targetIndex = direction === 'up' ? stopIndex - 1 : stopIndex + 1;
    if (targetIndex < 0 || targetIndex >= stopsList.length) return;

    const temp = stopsList[stopIndex];
    stopsList[stopIndex] = stopsList[targetIndex];
    stopsList[targetIndex] = temp;
    updatedDays[dayIndex].stops = stopsList;
    setDays(updatedDays);
  };

  const handleAddSpotToItinerary = (spot: SpotGuide) => {
    handleAddStop(currentDayIndex, {
      title: spot.name,
      category: spot.category === 'historic' ? 'historic' : spot.category === 'food' ? 'dining' : 'sightseeing',
      startTime: '14:30',
      durationMinutes: 60,
      coordinates: spot.coordinates,
      address: spot.address,
      notes: spot.insiderTips[0] || spot.shortDesc,
      costEstimate: spot.priceLevel === '$$$' ? 45 : spot.priceLevel === '$$' ? 25 : 10,
      imageUrl: spot.imageUrl,
      audioGuideTitle: spot.name,
      audioGuideText: spot.audioNarrationText,
    });
    setCurrentTab('itinerary');
  };

  const handleNavigateToSpot = (spot: SpotGuide) => {
    setCurrentTab('itinerary');
    setSelectedStopId(spot.id);
  };

  // Booking Flow Initiation
  const handleInitiateBooking = (item: {
    type: 'hotel' | 'transit';
    title: string;
    details: string;
    price: number;
    rawItem: Hotel | TransitOption;
    room?: RoomOption;
  }) => {
    setCheckoutItem({
      type: item.type,
      title: item.title,
      details: item.details,
      price: item.price,
    });
    setIsCheckoutOpen(true);
  };

  const handlePaymentSuccess = (receipt: BookingReceipt) => {
    setBookings([receipt, ...bookings]);

    // Also record as a group expense automatically!
    const newExp: Expense = {
      id: `exp-${Date.now()}`,
      title: receipt.title,
      amount: receipt.totalAmount,
      category: receipt.itemType === 'hotel' ? 'lodging' : 'transport',
      paidById: 'm1', // Current user
      date: new Date().toISOString().split('T')[0],
      splitWithIds: members.map(m => m.id),
      notes: `Auto-recorded from secure booking checkout (${receipt.bookingCode})`,
    };
    setExpenses([newExp, ...expenses]);
  };

  // Budget Handlers
  const handleAddExpense = (expenseData: Omit<Expense, 'id'>) => {
    const newExpense: Expense = {
      ...expenseData,
      id: `exp-${Date.now()}`,
    };
    setExpenses([newExpense, ...expenses]);
  };

  const handleDeleteExpense = (expenseId: string) => {
    setExpenses(expenses.filter(e => e.id !== expenseId));
  };

  const handleSettleDebt = (fromId: string, toId: string, amount: number) => {
    const fromMember = members.find(m => m.id === fromId);
    const toMember = members.find(m => m.id === toId);

    const settlementExp: Expense = {
      id: `settle-${Date.now()}`,
      title: `Settlement: ${fromMember?.name} paid ${toMember?.name}`,
      amount: amount,
      category: 'misc',
      paidById: fromId,
      date: new Date().toISOString().split('T')[0],
      splitWithIds: [toId],
      notes: `Direct debt settlement`,
    };
    setExpenses([settlementExp, ...expenses]);
  };

  // Chat Handlers
  const handleSendMessage = (text: string, options?: { isLocation?: boolean; poll?: ChatMessage['poll'] }) => {
    const newMsg: ChatMessage = {
      id: `chat-${Date.now()}`,
      senderId: 'm1',
      senderName: 'Alex Rivers',
      senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text,
      isLocation: options?.isLocation,
      poll: options?.poll,
    };
    setChatMessages([...chatMessages, newMsg]);
  };

  const handleVotePoll = (messageId: string, optionIndex: number) => {
    setChatMessages(chatMessages.map(msg => {
      if (msg.id === messageId && msg.poll) {
        const updatedOptions = [...msg.poll.options];
        const opt = updatedOptions[optionIndex];
        if (!opt.votedBy.includes('m1')) {
          opt.votes += 1;
          opt.votedBy.push('m1');
        }
        return {
          ...msg,
          poll: {
            ...msg.poll,
            options: updatedOptions
          }
        };
      }
      return msg;
    }));
  };

  // Gallery Handlers
  const handleAddPhoto = (photoData: Omit<GalleryPhoto, 'id' | 'likes' | 'likedByMe'>) => {
    const newPhoto: GalleryPhoto = {
      ...photoData,
      id: `photo-${Date.now()}`,
      likes: 1,
      likedByMe: true,
    };
    setGalleryPhotos([newPhoto, ...galleryPhotos]);
  };

  const handleToggleLikePhoto = (photoId: string) => {
    setGalleryPhotos(galleryPhotos.map(p => {
      if (p.id === photoId) {
        return {
          ...p,
          likes: p.likedByMe ? p.likes - 1 : p.likes + 1,
          likedByMe: !p.likedByMe
        };
      }
      return p;
    }));
  };

  // Social Feed Handlers
  const handleAddSocialPost = (postData: Omit<SocialPost, 'id' | 'likes' | 'likedByMe' | 'commentsCount' | 'comments'>) => {
    const newPost: SocialPost = {
      ...postData,
      id: `post-${Date.now()}`,
      likes: 1,
      likedByMe: true,
      commentsCount: 0,
      comments: []
    };
    setSocialPosts([newPost, ...socialPosts]);
  };

  const handleToggleLikeSocialPost = (postId: string) => {
    setSocialPosts(socialPosts.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          likes: p.likedByMe ? p.likes - 1 : p.likes + 1,
          likedByMe: !p.likedByMe
        };
      }
      return p;
    }));
  };

  const handleAddCommentSocialPost = (postId: string, text: string) => {
    setSocialPosts(socialPosts.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          comments: [...p.comments, { user: 'Alex Rivers', text, time: 'Just now' }]
        };
      }
      return p;
    }));
  };

  // Smart Packing Handlers
  const handleTogglePacked = (itemId: string) => {
    setPackingItems(packingItems.map(item => 
      item.id === itemId ? { ...item, packed: !item.packed } : item
    ));
  };

  const handleAddPackingItem = (itemData: Omit<PackingItem, 'id'>) => {
    const newItem: PackingItem = {
      ...itemData,
      id: `pk-${Date.now()}`
    };
    setPackingItems([newItem, ...packingItems]);
  };

  const handleDeletePackingItem = (itemId: string) => {
    setPackingItems(packingItems.filter(i => i.id !== itemId));
  };

  const handleAssignPackingItem = (itemId: string, memberId: string | undefined) => {
    setPackingItems(packingItems.map(item => 
      item.id === itemId ? { ...item, assignedToId: memberId } : item
    ));
  };

  // Flight Tracker Handlers
  const handleAddFlight = (flightData: Omit<FlightStatus, 'id'>) => {
    const newFlight: FlightStatus = {
      ...flightData,
      id: `fl-${Date.now()}`
    };
    setFlights([newFlight, ...flights]);
  };

  // Personal Diary Handlers
  const handleAddDiaryEntry = (entryData: Omit<DiaryEntry, 'id' | 'createdAt'>) => {
    const newEntry: DiaryEntry = {
      ...entryData,
      id: `de-${Date.now()}`,
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setDiaryEntries([newEntry, ...diaryEntries]);
  };

  const handleDeleteDiaryEntry = (entryId: string) => {
    setDiaryEntries(diaryEntries.filter(e => e.id !== entryId));
  };

  // Start New Planned Tour
  const handleStartPlan = (plan: {
    tripName: string;
    destination: string;
    startDate: string;
    endDate: string;
    travelersCount: number;
    budget: number;
  }) => {
    setTripName(plan.tripName);
    setCurrentDestination(plan.destination);
    setTotalTripBudget(plan.budget);
    setCurrentTab('itinerary');
  };

  const currentDay = days[currentDayIndex] || days[0];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans antialiased selection:bg-amber-100 selection:text-amber-900">
      {/* Offline Alert Strip (Sticky if offline) */}
      {isOffline && (
        <div className="bg-amber-600 text-white text-xs px-4 py-2 font-medium flex items-center justify-between shadow-xs z-50">
          <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
            <span className="flex items-center gap-2">
              <WifiOff className="w-3.5 h-3.5" />
              <strong>{t.common.offlineActive}:</strong> Local cached maps, offline itinerary timeline, vouchers, and spot guides are available with zero cellular signal.
            </span>
            <button
              onClick={handleToggleOffline}
              className="text-xs underline hover:text-amber-100 font-semibold ml-4 whitespace-nowrap"
            >
              Re-enable Online Mode
            </button>
          </div>
        </div>
      )}

      {/* Global Top Bar Contract Header */}
      <Header
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        lang={lang}
        onSelectLang={setLang}
        isOffline={isOffline}
        onToggleOffline={handleToggleOffline}
        bookingsCount={bookings.length}
        onOpenBookings={() => setIsBookingsModalOpen(true)}
        onOpenExport={() => setIsExportModalOpen(true)}
        onPlanTripCta={() => setIsPlanTripModalOpen(true)}
      />


      {/* Sub-Hero Expedition Banner & Context Bar */}
      <section className="relative bg-slate-900 text-white border-b border-slate-800 overflow-hidden">
        {/* Background Image Scrim */}
        <div className="absolute inset-0 opacity-25 mix-blend-luminosity">
          <img
            src="/src/assets/images/hero_wander_voyage_1792513873925.jpg"
            alt="Expedition Backdrop"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/90 to-slate-900/60" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="flex items-center gap-2 text-xs text-amber-400 font-semibold tracking-wide uppercase">
                <MapPin className="w-3.5 h-3.5" />
                <span>{currentDestination}</span>
                <span className="text-slate-600">·</span>
                <span>Oct 24 – Oct 28, 2026</span>
                <span className="text-slate-600">·</span>
                <span>4 Travelers Synchronized</span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-bold font-display tracking-tight text-white">
                {tripName}
              </h1>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Advance group tour command center with real-time route maps, offline venue navigation, collaborative splitwise accounting, and curated cultural guides.
              </p>
            </div>

            {/* Quick Expedition Stat Strip */}
            <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 bg-white/10 backdrop-blur-md p-3.5 rounded-xl border border-white/10 text-xs">
              <div className="px-3 border-r border-white/10">
                <span className="text-slate-400 block text-[11px]">Duration</span>
                <span className="font-bold text-white font-mono text-sm">{days.length} Days</span>
              </div>
              <div className="px-3 border-r border-white/10">
                <span className="text-slate-400 block text-[11px]">Total Budget</span>
                <span className="font-bold text-white font-mono text-sm">${totalTripBudget}</span>
              </div>
              <div className="px-3 border-r border-white/10">
                <span className="text-slate-400 block text-[11px]">Bookings</span>
                <span className="font-bold text-amber-300 font-mono text-sm">{bookings.length} Confirmed</span>
              </div>
              <div 
                onClick={() => setCurrentTab('flights')}
                className="px-3 border-r border-white/10 cursor-pointer hover:bg-white/10 transition-colors py-0.5 rounded"
                title="View Live Flight Status"
              >
                <span className="text-slate-400 block text-[11px]">Flight Status</span>
                <span className="font-bold text-sky-300 font-mono text-sm flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-ping inline-block" />
                  AZ 611 In Air
                </span>
              </div>
              <div 
                onClick={() => setCurrentTab('diary')}
                className="px-3 border-r border-white/10 cursor-pointer hover:bg-white/10 transition-colors py-0.5 rounded"
                title="View Personal Travel Diary"
              >
                <span className="text-slate-400 block text-[11px]">Field Diary</span>
                <span className="font-bold text-rose-300 font-mono text-sm">
                  {diaryEntries.length} Notes
                </span>
              </div>
              <div 
                onClick={() => setCurrentTab('tools')}
                className="px-3 border-r border-white/10 cursor-pointer hover:bg-white/10 transition-colors py-0.5 rounded"
                title="View Weather, Smart Packing & Currency Tools"
              >
                <span className="text-slate-400 block text-[11px]">Weather &amp; FX</span>
                <span className="font-bold text-amber-300 font-mono text-sm">23°C · €1 = $1.09</span>
              </div>
              <div className="px-3 flex items-center gap-2">
                <button
                  onClick={() => setIsExportModalOpen(true)}
                  className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg text-xs transition-colors whitespace-nowrap border border-white/20"
                  title="Export to Calendar (.ICS), Printable PDF, or JSON backup"
                >
                  Export Trip
                </button>
                <button
                  onClick={() => setIsPlanTripModalOpen(true)}
                  className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold rounded-lg text-xs transition-colors whitespace-nowrap"
                >
                  Edit Tour Plan
                </button>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Main Workspace Frame */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* TAB 1: Itinerary & Interactive Real-Time Map */}
        {currentTab === 'itinerary' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column: Itinerary Timeline (5 cols) */}
              <div className="lg:col-span-5">
                <ItineraryPlanner
                  days={days}
                  currentDayIndex={currentDayIndex}
                  onSelectDay={setCurrentDayIndex}
                  onAddDay={handleAddDay}
                  onAddStop={handleAddStop}
                  onDeleteStop={handleDeleteStop}
                  onMoveStop={handleMoveStop}
                  selectedStopId={selectedStopId}
                  onSelectStop={(stop) => setSelectedStopId(stop.id)}
                  onPlayAudio={handlePlayAudio}
                  lang={lang}
                />
              </div>

              {/* Right Column: Real-Time Interactive Map (7 cols) */}
              <div className="lg:col-span-7">
                <InteractiveMap
                  stops={currentDay.stops}
                  allSpots={spots}
                  hotels={hotels}
                  transitOptions={transitOptions}
                  selectedStopId={selectedStopId}
                  onSelectStop={(stop) => setSelectedStopId(stop.id)}
                  onAddToItinerary={handleAddSpotToItinerary}
                  onPlayAudio={handlePlayAudio}
                  lang={lang}
                  isOffline={isOffline}
                  onToggleOffline={handleToggleOffline}
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Hotel & Transit Booking with Secure Checkout */}
        {currentTab === 'booking' && (
          <HotelTransitBooking
            hotels={hotels}
            transitOptions={transitOptions}
            onInitiateBooking={handleInitiateBooking}
            lang={lang}
          />
        )}

        {/* TAB 3: Collaborative Group Budget Tracker */}
        {currentTab === 'budget' && (
          <BudgetTracker
            members={members}
            expenses={expenses}
            totalTripBudget={totalTripBudget}
            onAddExpense={handleAddExpense}
            onDeleteExpense={handleDeleteExpense}
            onSettleDebt={handleSettleDebt}
            lang={lang}
          />
        )}

        {/* TAB 4: Spot & Food Guide + History & Audio Tours */}
        {currentTab === 'spots' && (
          <SpotFoodGuide
            spots={spots}
            onAddToItinerary={handleAddSpotToItinerary}
            onNavigateToSpot={handleNavigateToSpot}
            onPlayAudio={handlePlayAudio}
            currentAudioTitle={currentAudioTitle}
            isPlayingAudio={isPlayingAudio}
            onStopAudio={handleStopAudio}
            lang={lang}
          />
        )}

        {/* TAB 5: Group Chat */}
        {currentTab === 'chat' && (
          <div className="max-w-3xl mx-auto">
            <GroupChat
              messages={chatMessages}
              members={members}
              currentUser={members[0]}
              onSendMessage={handleSendMessage}
              onVotePoll={handleVotePoll}
              lang={lang}
            />
          </div>
        )}

        {/* TAB 6: Shared Photo Gallery Memories */}
        {currentTab === 'gallery' && (
          <PhotoGallery
            photos={galleryPhotos}
            members={members}
            currentUser={members[0]}
            onAddPhoto={handleAddPhoto}
            onToggleLike={handleToggleLikePhoto}
            lang={lang}
          />
        )}

        {/* TAB 7: Global Explorer Social Feed */}
        {currentTab === 'social' && (
          <SocialFeed
            posts={socialPosts}
            onAddPost={handleAddSocialPost}
            onToggleLikePost={handleToggleLikeSocialPost}
            onAddComment={handleAddCommentSocialPost}
            lang={lang}
          />
        )}

        {/* TAB 8: Smart Packing, Currency Converter & Weather Forecast Hub */}
        {currentTab === 'tools' && (
          <ExpeditionToolsHub
            packingItems={packingItems}
            members={members}
            onTogglePacked={handleTogglePacked}
            onAddPackingItem={handleAddPackingItem}
            onDeletePackingItem={handleDeletePackingItem}
            onAssignPackingItem={handleAssignPackingItem}
            lang={lang}
          />
        )}

        {/* TAB 9: Live Flight Tracker */}
        {currentTab === 'flights' && (
          <FlightTracker
            flights={flights}
            members={members}
            onAddFlight={handleAddFlight}
            lang={lang}
          />
        )}

        {/* TAB 10: Personal Travel Diary & Field Journal */}
        {currentTab === 'diary' && (
          <PersonalDiary
            entries={diaryEntries}
            onAddEntry={handleAddDiaryEntry}
            onDeleteEntry={handleDeleteDiaryEntry}
            lang={lang}
          />
        )}
      </main>

      {/* Global Modals */}
      <SecureCheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        bookingItem={checkoutItem}
        onPaymentSuccess={handlePaymentSuccess}
        lang={lang}
      />

      <BookingsListModal
        isOpen={isBookingsModalOpen}
        onClose={() => setIsBookingsModalOpen(false)}
        bookings={bookings}
        lang={lang}
      />

      <PlanTripModal
        isOpen={isPlanTripModalOpen}
        onClose={() => setIsPlanTripModalOpen(false)}
        onStartPlan={handleStartPlan}
        lang={lang}
      />

      <TripExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        tripName={tripName}
        destination={currentDestination}
        days={days}
        hotels={hotels}
        transitOptions={transitOptions}
        members={members}
        bookings={bookings}
        expenses={expenses}
        lang={lang}
      />

      {/* Quiet Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-amber-600" />
            <span className="font-bold text-slate-900 font-display">WanderSync</span>
            <span>·</span>
            <span>Collaborative Tour Planning &amp; Field Companion</span>
          </div>

          <div className="flex items-center gap-4 text-slate-500">
            <span>English · Español · Français</span>
            <span>·</span>
            <span className="font-mono">Offline Cache Engine v2.4</span>
            <span>·</span>
            <span>© 2026 WanderSync Inc.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
