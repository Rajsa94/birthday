import initialBirthday from '../data/birthday.json';
import initialGuests from '../data/guests.json';
import initialTables from '../data/tables.json';
import { OCCASIONS_CATALOG } from '../data/occasionsCatalog';
import { getThemeById } from '../themes/themeCatalog';
import { recalculateTableOccupancy } from './seating';
import { formatDisplayDate, formatDisplayTime } from './storage';

const STORAGE_KEYS = {
  OCCASIONS: 'platform_occasions_v1',
  ACTIVE_OCCASION_ID: 'platform_active_occasion_id_v1',
  GUESTS: 'platform_multi_guests_v1',
  TABLES: 'platform_multi_tables_v1',
  AUTH: 'birthday_app_admin_auth_v1',
};

/**
 * Initial Seed Occasions
 */
export function createDefaultSeedOccasions() {
  return [
    // 1. Aria's Birthday (Preserves all existing user birthday data)
    {
      id: 'occasion-birthday-1',
      occasionType: 'birthday',
      occasionName: "Aria's 25th Birthday Bash",
      title: "Aria's 25th Milestone Birthday Bash",
      tagline: 'A Silver Jubilee Celebration of Elegance, Laughter & Joy',
      personName: 'Aria Sharma',
      age: '25',
      hostName: 'Aria Sharma',
      eventDate: initialBirthday.birthdayDate || '2026-12-18',
      partyStartTime: initialBirthday.partyStartTime || '19:00',
      partyEndTime: initialBirthday.partyEndTime || '23:30',
      venueName: initialBirthday.venueName || 'The Grand Crystal Ballroom',
      venueAddress: initialBirthday.venueAddress || 'Royal Orchid Palace, 108 Boulevard Heights, Indiranagar, Bengaluru, Karnataka 560038',
      googleMapsUrl: initialBirthday.googleMapsUrl || 'https://maps.google.com/?q=The+Grand+Crystal+Ballroom+Bengaluru',
      invitationMessage: initialBirthday.invitationMessage || "Join us under the shimmering chandeliers for an unforgettable evening of joy, live music, gourmet dining, and celebratory toasts as we celebrate Aria's 25th Birthday in style!",
      hostContact: initialBirthday.hostContact || '9876543210',
      dressCode: 'Festive Glam / Cocktail Attire',
      themeId: 'birthday-purple-pink',
      profileImage: initialBirthday.profileImage || initialBirthday.photoUrl || '',
      cakeImage: initialBirthday.cakeImage || '',
      backgroundImage: initialBirthday.backgroundImage || '',
      isActive: true,
      seatingEnabled: true,
      galleryImages: initialBirthday.galleryImages || [],
      customFields: [],
      createdAt: '2026-11-20T10:00:00',
    },

    // 2. Ananya & Vikram's Royal Wedding
    {
      id: 'occasion-wedding-2',
      occasionType: 'wedding',
      occasionName: "Ananya & Vikram's Royal Vivaah",
      title: "The Royal Wedding of Ananya & Vikramaditya",
      tagline: 'Two Souls, Two Families, Bound by Sacred Vows Under Royal Skies',
      brideName: 'Ananya Deshmukh',
      groomName: 'Vikramaditya Rathore',
      hostName: 'Deshmukh & Rathore Families',
      eventDate: '2026-12-28',
      partyStartTime: '18:00',
      partyEndTime: '23:45',
      venueName: 'The Umaid Heritage Palace & Gardens',
      venueAddress: 'Palace Road, Circuit House Hill, Jodhpur, Rajasthan 342006',
      googleMapsUrl: 'https://maps.google.com/?q=Umaid+Heritage+Palace+Jodhpur',
      invitationMessage: 'With the divine blessings of Lord Ganesha and our elders, we cordially invite you and your family to celebrate the sacred wedding of our beloved Ananya and Vikramaditya.',
      hostContact: '9845123456',
      dressCode: 'Traditional Indian / Royal Ethnic Finery',
      themeId: 'wedding-royal-red',
      profileImage: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80',
      secondaryImage: 'https://images.unsplash.com/photo-1607190074257-dd4b7af0309f?auto=format&fit=crop&w=800&q=80',
      backgroundImage: '',
      isActive: true,
      seatingEnabled: true,
      eventSchedule: [
        { title: 'Mehendi & Sangeet Night', date: '2026-12-27', time: '06:30 PM', venue: 'Palace Poolside Courtyard' },
        { title: 'Haldi & Chooda Ceremony', date: '2026-12-28', time: '10:00 AM', venue: 'Royal Zharokha Gardens' },
        { title: 'Baraat & Varmala', date: '2026-12-28', time: '06:00 PM', venue: 'Grand Grand Mandap' },
        { title: 'Royal Dinner & Reception', date: '2026-12-28', time: '08:30 PM', venue: 'Grand Crystal Banquets' },
      ],
      galleryImages: [
        { id: 101, url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=700&q=80', caption: 'Pre-Wedding Royal Shoot in Udaipur' },
        { id: 102, url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=700&q=80', caption: 'The Engagement Gala & Sunset Vows' },
      ],
      customFields: [],
      createdAt: '2026-11-21T11:00:00',
    },

    // 3. Sharma Family Diwali Utsav
    {
      id: 'occasion-diwali-3',
      occasionType: 'diwali',
      occasionName: 'Sharma Family Grand Diwali Utsav',
      title: 'Festival of Lights & Prosperity 2026',
      tagline: 'Illuminating Hearts with Sacred Diyas, Sweet Blessings & Joyous Festivities',
      hostName: 'The Sharma & Verma Family',
      eventDate: '2026-11-08',
      pujaTime: '18:30',
      partyStartTime: '18:00',
      partyEndTime: '22:30',
      venueName: 'Shanti Villa Courtyard & Terrace Gardens',
      venueAddress: 'Plot 42, Palm Meadows, Whitefield, Bengaluru, Karnataka 560066',
      googleMapsUrl: 'https://maps.google.com/?q=Whitefield+Bengaluru',
      invitationMessage: 'May the sacred light of Deepavali illuminate your home with boundless prosperity, health, and happiness. Join us for Lakshmi Puja, Rangoli showcases, musical night, and celebratory festive dinner!',
      hostContact: '9811223344',
      dressCode: 'Bright Traditional Kurtas & Festive Sarees',
      themeId: 'diwali-gold-purple',
      profileImage: 'https://images.unsplash.com/photo-1605647540924-852290f6b0d5?auto=format&fit=crop&w=800&q=80',
      backgroundImage: '',
      isActive: true,
      seatingEnabled: false,
      galleryImages: [],
      customFields: [],
      createdAt: '2026-11-22T09:00:00',
    },

    // 4. Dr. Varma's Retirement Gala
    {
      id: 'occasion-retirement-4',
      occasionType: 'retirement',
      occasionName: "Dr. R. K. Varma's Golden Retirement Gala",
      title: "Honoring 36 Years of Dedicated Service & Leadership",
      tagline: 'A Salute to Excellence, Wisdom & a Distinguished Career Journey',
      employeeName: 'Dr. Ramesh Kumar Varma',
      designation: 'Senior Vice President & Chief Medical Officer',
      companyName: 'Apollo Global Healthcare Institutions',
      yearsOfService: '36',
      hostName: 'Varma Family & Department Colleagues',
      eventDate: '2027-01-15',
      partyStartTime: '18:30',
      partyEndTime: '22:00',
      venueName: 'The Imperial Ballroom, Taj West End',
      venueAddress: '25 Race Course Road, High Grounds, Bengaluru, Karnataka 560001',
      googleMapsUrl: 'https://maps.google.com/?q=Taj+West+End+Bengaluru',
      invitationMessage: 'We warmly invite you to an evening of tribute, fond reminiscences, and celebratory toasts as we honor Dr. R. K. Varma on his remarkable and inspiring 36-year career.',
      hostContact: '9731234567',
      dressCode: 'Formal Suit / Executive Black Tie / Elegant Saree',
      themeId: 'retirement-navy-gold',
      profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
      backgroundImage: '',
      isActive: true,
      seatingEnabled: true,
      careerMilestones: [
        { year: '1991', title: 'Joined as Chief Resident Physician' },
        { year: '2004', title: 'Appointed Head of Cardiology & Research' },
        { year: '2015', title: 'Conferred National Lifetime Medical Fellowship' },
        { year: '2020', title: 'Promoted to Chief Medical Officer & Board Director' },
      ],
      galleryImages: [],
      customFields: [],
      createdAt: '2026-11-23T14:00:00',
    },

    // 5. Priya & Rahul's 25th Anniversary
    {
      id: 'occasion-anniversary-5',
      occasionType: 'anniversary',
      occasionName: "Priya & Rahul's Silver Jubilee Anniversary",
      title: '25 Years of Unconditional Love, Smiles & Togetherness',
      tagline: 'A Quarter-Century of Beautiful Memories, Laughter & Growing Together',
      coupleNames: 'Priya & Rahul Kapoor',
      anniversaryMilestone: '25th Silver Jubilee',
      hostName: 'Kapoor Children & Family',
      eventDate: '2027-02-14',
      partyStartTime: '19:30',
      partyEndTime: '23:30',
      venueName: 'The Skyview Terrace, Four Seasons Hotel',
      venueAddress: '8 Bellary Road, Ganganagar, Bengaluru, Karnataka 560032',
      googleMapsUrl: 'https://maps.google.com/?q=Four+Seasons+Hotel+Bengaluru',
      invitationMessage: '25 years of shared dreams, adventures, and endless joy! Please join our parents Priya & Rahul to raise a champagne toast to their Silver Jubilee wedding anniversary.',
      hostContact: '9845012345',
      dressCode: 'Rose Gold & Cocktail Glam',
      themeId: 'anniversary-rose-gold',
      profileImage: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=800&q=80',
      backgroundImage: '',
      isActive: true,
      seatingEnabled: true,
      galleryImages: [],
      customFields: [],
      createdAt: '2026-11-24T10:00:00',
    },
  ];
}

/**
 * Initializes and retrieves all occasions from LocalStorage
 */
export function getStoredOccasions() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.OCCASIONS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        const valid = parsed.filter(o => o && o.id);
        if (valid.length > 0) {
          return valid.map(enrichOccasionDates);
        }
      }
    }
  } catch (e) {
    console.error('Error reading occasions from storage', e);
  }

  const defaults = createDefaultSeedOccasions().map(enrichOccasionDates);
  saveStoredOccasions(defaults);
  return defaults;
}

