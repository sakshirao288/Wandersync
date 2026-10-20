import { ItineraryDay, Hotel, TransitOption, SpotGuide, GroupMember, Expense, ChatMessage, GalleryPhoto, SocialPost, BookingReceipt, PackingItem, WeatherDay, CurrencyRate, FlightStatus, DiaryEntry } from '../types/travel';

export const INITIAL_GROUP_MEMBERS: GroupMember[] = [
  { id: 'm1', name: 'Alex Rivers', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80', role: 'organizer', totalPaid: 580, totalOwed: 320 },
  { id: 'm2', name: 'Elena Rostova', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80', role: 'traveler', totalPaid: 420, totalOwed: 320 },
  { id: 'm3', name: 'Marcus Chen', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80', role: 'traveler', totalPaid: 150, totalOwed: 320 },
  { id: 'm4', name: 'Sophia Martinez', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80', role: 'traveler', totalPaid: 130, totalOwed: 320 },
];

export const INITIAL_ITINERARY_DAYS: ItineraryDay[] = [
  {
    dayNumber: 1,
    date: '2026-10-24',
    title: 'Imperial Rome & Ancient Marvels',
    summary: 'Colosseum gladiatorial arena, walking through the Roman Forum arches, and twilight dining in Trastevere.',
    stops: [
      {
        id: 'stop-1',
        title: 'Colosseum (Flavian Amphitheatre)',
        category: 'historic',
        startTime: '09:00',
        durationMinutes: 120,
        coordinates: { lat: 41.8902, lng: 12.4922 },
        address: 'Piazza del Colosseo, 1, 00184 Roma RM',
        notes: 'Priority skip-the-line group ticket booked. Enter through Sperone Valadier gate.',
        costEstimate: 36,
        bookingRef: 'ROM-COL-8924',
        imageUrl: '/src/assets/images/hero_wander_voyage_1792513873925.jpg',
        audioGuideTitle: 'The Stone Titan: 2,000 Years of Imperial Spectacle',
        audioGuideText: 'Commissioned under Emperor Vespasian in 72 AD and completed in 80 AD by Titus, the Colosseum held over 50,000 spectators. Marvel at the hypogeum subterranean staging vaults beneath your feet.'
      },
      {
        id: 'stop-2',
        title: 'Roman Forum & Palatine Hill',
        category: 'sightseeing',
        startTime: '11:45',
        durationMinutes: 90,
        coordinates: { lat: 41.8925, lng: 12.4853 },
        address: 'Via della Salara Vecchia, 5/6, Roma',
        notes: 'Walk up to Palatine terrace for panorama over the Curia Julia and Arch of Septimius Severus.',
        costEstimate: 0,
        audioGuideTitle: 'Heart of the Republic: Curia & Temple of Saturn',
        audioGuideText: 'This modest valley was the political, commercial, and religious nerve center of the entire Mediterranean world for over a millennium.'
      },
      {
        id: 'stop-3',
        title: 'Lunch at Roscioli Salumeria con Cucina',
        category: 'dining',
        startTime: '13:30',
        durationMinutes: 75,
        coordinates: { lat: 41.8942, lng: 12.4735 },
        address: 'Via dei Giubbonari, 21, 00186 Roma',
        notes: 'Table reserved for 4 under Alex Rivers. Legendary carbonara and aged pecorino.',
        costEstimate: 45,
        imageUrl: '/src/assets/images/culinary_local_table_1792513875904.jpg',
      },
      {
        id: 'stop-4',
        title: 'Pantheon of Agrippa',
        category: 'historic',
        startTime: '15:15',
        durationMinutes: 60,
        coordinates: { lat: 41.8986, lng: 12.4769 },
        address: 'Piazza della Rotonda, 00186 Roma',
        notes: 'Notice the 9-meter oculus open to the sky; examine Raphael\'s marble tomb.',
        costEstimate: 5,
        audioGuideTitle: 'The Miracle of Unreinforced Concrete',
        audioGuideText: 'Rebuilt by Emperor Hadrian circa 125 AD, the Pantheon dome remains the world\'s largest unreinforced concrete dome even today.'
      },
      {
        id: 'stop-5',
        title: 'Sunset at Trevi Fountain & Gelato',
        category: 'sightseeing',
        startTime: '17:00',
        durationMinutes: 45,
        coordinates: { lat: 41.9009, lng: 12.4833 },
        address: 'Piazza di Trevi, 00187 Roma',
        notes: 'Traditional coin toss over the left shoulder using the right hand to guarantee a return to Rome.',
        costEstimate: 8,
      },
      {
        id: 'stop-6',
        title: 'Trastevere Evening Feast & Wine',
        category: 'dining',
        startTime: '19:30',
        durationMinutes: 120,
        coordinates: { lat: 41.8893, lng: 12.4704 },
        address: 'Piazza San Calisto, 00153 Roma',
        notes: 'Outdoor patio seating. Cacio e pepe, supplì al telefono, and Roman artichokes.',
        costEstimate: 50,
      }
    ]
  },
  {
    dayNumber: 2,
    date: '2026-10-25',
    title: 'Vatican Treasures & Renaissance Splendor',
    summary: 'Sistine Chapel, St. Peter’s Basilica dome climb, and Castel Sant’Angelo along the Tiber.',
    stops: [
      {
        id: 'stop-201',
        title: 'Vatican Museums & Sistine Chapel',
        category: 'culture',
        startTime: '08:30',
        durationMinutes: 180,
        coordinates: { lat: 41.9067, lng: 12.4534 },
        address: 'Viale Vaticano, 00165 Roma',
        notes: 'Early entry ticket. Follow the gallery of maps directly to Michelangelo’s frescoed ceiling.',
        costEstimate: 32,
        imageUrl: '/src/assets/images/hero_wander_voyage_1792513873925.jpg',
        audioGuideTitle: 'The Ceiling of Genesis: Michelangelo Buonarroti',
        audioGuideText: 'Painted between 1508 and 1512 under Pope Julius II, this 500-square-meter vault transformed Western art forever.'
      },
      {
        id: 'stop-202',
        title: 'St. Peter\'s Basilica Dome Climb',
        category: 'sightseeing',
        startTime: '12:00',
        durationMinutes: 90,
        coordinates: { lat: 41.9022, lng: 12.4539 },
        address: 'Piazza San Pietro, 00120 Città del Vaticano',
        notes: 'Elevator + 320 stairs to the cupola summit for 360-degree vista of Rome and Vatican Gardens.',
        costEstimate: 10,
      },
      {
        id: 'stop-203',
        title: 'Pizzarium Bonci Roman Street Lunch',
        category: 'dining',
        startTime: '14:00',
        durationMinutes: 45,
        coordinates: { lat: 41.9079, lng: 12.4485 },
        address: 'Via della Meloria, 43, 00136 Roma',
        notes: 'Pizza al taglio cut by scissors. Try the potato-mozzarella and zucchini blossom with ricotta.',
        costEstimate: 16,
      },
      {
        id: 'stop-204',
        title: 'Castel Sant\'Angelo & Ponte Sant\'Angelo',
        category: 'historic',
        startTime: '15:30',
        durationMinutes: 90,
        coordinates: { lat: 41.9031, lng: 12.4663 },
        address: 'Lungotevere Castello, 50, 00193 Roma',
        notes: 'Hadrian’s mausoleum converted into a papal fortress. Stroll across Bernini’s angel bridge.',
        costEstimate: 15,
      }
    ]
  },
  {
    dayNumber: 3,
    date: '2026-10-26',
    title: 'Baroque Fountains, Spanish Steps & Villa Borghese',
    summary: 'Piazza Navona Bernini fountains, Spanish Steps coffee culture, and sunset cycling in Borghese gardens.',
    stops: [
      {
        id: 'stop-301',
        title: 'Piazza Navona & Fountain of the Four Rivers',
        category: 'sightseeing',
        startTime: '09:30',
        durationMinutes: 60,
        coordinates: { lat: 41.8992, lng: 12.4731 },
        address: 'Piazza Navona, 00186 Roma',
        notes: 'Built over the 1st-century Stadium of Domitian. Bernini’s Fontana dei Quattro Fiumi centerpiece.',
        costEstimate: 0,
      },
      {
        id: 'stop-302',
        title: 'Spanish Steps & Keats-Shelley House',
        category: 'culture',
        startTime: '11:00',
        durationMinutes: 75,
        coordinates: { lat: 41.9057, lng: 12.4823 },
        address: 'Piazza di Spagna, 00187 Roma',
        notes: '135 steps connecting Piazza di Spagna to Trinità dei Monti church.',
        costEstimate: 6,
      },
      {
        id: 'stop-303',
        title: 'Villa Borghese Gardens & Pincio Terrace',
        category: 'activity',
        startTime: '14:00',
        durationMinutes: 120,
        coordinates: { lat: 41.9138, lng: 12.4862 },
        address: 'Viale del Galoppatoio, 33, 00197 Roma',
        notes: 'Rent 4-seater surrey quadricycle. Breathtaking golden hour panorama over Piazza del Popolo.',
        costEstimate: 20,
      }
    ]
  }
];

export const MOCK_HOTELS: Hotel[] = [
  {
    id: 'h1',
    name: 'Palazzo Navona Heritage Hotel',
    city: 'Rome',
    neighborhood: 'Centro Storico',
    rating: 4.9,
    reviewsCount: 428,
    pricePerNight: 245,
    imageUrl: '/src/assets/images/boutique_hotel_suite_1792513875258.jpg',
    coordinates: { lat: 41.8988, lng: 12.4735 },
    amenities: ['Rooftop Piazza View', 'Organic Roman Breakfast', 'High-Speed Wi-Fi', 'Complimentary Smartphone with Data', 'Concierge Tour Desk'],
    description: 'Restored 17th-century palazzo nestled between Piazza Navona and the Pantheon. Features original coffered timber ceilings, Italian oak floors, and a private sunset rooftop terrace overlooking Baroque domes.',
    rooms: [
      { id: 'r1', name: 'Deluxe Courtyard King', capacity: 2, bedType: '1 Extra-large King Bed', pricePerNight: 245, refundable: true, breakfastIncluded: true },
      { id: 'r2', name: 'Executive Terrace Suite with View', capacity: 3, bedType: '1 King + 1 Sofa Sleeper', pricePerNight: 340, refundable: true, breakfastIncluded: true },
      { id: 'r3', name: 'Family Grand Residence', capacity: 4, bedType: '2 Queen Beds', pricePerNight: 410, refundable: false, breakfastIncluded: true }
    ]
  },
  {
    id: 'h2',
    name: 'Villa San Giorgio Boutique Retreat',
    city: 'Rome',
    neighborhood: 'Aventine Hill',
    rating: 4.8,
    reviewsCount: 312,
    pricePerNight: 195,
    imageUrl: '/src/assets/images/hero_wander_voyage_1792513873925.jpg',
    coordinates: { lat: 41.8845, lng: 12.4812 },
    amenities: ['Orange Garden Terrace', 'Spa & Roman Bath Tub', 'Free Airport Shuttle', 'Pet Friendly', 'Electric Bike Charging'],
    description: 'An oasis of serenity on peaceful Aventine Hill, walking distance to the famous Keyhole view and the Giardino degli Aranci. Savor artisan espresso surrounded by fragrant lemon groves.',
    rooms: [
      { id: 'r21', name: 'Classic Garden View Queen', capacity: 2, bedType: '1 Queen Bed', pricePerNight: 195, refundable: true, breakfastIncluded: true },
      { id: 'r22', name: 'Aventine Panorama Suite', capacity: 2, bedType: '1 King Bed', pricePerNight: 280, refundable: true, breakfastIncluded: true }
    ]
  },
  {
    id: 'h3',
    name: 'Residenza Trastevere Bohemian Lofts',
    city: 'Rome',
    neighborhood: 'Trastevere',
    rating: 4.7,
    reviewsCount: 265,
    pricePerNight: 165,
    imageUrl: '/src/assets/images/barcelona_gothic_1792513875059.jpg',
    coordinates: { lat: 41.8890, lng: 12.4715 },
    amenities: ['Self Check-in Keypad', 'Kitchenette & Espresso Bar', 'Washer & Dryer', 'Soundproof Windows', 'Bicycle Parking'],
    description: 'Chic designer loft positioned in the pulse of Trastevere’s evening culinary corridor. Step straight into lively piazzas with trattorias and wine bars.',
    rooms: [
      { id: 'r31', name: 'Artist Studio Loft', capacity: 2, bedType: '1 Queen Bed', pricePerNight: 165, refundable: true, breakfastIncluded: false },
      { id: 'r32', name: 'Two-Bedroom Group Apartment', capacity: 5, bedType: '2 Queens + 1 Single', pricePerNight: 290, refundable: true, breakfastIncluded: false }
    ]
  }
];

export const MOCK_TRANSIT_OPTIONS: TransitOption[] = [
  {
    id: 't1',
    title: 'Leonardo Express Airport Non-Stop Train',
    type: 'train',
    operator: 'Trenitalia FS',
    price: 14,
    duration: '32 mins',
    departureSchedule: 'Every 15 minutes (06:00 - 23:30)',
    pickupPoint: 'Fiumicino Airport (FCO) Terminal 3',
    dropoffPoint: 'Roma Termini Central Station (Platform 24)',
    features: ['Dedicated luggage racks', 'Air conditioned', 'Free Wi-Fi', 'Guaranteed during strikes'],
    coordinates: { lat: 41.9014, lng: 12.5015 }
  },
  {
    id: 't2',
    title: 'Rome 72-Hour Unlimited Metro & Bus Pass',
    type: 'metro',
    operator: 'ATAC Roma Capitale',
    price: 18,
    duration: '72 Hours Unlimited',
    departureSchedule: 'Continuous 24/7 service',
    pickupPoint: 'Any Metro Station or Tap-and-Go validator',
    dropoffPoint: 'All Line A, B, C stations & city buses',
    features: ['Unlimited rides for 3 days', 'Includes Ostia Antica urban rail', 'Contactless Apple/Google Pay compatible'],
    coordinates: { lat: 41.8905, lng: 12.4930 }
  },
  {
    id: 't3',
    title: 'Vintage Vespa 125cc City Rental (Full Day)',
    type: 'scooter',
    operator: 'Bici & Baci Roma',
    price: 65,
    duration: '24 Hours',
    departureSchedule: 'Instant pickup from 09:00',
    pickupPoint: 'Via del Viminale 5 (Near Termini)',
    dropoffPoint: 'Return to depot with full tank',
    features: ['2 DOT-certified helmets included', 'Smartphone navigation mount', 'Full comprehensive insurance', 'ZTL historic center access pass'],
    coordinates: { lat: 41.9002, lng: 12.4950 }
  },
  {
    id: 't4',
    title: 'Mercedes V-Class Group Shuttle (Up to 7 Guests)',
    type: 'private_car',
    operator: 'Roma VIP Chauffeur',
    price: 85,
    duration: '40 mins',
    departureSchedule: 'Private scheduled time',
    pickupPoint: 'Hotel Lobby / Airport Arrival gate with name sign',
    dropoffPoint: 'Direct doorstep drop-off',
    features: ['Bottled chilled water', 'USB phone charging ports', 'Spacious trunk for 7 suitcases', 'English-speaking professional driver'],
    coordinates: { lat: 41.8988, lng: 12.4735 }
  }
];

export const MOCK_SPOT_GUIDES: SpotGuide[] = [
  {
    id: 'sg1',
    name: 'Colosseum & Ludus Magnus',
    city: 'Rome',
    category: 'historic',
    rating: 4.9,
    reviewsCount: 38200,
    priceLevel: '$$',
    coordinates: { lat: 41.8902, lng: 12.4922 },
    address: 'Piazza del Colosseo, 1, 00184 Roma',
    imageUrl: '/src/assets/images/hero_wander_voyage_1792513873925.jpg',
    shortDesc: 'The largest ancient amphitheatre ever built, constructed with travertine limestone, tuff, and brick-faced concrete.',
    historyContent: 'Initiated under Emperor Vespasian in 72 AD to return public space to Roman citizens after Nero’s opulent Domus Aurea, the arena opened in 80 AD with 100 days of imperial games. Over 500,000 people and a million animals participated in gladiatorial contests, venationes (animal hunts), and simulated naval battles.',
    architecturalSignificance: 'The exterior features a four-tiered elevation embodying the classical orders: Doric (Tuscan) at ground level, Ionic on the second tier, and Corinthian on the third. The ingenious system of 80 arched entrances (vomitoria) allowed 50,000 citizens to empty the stadium in less than 15 minutes. The timber arena floor was covered in sand (harena in Latin, giving us the word arena) to absorb blood, covering an intricate two-story labyrinth called the hypogeum where cages, lifts, and trap doors held beasts and gladiators.',
    audioNarrationText: 'Stand before the southern rim of the Flavian Amphitheatre. Feel the vibration of stone that survived fires, barbarian sacks, and medieval stone robbers. Below the missing floor, gaze into the hypogeum tunnels where gladiators prepared under torches before being hoisted by counterweight pulleys into blinding Mediterranean sunlight.',
    insiderTips: [
      'Enter via the Sperone Valadier gate on the east side: security queues are generally 40% shorter than the main north queue.',
      'Visit between 16:30 and sunset when the travertine stones glow deep honey amber and tour crowds dissipate.',
      'Check out the ruins of the Ludus Magnus gladiator training school right across Via Labicana—visible for free from street level.'
    ],
    openingHours: '08:30 – 19:15 daily (last entry 1 hour before sunset)'
  },
  {
    id: 'sg2',
    name: 'Pantheon (Basilica of St. Mary and the Martyrs)',
    city: 'Rome',
    category: 'historic',
    rating: 4.8,
    reviewsCount: 29400,
    priceLevel: '$',
    coordinates: { lat: 41.8986, lng: 12.4769 },
    address: 'Piazza della Rotonda, 00186 Roma',
    imageUrl: '/src/assets/images/barcelona_gothic_1792513875059.jpg',
    shortDesc: 'The world’s best-preserved Roman monument featuring an extraordinary 43.3-meter unreinforced concrete rotunda.',
    historyContent: 'Originally erected by Marcus Agrippa in 27 BC following the Battle of Actium, the temple burned down twice and was entirely rebuilt in its current rotunda design by Emperor Hadrian circa 125 AD. Dedicated to all planetary gods, it was consecrated as a Catholic church in 609 AD by Pope Boniface IV, which famously saved it from demolition.',
    architecturalSignificance: 'The dome is an engineering triumph that astounded Renaissance architects including Brunelleschi and Michelangelo. The interior diameter (43.3 meters) exactly matches its interior height, forming a perfect sphere. The thickness of the concrete tapers from 6.4 meters at the drum base to just 1.2 meters around the 9-meter oculus. The Romans lightened the concrete mix as it rose by replacing heavy travertine aggregate with volcanic tuff, and finally lightweight pumice at the top.',
    audioNarrationText: 'Walk through the monolithic grey granite columns quarried in Egypt and transported across the Nile. Inside the cool chamber, lookup directly into the open 9-meter oculus. When rain falls in Rome, water droplets descend gracefully through the beam of light, draining through 22 concealed holes set into the gently sloping marble floor.',
    insiderTips: [
      'During noon on sunny days, the solar beam creates an intense spotlight moving across the marble altars like a giant celestial clock.',
      'Pay your respects at the tomb of master Renaissance painter Raphael (Raffaello Sanzio) on the left side: his epitaph reads "Here lies Raphael, by whom Nature feared to be outdone while he lived."',
      'Grab an iconic granita di caffè con panna just around the corner at Tazza d’Oro.'
    ],
    openingHours: '09:00 – 19:00 daily'
  },
  {
    id: 'sg3',
    name: 'Roscioli Salumeria con Cucina',
    city: 'Rome',
    category: 'food',
    rating: 4.9,
    reviewsCount: 4500,
    priceLevel: '$$$',
    coordinates: { lat: 41.8942, lng: 12.4735 },
    address: 'Via dei Giubbonari, 21, 00186 Roma',
    imageUrl: '/src/assets/images/culinary_local_table_1792513875904.jpg',
    shortDesc: 'World-renowned gastronomic temple combining an artisan charcuterie deli counter with Michelin-level Roman dining.',
    historyContent: 'Founded by the Roscioli baking family whose nearby Antico Forno has baked bread since 1824. Alessandro and Pierluigi Roscioli transformed their father’s delicatessen into an elite culinary showcase housing 300 types of cheese, 150 varieties of cured meats, and a cellar of 2,800 wine labels.',
    architecturalSignificance: 'Set in a traditional vaulted Roman shop where guests dine surrounded by hanging legs of 36-month Jamón Ibérico de Bellota, wheels of mountain Parmigiano Reggiano, and floor-to-ceiling vintage Brunello bottles.',
    audioNarrationText: 'Listen to the rhythmic click of slicing prosciutto and the aroma of freshly toasted sourdough. Here, the humble Roman pasta is elevated to an art form through single-origin Kampot black pepper, crispy Conero guanciale, and creamy egg yolk emulsion.',
    insiderTips: [
      'Book your table at least 3 weeks in advance; if fully booked, ask for a high stool at the salami counter for walk-in availability at 12:30.',
      'Order the tasting of three burratas paired with Cantabrian anchovies and semi-dried Sicilian datterini tomatoes.',
      'Save room for their house tiramisu served with artisan espresso.'
    ],
    signatureItems: ['Spaghetti alla Carbonara with smoked Guanciale', 'Burrata Pugliese with Anchovies', 'Cacio e Pepe with three aged pecorinos', 'Mortadella di Bologna with White Truffle'],
    openingHours: '12:30 – 16:00, 19:00 – 23:30 (Closed Sundays)'
  },
  {
    id: 'sg4',
    name: 'Pizzarium Bonci',
    city: 'Rome',
    category: 'food',
    rating: 4.8,
    reviewsCount: 8900,
    priceLevel: '$',
    coordinates: { lat: 41.9079, lng: 12.4485 },
    address: 'Via della Meloria, 43, 00136 Roma (Prati / Cipro Metro)',
    imageUrl: '/src/assets/images/culinary_local_table_1792513875904.jpg',
    shortDesc: 'The legendary "Michelangelo of Pizza" Gabriele Bonci’s laboratory for Roman pizza al taglio.',
    historyContent: 'Gabriele Bonci revolutionized Roman street food by treating pizza dough with the biological precision of a sourdough baker, utilizing heritage organic stone-ground flours and a 72-hour cold fermentation process.',
    architecturalSignificance: 'A bustling neighborhood counter with no formal seating. Customers take a numbered ticket, order by pointing at fresh trays, and watch the pizzaiolo snip portions with heavy kitchen shears and weigh them on antique digital scales.',
    audioNarrationText: 'The crust here is an engineering marvel: airy, honeycomb pockets of fermented dough with a wafer-thin golden crust underneath that supports complex seasonal toppings without sagging.',
    insiderTips: [
      'Take Metro Line A to Cipro station; it is literally 200 meters from the exit—ideal right after touring the Vatican Museums.',
      'Always order 3-4 small slices rather than one large piece so you can sample exotic seasonal toppings.',
      'Do not miss their fried supplì (risotto croquette with melting smoked mozzarella core).'
    ],
    signatureItems: ['Potato & Rosemary with Fior di Latte', 'Roast Pork Belly with Crispy Crackling & Wild Fennel', 'Zucchini Blossoms with Anchovy & Stracciatella', 'Classic Supplì al Telefono'],
    openingHours: '11:00 – 22:00 daily'
  }
];

export const INITIAL_EXPENSES: Expense[] = [
  { id: 'e1', title: 'Palazzo Navona Hotel Booking (Deposit)', amount: 490, category: 'lodging', paidById: 'm1', date: '2026-10-18', splitWithIds: ['m1', 'm2', 'm3', 'm4'], notes: 'Initial 2-night group deposit' },
  { id: 'e2', title: 'Leonardo Express Rail Tickets (x4)', amount: 56, category: 'transport', paidById: 'm2', date: '2026-10-19', splitWithIds: ['m1', 'm2', 'm3', 'm4'], notes: 'Airport to Termini train tickets' },
  { id: 'e3', title: 'Colosseum & Forum Priority Pass (x4)', amount: 144, category: 'activities', paidById: 'm1', date: '2026-10-19', splitWithIds: ['m1', 'm2', 'm3', 'm4'], notes: 'Skip the line morning entry' },
  { id: 'e4', title: 'Roscioli Salumeria Tasting Dinner', amount: 240, category: 'food', paidById: 'm2', date: '2026-10-20', splitWithIds: ['m1', 'm2', 'm3', 'm4'], notes: 'Carbonara, cured meats & Chianti Classico' },
  { id: 'e5', title: 'Vespa 125cc Daily Rental for Sunset', amount: 65, category: 'transport', paidById: 'm3', date: '2026-10-20', splitWithIds: ['m1', 'm2', 'm3', 'm4'], notes: 'Scenic ride along Appian Way' },
];

export const INITIAL_CHAT_MESSAGES: ChatMessage[] = [
  {
    id: 'c1',
    senderId: 'm1',
    senderName: 'Alex Rivers',
    senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    timestamp: '09:15 AM',
    text: 'Morning crew! I just confirmed our priority tickets for the Colosseum Day 1 at 09:00. Make sure everyone has their passports on them for identity checks at security.'
  },
  {
    id: 'c2',
    senderId: 'm2',
    senderName: 'Elena Rostova',
    senderAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    timestamp: '09:22 AM',
    text: 'Awesome! I booked the Leonardo Express from Fiumicino for all four of us. The train departs right from the terminal.',
  },
  {
    id: 'c3',
    senderId: 'm3',
    senderName: 'Marcus Chen',
    senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    timestamp: '09:30 AM',
    text: 'I downloaded our offline map pack for Rome so we won’t get lost even in the cobblestone alleyways without cell reception.',
    isLocation: true,
    locationCoords: { lat: 41.8902, lng: 12.4922 }
  },
  {
    id: 'c4',
    senderId: 'm4',
    senderName: 'Sophia Martinez',
    senderAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    timestamp: '09:40 AM',
    text: 'Quick poll: for our second night dinner, do we prefer authentic pasta in Trastevere or a rooftop dinner near Campo de’ Fiori?',
    poll: {
      question: 'Where should we dine on Night 2?',
      options: [
        { text: 'Trastevere Rustic Trattoria', votes: 3, votedBy: ['m1', 'm2', 'm4'] },
        { text: 'Campo de’ Fiori Rooftop', votes: 1, votedBy: ['m3'] }
      ]
    }
  }
];

export const INITIAL_GALLERY_PHOTOS: GalleryPhoto[] = [
  {
    id: 'p1',
    uploaderId: 'm1',
    uploaderName: 'Alex Rivers',
    uploaderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    imageUrl: '/src/assets/images/hero_wander_voyage_1792513873925.jpg',
    caption: 'Sunset over the Roman Forum from Palatine Hill. Unbelievable golden light.',
    location: 'Palatine Terrace, Rome',
    date: 'Oct 20, 2026',
    likes: 14,
    likedByMe: true
  },
  {
    id: 'p2',
    uploaderId: 'm2',
    uploaderName: 'Elena Rostova',
    uploaderAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    imageUrl: '/src/assets/images/culinary_local_table_1792513875904.jpg',
    caption: 'Fresh burrata, artisan pasta, and regional Chianti in our Trastevere courtyard.',
    location: 'Roscioli Salumeria, Rome',
    date: 'Oct 20, 2026',
    likes: 22,
    likedByMe: false
  },
  {
    id: 'p3',
    uploaderId: 'm3',
    uploaderName: 'Marcus Chen',
    uploaderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    imageUrl: '/src/assets/images/boutique_hotel_suite_1792513875258.jpg',
    caption: 'Our boutique hotel balcony looking right into Piazza Navona morning life.',
    location: 'Palazzo Navona Hotel, Rome',
    date: 'Oct 20, 2026',
    likes: 19,
    likedByMe: true
  },
  {
    id: 'p4',
    uploaderId: 'm4',
    uploaderName: 'Sophia Martinez',
    uploaderAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    imageUrl: '/src/assets/images/barcelona_gothic_1792513875059.jpg',
    caption: 'Getting lost through the ancient medieval stone passageways at twilight.',
    location: 'Gothic Quarter, Barcelona',
    date: 'Oct 19, 2026',
    likes: 31,
    likedByMe: false
  }
];

export const INITIAL_SOCIAL_POSTS: SocialPost[] = [
  {
    id: 'sp1',
    author: 'Clara Beaumont',
    authorAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    destination: 'Rome, Italy',
    date: '2 days ago',
    title: 'How our group navigated Rome without stress (and saved 40% on dining)',
    story: 'We just finished a 5-day group expedition in Rome. Our top discovery: avoid the tourist menus in front of the monuments. Walk 3 blocks into Trastevere or Testaccio. Use the offline map mode when entering the underground Roman houses beneath Palazzo Valentini!',
    imageUrl: '/src/assets/images/hero_wander_voyage_1792513873925.jpg',
    tags: ['#GroupTravel', '#RomeItinerary', '#HiddenGems', '#BudgetTravel'],
    likes: 142,
    likedByMe: false,
    commentsCount: 18,
    comments: [
      { user: 'Liam Traveler', text: 'Did you need reservations for the underground houses?', time: '1 day ago' },
      { user: 'Clara Beaumont', text: 'Yes! Book at least 2 weeks ahead online.', time: '18h ago' }
    ]
  },
  {
    id: 'sp2',
    author: 'Kenji Takahashi',
    authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    destination: 'Kyoto, Japan',
    date: '4 days ago',
    title: 'The early dawn secret of Fushimi Inari and Arashiyama bamboo paths',
    story: 'If you want serene photos without shoulder-to-shoulder crowds, arrive at Fushimi Inari at 06:15 AM. The soft morning mist clinging to the orange Torii gates feels truly transcendent. Then take the local Keifuku tram to Arashiyama.',
    imageUrl: '/src/assets/images/kyoto_scenic_shrine_1792513874654.jpg',
    tags: ['#KyotoWalks', '#MorningLight', '#SoloAndGroup', '#JapanTravel'],
    likes: 289,
    likedByMe: true,
    commentsCount: 34,
    comments: [
      { user: 'Maya Lin', text: 'The Keifuku electric railway is such a charming retro vibe!', time: '3 days ago' }
    ]
  },
  {
    id: 'sp3',
    author: 'Mateo Hernandez',
    authorAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    destination: 'Barcelona, Spain',
    date: '1 week ago',
    title: 'Architectural immersion: Gaudí’s hidden rooftop secrets',
    story: 'Casa Batlló and Casa Milà are stunning, but visiting the rooftop dragon spine at sunset while classical acoustic guitar plays in the inner courtyard was the highlight of our entire European voyage.',
    imageUrl: '/src/assets/images/barcelona_gothic_1792513875059.jpg',
    tags: ['#Barcelona', '#Modernisme', '#GaudiArchitecture', '#Spain'],
    likes: 310,
    likedByMe: false,
    commentsCount: 27,
    comments: [
      { user: 'Elena Rostova', text: 'Adding this to our next trip itinerary right now!', time: '5 days ago' }
    ]
  }
];

export const INITIAL_BOOKINGS: BookingReceipt[] = [
  {
    id: 'b1',
    itemType: 'hotel',
    title: 'Palazzo Navona Heritage Hotel — Deluxe Courtyard King',
    date: '2026-10-24 to 2026-10-27 (3 Nights)',
    guests: 4,
    totalAmount: 735,
    currency: 'USD',
    status: 'confirmed',
    bookingCode: 'WS-ROME-782194',
    paymentMethod: 'Visa •••• 4242',
    cardLastFour: '4242',
    bookedAt: '2026-10-18 14:32',
    qrCodeMock: 'WS-QR-CONFIRMED-89104'
  },
  {
    id: 'b2',
    itemType: 'transit',
    title: 'Leonardo Express FCO Airport to Termini (x4 Group Pass)',
    date: '2026-10-24 09:15',
    guests: 4,
    totalAmount: 56,
    currency: 'USD',
    status: 'confirmed',
    bookingCode: 'WS-TRN-994102',
    paymentMethod: 'Apple Pay',
    cardLastFour: '8819',
    bookedAt: '2026-10-19 10:11',
    qrCodeMock: 'WS-QR-CONFIRMED-99410'
  }
];

export const INITIAL_PACKING_ITEMS: PackingItem[] = [
  // Essentials & Documents
  { id: 'pk-1', name: 'Passports & Valid IDs (physical + digital copy)', category: 'essentials', packed: true, notes: 'Required at Colosseum security' },
  { id: 'pk-2', name: 'International Driving Permit (IDP)', category: 'essentials', assignedToId: 'm3', packed: true, notes: 'Required for Vespa rental' },
  { id: 'pk-3', name: 'Printed & Offline Hotel/Transit Vouchers', category: 'essentials', assignedToId: 'm1', packed: true },
  
  // Clothing & Footwear
  { id: 'pk-4', name: 'Cushioned Cobblestone Walking Shoes', category: 'clothing', packed: true, notes: 'Rome averages 14,000+ steps/day' },
  { id: 'pk-5', name: 'Modesty Scarf / Shoulder Wrap', category: 'clothing', packed: false, notes: 'Mandatory for Vatican Basilica & Pantheon dress codes' },
  { id: 'pk-6', name: 'Breathable Merino Wool Layers', category: 'clothing', packed: false, notes: 'Ideal for 14°C morning to 23°C afternoon swings' },

  // Electronics & Hardware
  { id: 'pk-7', name: 'Type C / F European Plug Adapters (x2)', category: 'electronics', packed: true },
  { id: 'pk-8', name: '20,000 mAh High-Speed Power Bank', category: 'electronics', assignedToId: 'm2', packed: true, notes: 'Keep navigation & audio tours active all day' },
  { id: 'pk-9', name: 'Compact Noise-Canceling Earbuds', category: 'electronics', packed: false, notes: 'For audio tours in busy museums' },

  // Weather-Triggered Gear (Dynamic recommendation based on forecast)
  { id: 'pk-10', name: 'Ultralight Packable Windproof Umbrella', category: 'weather', weatherTriggered: true, packed: false, notes: 'Suggested for 35% chance of light afternoon showers on Day 2' },
  { id: 'pk-11', name: 'Water-Resistant Shell Jacket', category: 'weather', weatherTriggered: true, packed: true, notes: 'Recommended for evening Tiber strolls' },
  { id: 'pk-12', name: 'Polarized Sunglasses & Mineral Sunscreen', category: 'weather', weatherTriggered: true, packed: false, notes: 'High UV exposure at Roman Forum ruins' },

  // Group Shared Gear (One person carries for the whole team!)
  { id: 'pk-13', name: 'Compact Travel First Aid & Blister Kit', category: 'group', assignedToId: 'm1', packed: true, notes: 'Shared group medical pouch' },
  { id: 'pk-14', name: 'Universal 4-Port USB-C Charging Hub', category: 'group', assignedToId: 'm2', packed: true, notes: 'Charges all phones from one hotel outlet' },
  { id: 'pk-15', name: 'Portable Stainless Steel Wine/Cork Opener', category: 'group', assignedToId: 'm3', packed: true, notes: 'For sunset wine picnics on Aventine Hill' }
];

export const MOCK_WEATHER_FORECAST: WeatherDay[] = [
  {
    date: '2026-10-24',
    dayName: 'Saturday (Day 1)',
    tempHigh: 23,
    tempLow: 14,
    condition: 'sunny',
    rainProbability: 5,
    windKmH: 11,
    uvIndex: 5,
    humidity: 58,
    activityAdvice: 'Brilliant clear skies. Perfect conditions for outdoor exploration of Colosseum, Palatine Hill, and sunset at Trevi.',
    packingTip: 'Wear breathable layers and UV protection; carry a refillable water bottle for Roman street fountains (nasoni).',
    hourly: [
      { time: '09:00', temp: 16, condition: 'sunny', rainProbability: 0 },
      { time: '12:00', temp: 22, condition: 'sunny', rainProbability: 0 },
      { time: '15:00', temp: 23, condition: 'sunny', rainProbability: 5 },
      { time: '18:00', temp: 19, condition: 'sunny', rainProbability: 0 },
      { time: '21:00', temp: 15, condition: 'sunny', rainProbability: 0 },
    ]
  },
  {
    date: '2026-10-25',
    dayName: 'Sunday (Day 2)',
    tempHigh: 21,
    tempLow: 15,
    condition: 'partly_cloudy',
    rainProbability: 35,
    windKmH: 16,
    uvIndex: 4,
    humidity: 68,
    activityAdvice: 'Scattered afternoon cloud cover with a brief 30-minute light shower around 16:00. Time indoor Vatican galleries during the sprinkle.',
    packingTip: 'Pack your compact umbrella or light rain shell in your daypack before leaving the hotel.',
    hourly: [
      { time: '09:00', temp: 16, condition: 'partly_cloudy', rainProbability: 10 },
      { time: '12:00', temp: 20, condition: 'partly_cloudy', rainProbability: 20 },
      { time: '15:00', temp: 21, condition: 'rain', rainProbability: 35 },
      { time: '18:00', temp: 18, condition: 'partly_cloudy', rainProbability: 15 },
      { time: '21:00', temp: 16, condition: 'cloudy', rainProbability: 10 },
    ]
  },
  {
    date: '2026-10-26',
    dayName: 'Monday (Day 3)',
    tempHigh: 22,
    tempLow: 13,
    condition: 'sunny',
    rainProbability: 0,
    windKmH: 9,
    uvIndex: 5,
    humidity: 52,
    activityAdvice: 'Crisp golden autumn light. Excellent for cycling through Villa Borghese gardens and rooftop aperitivo.',
    packingTip: 'Light cardigan or jacket for twilight breeze on the Pincio terrace overlooking Piazza del Popolo.',
    hourly: [
      { time: '09:00', temp: 15, condition: 'sunny', rainProbability: 0 },
      { time: '12:00', temp: 21, condition: 'sunny', rainProbability: 0 },
      { time: '15:00', temp: 22, condition: 'sunny', rainProbability: 0 },
      { time: '18:00', temp: 18, condition: 'sunny', rainProbability: 0 },
      { time: '21:00', temp: 14, condition: 'sunny', rainProbability: 0 },
    ]
  },
  {
    date: '2026-10-27',
    dayName: 'Tuesday (Day 4)',
    tempHigh: 20,
    tempLow: 13,
    condition: 'partly_cloudy',
    rainProbability: 10,
    windKmH: 12,
    uvIndex: 4,
    humidity: 60,
    activityAdvice: 'Pleasant temperatures for artisan shopping in Monti and walking the ancient Roman Appian Way.',
    packingTip: 'Sturdy walking shoes recommended for unpaved Roman basalt carriage stones.',
    hourly: [
      { time: '09:00', temp: 14, condition: 'partly_cloudy', rainProbability: 5 },
      { time: '12:00', temp: 19, condition: 'partly_cloudy', rainProbability: 10 },
      { time: '15:00', temp: 20, condition: 'sunny', rainProbability: 5 },
      { time: '18:00', temp: 17, condition: 'partly_cloudy', rainProbability: 5 },
      { time: '21:00', temp: 14, condition: 'partly_cloudy', rainProbability: 5 },
    ]
  },
  {
    date: '2026-10-28',
    dayName: 'Wednesday (Day 5)',
    tempHigh: 21,
    tempLow: 14,
    condition: 'sunny',
    rainProbability: 5,
    windKmH: 10,
    uvIndex: 4,
    humidity: 55,
    activityAdvice: 'Clear warm morning. Perfect for farewell breakfast espresso on Piazza Navona and airport departure.',
    packingTip: 'Ensure all liquids over 100ml are transferred to checked luggage before airport transfer.',
    hourly: [
      { time: '09:00', temp: 15, condition: 'sunny', rainProbability: 0 },
      { time: '12:00', temp: 21, condition: 'sunny', rainProbability: 0 },
      { time: '15:00', temp: 21, condition: 'sunny', rainProbability: 0 },
      { time: '18:00', temp: 18, condition: 'sunny', rainProbability: 0 },
      { time: '21:00', temp: 15, condition: 'sunny', rainProbability: 0 },
    ]
  }
];

export const MOCK_CURRENCY_RATES: CurrencyRate[] = [
  { code: 'EUR', name: 'Euro', symbol: '€', rateToUSD: 0.92, flag: '🇪🇺' },
  { code: 'USD', name: 'US Dollar', symbol: '$', rateToUSD: 1.00, flag: '🇺🇸' },
  { code: 'GBP', name: 'British Pound', symbol: '£', rateToUSD: 0.79, flag: '🇬🇧' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥', rateToUSD: 152.4, flag: '🇯🇵' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'CA$', rateToUSD: 1.38, flag: '🇨🇦' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', rateToUSD: 1.51, flag: '🇦🇺' },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF', rateToUSD: 0.88, flag: '🇨🇭' }
];

export const MOCK_PRICE_ANCHORS = [
  { item: 'Counter Espresso (Caffè al banco)', priceEur: 1.30, category: 'Food & Drink' },
  { item: 'Sit-down Cappuccino & Cornetto', priceEur: 3.50, category: 'Food & Drink' },
  { item: 'Pizza al Taglio (Generous Slice)', priceEur: 4.80, category: 'Food & Drink' },
  { item: 'Artisanal Gelato (2 Flavors)', priceEur: 3.50, category: 'Food & Drink' },
  { item: 'Trattoria House Wine (1/2 Liter)', priceEur: 7.00, category: 'Food & Drink' },
  { item: 'Single Metro / Bus Ticket (100 min)', priceEur: 1.50, category: 'Transportation' },
  { item: 'City Center Taxi Flat Rate (Night)', priceEur: 15.00, category: 'Transportation' },
  { item: 'Vatican Museums Ticket + Audio', priceEur: 27.00, category: 'Activities' },
];

export const INITIAL_FLIGHTS: FlightStatus[] = [
  {
    id: 'fl-1',
    flightNumber: 'AZ 611',
    airline: 'ITA Airways',
    departureCity: 'New York (JFK)',
    departureAirport: 'JFK',
    departureTerminal: 'Terminal 1',
    departureGate: 'Gate 4',
    departureTime: '21:30 (Oct 23)',
    arrivalCity: 'Rome (FCO)',
    arrivalAirport: 'FCO',
    arrivalTerminal: 'Terminal 3',
    arrivalGate: 'Gate E14',
    arrivalTime: '08:45 AM (Oct 24)',
    status: 'in_air',
    progressPercent: 78,
    aircraft: 'Airbus A350-900',
    altitudeFeet: 37000,
    speedMph: 550,
    duration: '8h 15m',
    travelerNames: ['Alex Rivers', 'Elena Rostova'],
    baggageClaim: 'Carousel 8'
  },
  {
    id: 'fl-2',
    flightNumber: 'DL 182',
    airline: 'Delta Air Lines',
    departureCity: 'Atlanta (ATL)',
    departureAirport: 'ATL',
    departureTerminal: 'International Concourse F',
    departureGate: 'Gate F7',
    departureTime: '20:15 (Oct 23)',
    arrivalCity: 'Rome (FCO)',
    arrivalAirport: 'FCO',
    arrivalTerminal: 'Terminal 3',
    arrivalGate: 'Gate E22',
    arrivalTime: '09:15 AM (Oct 24)',
    status: 'in_air',
    progressPercent: 64,
    aircraft: 'Boeing 767-400ER',
    altitudeFeet: 35000,
    speedMph: 535,
    duration: '9h 00m',
    travelerNames: ['Marcus Chen'],
    baggageClaim: 'Carousel 8'
  },
  {
    id: 'fl-3',
    flightNumber: 'BA 548',
    airline: 'British Airways',
    departureCity: 'London (LHR)',
    departureAirport: 'LHR',
    departureTerminal: 'Terminal 5',
    departureGate: 'Gate A12',
    departureTime: '06:40 (Oct 24)',
    arrivalCity: 'Rome (FCO)',
    arrivalAirport: 'FCO',
    arrivalTerminal: 'Terminal 3',
    arrivalGate: 'Gate D06',
    arrivalTime: '09:30 AM (Oct 24)',
    status: 'boarding',
    progressPercent: 5,
    aircraft: 'Airbus A321neo',
    duration: '2h 50m',
    travelerNames: ['Sophia Martinez'],
    baggageClaim: 'Carousel 6'
  }
];

export const INITIAL_DIARY_ENTRIES: DiaryEntry[] = [
  {
    id: 'de-1',
    title: 'First Glimpse of Imperial Rome & Sunset at the Forum',
    date: '2026-10-24',
    dayNumber: 1,
    location: 'Colosseum & Palatine Belvedere, Rome',
    mood: 'inspired',
    weatherSnippet: '23°C · Warm Golden Afternoon Light',
    photoUrl: '/src/assets/images/hero_wander_voyage_1792513873925.jpg',
    content: 'Nothing prepares you for stepping out of the Colosseo metro station and suddenly having 2,000 years of monolithic travertine arches towering directly over your head. Elena and I stood motionless on the upper terrace while the sun dipped behind the Arch of Titus. The stone felt alive with centuries of whispered history. Tomorrow morning we tackle the underground hypogeum vaults.',
    isPrivate: false,
    createdAt: '18:45 PM'
  },
  {
    id: 'de-2',
    title: 'Artisan Carbonara Pilgrimage in Trastevere',
    date: '2026-10-24',
    dayNumber: 1,
    location: 'Roscioli Salumeria con Cucina, Via dei Giubbonari',
    mood: 'culinary',
    weatherSnippet: '18°C · Soft Twilight Evening',
    photoUrl: '/src/assets/images/culinary_local_table_1792513875904.jpg',
    content: 'A true gastronomic milestone. The single-origin Kampot pepper paired with crisp Conero guanciale created a velvet emulsion unlike any pasta I have ever tasted in my life. Marcus and Sophia joined us after their flights landed, and we toasted our trip with regional Cesanese red wine while accordion notes drifted in from the piazza.',
    isPrivate: false,
    createdAt: '22:15 PM'
  }
];