export function saveStoredOccasions(occasions) {
  try {
    localStorage.setItem(STORAGE_KEYS.OCCASIONS, JSON.stringify(occasions));
  } catch (e) {
    console.error('Error saving occasions to storage', e);
  }
}

/**
 * Enriches occasion with formatted display strings for date & time
 */
export function enrichOccasionDates(occ) {
  const displayDate = occ.displayDate || formatDisplayDate(occ.eventDate);
  const displayTime = occ.displayTime || formatDisplayTime(occ.partyStartTime || occ.eventTime, occ.partyEndTime);
  return {
    ...occ,
    displayDate,
    displayTime,
    eventDateTime: occ.eventDate && occ.partyStartTime ? `${occ.eventDate}T${occ.partyStartTime}:00` : occ.eventDateTime,
  };
}

/**
 * Retrieves a single occasion by ID
 */
export function getOccasionById(id) {
  const occasions = getStoredOccasions();
  return occasions.find(o => String(o.id) === String(id)) || occasions[0];
}

/**
 * Gets currently active occasion ID
 */
export function getActiveOccasionId() {
  try {
    const active = localStorage.getItem(STORAGE_KEYS.ACTIVE_OCCASION_ID);
    if (active) return active;
  } catch (e) {}
  const occasions = getStoredOccasions();
  return occasions[0]?.id || 'occasion-birthday-1';
}

export function setActiveOccasionId(id) {
  try {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_OCCASION_ID, String(id));
  } catch (e) {}
}

/**
 * Creates a new occasion
 */
export function createOccasion(newOccasionData) {
  const occasions = getStoredOccasions();
  const occCatalog = OCCASIONS_CATALOG.find(c => c.id === newOccasionData.occasionType) || OCCASIONS_CATALOG[0];

  const id = `occasion-${newOccasionData.occasionType}-${Date.now().toString().slice(-5)}`;
  const defaultTheme = getThemeById(occCatalog.defaultThemeId, newOccasionData.occasionType);

  const newOccasion = enrichOccasionDates({
    id,
    occasionType: newOccasionData.occasionType || 'birthday',
    occasionName: newOccasionData.occasionName || occCatalog.name,
    title: newOccasionData.title || `${occCatalog.name} Celebration`,
    tagline: newOccasionData.tagline || occCatalog.description,
    hostName: newOccasionData.hostName || 'The Host Family',
    eventDate: newOccasionData.eventDate || new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0],
    partyStartTime: newOccasionData.partyStartTime || '19:00',
    partyEndTime: newOccasionData.partyEndTime || '23:00',
    venueName: newOccasionData.venueName || 'The Grand Ballroom',
    venueAddress: newOccasionData.venueAddress || 'Royal Hotel & Banquets',
    googleMapsUrl: newOccasionData.googleMapsUrl || '',
    invitationMessage: newOccasionData.invitationMessage || `You are cordially invited to celebrate ${occCatalog.name} with us!`,
    hostContact: newOccasionData.hostContact || '9876543210',
    dressCode: newOccasionData.dressCode || 'Festive / Formal',
    themeId: defaultTheme.id,
    isActive: true,
    seatingEnabled: newOccasionData.seatingEnabled !== undefined ? newOccasionData.seatingEnabled : true,
    galleryImages: [],
    customFields: newOccasionData.customFields || [],
    createdAt: new Date().toISOString(),
    ...newOccasionData,
  });

  const updated = [newOccasion, ...occasions];
  saveStoredOccasions(updated);
  return newOccasion;
}

/**
 * Updates an existing occasion
 */
export function updateOccasion(id, updatedFields) {
  const occasions = getStoredOccasions();
  const index = occasions.findIndex(o => String(o.id) === String(id));
  if (index === -1) return null;

  const merged = enrichOccasionDates({
    ...occasions[index],
    ...updatedFields,
    updatedAt: new Date().toISOString(),
  });

  occasions[index] = merged;
  saveStoredOccasions(occasions);
  return merged;
}

/**
 * Deletes an occasion and cleans up its associated guests
 */
export function deleteOccasion(id) {
  const occasions = getStoredOccasions();
  const filtered = occasions.filter(o => String(o.id) !== String(id));
  saveStoredOccasions(filtered);

  // Also remove guests belonging to this occasion
  const guests = getStoredMultiGuests();
  const updatedGuests = guests.filter(g => String(g.occasionId) !== String(id));
  saveStoredMultiGuests(updatedGuests);

  return filtered;
}

/**
 * Duplicates an occasion
 */
export function duplicateOccasion(id) {
  const occasion = getOccasionById(id);
  if (!occasion) return null;

  const duplicated = createOccasion({
    ...occasion,
    id: undefined,
    occasionName: `${occasion.occasionName} (Copy)`,
    title: `${occasion.title} (Copy)`,
    createdAt: new Date().toISOString(),
  });

  return duplicated;
}

/**
 * Toggles occasion active / inactive status
 */
export function toggleOccasionActive(id) {
  const occasions = getStoredOccasions();
  const index = occasions.findIndex(o => String(o.id) === String(id));
  if (index === -1) return null;

  occasions[index].isActive = !occasions[index].isActive;
  saveStoredOccasions(occasions);
  return occasions[index];
}

// ----------------------------------------------------
// MULTI-OCCASION GUEST STORAGE & DEDUPLICATION
// ----------------------------------------------------

/**
 * Loads all guests across all occasions
 */
export function getStoredMultiGuests() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.GUESTS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {}

  // Initial seed guests associated with occasion-birthday-1
  const seed = (initialGuests || []).map(g => ({
    ...g,
    occasionId: g.occasionId || 'occasion-birthday-1',
  }));
  saveStoredMultiGuests(seed);
  return seed;
}

export function saveStoredMultiGuests(guests) {
  try {
    localStorage.setItem(STORAGE_KEYS.GUESTS, JSON.stringify(guests));
  } catch (e) {}
}

/**
 * Gets guests filtered for a specific occasion
 */
export function getGuestsForOccasion(occasionId) {
  const allGuests = getStoredMultiGuests();
  return allGuests.filter(g => String(g.occasionId) === String(occasionId));
}

// ----------------------------------------------------
// MULTI-OCCASION SEATING TABLES
// ----------------------------------------------------

/**
 * Gets seating tables configured for a specific occasion, recalculated against its guests
 */
export function getTablesForOccasion(occasionId) {
  let tablesMap = {};
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.TABLES);
    if (raw) tablesMap = JSON.parse(raw);
  } catch (e) {}

  let occasionTables = tablesMap[occasionId];
  if (!occasionTables || !Array.isArray(occasionTables)) {
    // Default tables for the occasion (5 banquet tables)
    occasionTables = [
      { id: 1, tableName: 'Table 1', capacity: 8, occupiedSeats: 0, availableSeats: 8 },
      { id: 2, tableName: 'Table 2', capacity: 8, occupiedSeats: 0, availableSeats: 8 },
      { id: 3, tableName: 'Table 3', capacity: 8, occupiedSeats: 0, availableSeats: 8 },
      { id: 4, tableName: 'Table 4', capacity: 8, occupiedSeats: 0, availableSeats: 8 },
      { id: 5, tableName: 'Table 5', capacity: 8, occupiedSeats: 0, availableSeats: 8 },
    ];

    // If occasion-birthday-1, use initial seed tables
    if (occasionId === 'occasion-birthday-1') {
      occasionTables = initialTables;
    }
  }

  const occasionGuests = getGuestsForOccasion(occasionId);
  return recalculateTableOccupancy(occasionTables, occasionGuests);
}

export function saveTablesForOccasion(occasionId, tables) {
  let tablesMap = {};
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.TABLES);
    if (raw) tablesMap = JSON.parse(raw);
  } catch (e) {}

  tablesMap[occasionId] = tables;
  try {
    localStorage.setItem(STORAGE_KEYS.TABLES, JSON.stringify(tablesMap));
  } catch (e) {}
}
