import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Crosshair,
  Search,
  FlaskConical,
  Filter,
  CheckCircle2,
  CalendarCheck,
  Building2,
  ShieldCheck,
  Clock,
  Phone,
  Mail,
  Heart,
  ArrowRight,
  Layers,
  MapPin,
  Stethoscope,
  Radio,
  FileCheck2,
  Droplets,
  HeartPulse,
} from 'lucide-react';

import { ALL_TESTS, CERTIFIED_LABS, POPULAR_LOCATIONS } from './data/labData';
import { BookingMode, BookingRequest, LabPartner } from './types/lab';
import { filterLabs } from './utils/labBookingLogic';
import { api } from './services/api';
import { DEMO_USERS, UserProfile, UserRole } from './types/user';

import { Navbar } from './components/Navbar';
import { HomeView } from './components/HomeView';
import { OpdView } from './components/OpdView';
import { PharmacyView } from './components/PharmacyView';
import { EmergencyView } from './components/EmergencyView';
import { SearchView } from './components/SearchView';
import { LabCard } from './components/LabCard';
import { LabDetailView } from './components/LabDetailView';
import { BookingModal } from './components/BookingModal';
import { BookingSuccessModal } from './components/BookingSuccessModal';
import { MyBookingsDrawer } from './components/MyBookingsDrawer';
import { AdvancedAIChatModal } from './components/AdvancedAIChatModal';
import { LocationModal } from './components/LocationModal';
import { SosModal } from './components/SosModal';
import { AuthModal } from './components/AuthModal';
import { AdminConsoleModal } from './components/AdminConsoleModal';
import { DoctorPortalModal } from './components/DoctorPortalModal';
import { BloodBridgeModal } from './components/BloodBridgeModal';
import { FloatingAIButton } from './components/FloatingAIButton';

const STORAGE_KEY = 'onecare_special_bookings_v1';
const USER_KEY = 'onecare_special_active_user_v1';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [selectedLabDetail, setSelectedLabDetail] = useState<LabPartner | null>(null);

  // Active User & Demo Persona
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    try {
      const savedUser = localStorage.getItem(USER_KEY);
      if (savedUser) return JSON.parse(savedUser);
    } catch (e) {
      console.error(e);
    }
    // Default to Patient Demo for immediate representation
    return DEMO_USERS.patient;
  });

  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem(USER_KEY, JSON.stringify(currentUser));
      } else {
        localStorage.removeItem(USER_KEY);
      }
    } catch (e) {
      console.error(e);
    }
  }, [currentUser]);

  // Search & Filter State for Lab Tests
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedLocationId, setSelectedLocationId] = useState<string>('all');
  const [selectedLocationName, setSelectedLocationName] = useState<string>('All Locations');
  const [homeCollectionOnly, setHomeCollectionOnly] = useState(false);

  // Modals & Drawers
  const [bookingModalState, setBookingModalState] = useState<{
    isOpen: boolean;
    lab: LabPartner | null;
    mode: BookingMode;
    preselectedTestIds?: string[];
  }>({
    isOpen: false,
    lab: null,
    mode: 'home',
    preselectedTestIds: [],
  });

  const [confirmedBooking, setConfirmedBooking] = useState<BookingRequest | null>(null);
  const [isMyBookingsOpen, setIsMyBookingsOpen] = useState(false);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isSosModalOpen, setIsSosModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAdminConsoleOpen, setIsAdminConsoleOpen] = useState(false);
  const [isDoctorPortalOpen, setIsDoctorPortalOpen] = useState(false);
  const [isBloodBridgeModalOpen, setIsBloodBridgeModalOpen] = useState(false);

  // Bookings list synced with backend
  const [bookings, setBookings] = useState<BookingRequest[]>([]);

  // Initialize and connect with backend API
  useEffect(() => {
    async function loadInitialData() {
      try {
        const backendBookings = await api.getBookings();
        if (backendBookings && backendBookings.length > 0) {
          setBookings(backendBookings);
          return;
        }
      } catch (e) {
        console.warn('Backend bookings fetch error', e);
      }

      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          setBookings(JSON.parse(saved));
          return;
        }
      } catch (e) {
        console.error(e);
      }

      setBookings([
        {
          id: 'ONECARE-LAB-72914',
          labId: CERTIFIED_LABS[0].id,
          labName: 'Dr. Lal PathLabs',
          labArea: 'Bailey Road',
          labAddress: 'Plot No. 14, Bailey Road, Near Jagdeo Path, Patna',
          tests: [
            { testId: 't-cbc', name: 'CBC (Complete Blood Count)', price: 350, category: 'Pathology' },
            { testId: 't-thyroid', name: 'Thyroid Profile (T3, T4, TSH)', price: 650, category: 'Pathology' },
          ],
          mode: 'home',
          slotDate: 'Tomorrow',
          slotTime: '07:30 AM - 08:30 AM',
          patientName: 'Rahul Sharma',
          patientPhone: '9876543210',
          patientAge: '32',
          patientGender: 'Male',
          address: 'B-402, Green Valley Apartments, Bailey Road, Patna',
          subtotal: 1000,
          collectionFee: 0,
          totalAmount: 1000,
          status: 'Phlebotomist Assigned',
          createdAt: new Date().toISOString(),
        },
      ]);
    }

    loadInitialData();
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
    } catch (e) {
      console.error(e);
    }
  }, [bookings]);

  // Test map for fast lookup
  const testsMap = new Map(ALL_TESTS.map((t) => [t.id, t]));

  // Filtered labs
  const filteredLabs = filterLabs(CERTIFIED_LABS, ALL_TESTS, {
    searchQuery,
    category: selectedCategory,
    locationFilter: selectedLocationId === 'all' ? undefined : selectedLocationName,
    homeCollectionOnly,
  });

  const handleOpenBooking = (
    lab: LabPartner,
    mode: BookingMode = 'home',
    preselectedTestIds: string[] = []
  ) => {
    setBookingModalState({
      isOpen: true,
      lab,
      mode,
      preselectedTestIds,
    });
  };

  const handleBookingSuccess = async (newBooking: BookingRequest) => {
    await api.createBooking(newBooking);
    setBookings((prev) => [newBooking, ...prev]);
    setBookingModalState({ isOpen: false, lab: null, mode: 'home', preselectedTestIds: [] });
    setConfirmedBooking(newBooking);
  };

  const handleCancelBooking = async (bookingId: string) => {
    await api.cancelBooking(bookingId);
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status: 'Cancelled' as const } : b))
    );
  };

  const handleLocationSelect = (locId: string, locName: string) => {
    setSelectedLocationId(locId);
    setSelectedLocationName(locName);
  };

  const handleOpenRoleDashboard = () => {
    if (currentUser?.role === 'admin') {
      setIsAdminConsoleOpen(true);
    } else if (currentUser?.role === 'doctor') {
      setIsDoctorPortalOpen(true);
    } else {
      setIsMyBookingsOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col font-sans selection:bg-teal-100 selection:text-teal-900 pb-16">
      {/* Top Header / Navigation */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setCurrentTab(tab);
          if (tab === 'lab-tests') {
            setSelectedLabDetail(null);
          }
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        bookingCount={bookings.filter((b) => b.status !== 'Cancelled').length}
        onOpenMyBookings={() => setIsMyBookingsOpen(true)}
        onOpenSOS={() => setIsSosModalOpen(true)}
        onOpenAI={() => setIsAIModalOpen(true)}
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onOpenRoleDashboard={handleOpenRoleDashboard}
      />

      {/* Main Body */}
      <main className="flex-1">
        {/* Home Page View */}
        {currentTab === 'home' && (
          <HomeView
            onNavigate={(tab) => {
              setCurrentTab(tab);
              if (tab === 'lab-tests') setSelectedLabDetail(null);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenAI={() => setIsAIModalOpen(true)}
            onOpenSOS={() => setIsSosModalOpen(true)}
            onOpenBloodBridge={() => setIsBloodBridgeModalOpen(true)}
          />
        )}

        {/* OPD Page View */}
        {currentTab === 'opd' && (
          <OpdView
            onOpenAI={() => setIsAIModalOpen(true)}
            onOpenLocation={() => setIsLocationModalOpen(true)}
            selectedLocationName={selectedLocationName}
            onBookingSuccess={handleBookingSuccess}
          />
        )}

        {/* Pharmacy Page View */}
        {currentTab === 'pharmacy' && (
          <PharmacyView
            onOpenAI={() => setIsAIModalOpen(true)}
            onOpenLocation={() => setIsLocationModalOpen(true)}
            selectedLocationName={selectedLocationName}
            onBookingSuccess={handleBookingSuccess}
          />
        )}

        {/* Emergency Page View */}
        {currentTab === 'emergency' && (
          <EmergencyView
            onOpenAI={() => setIsAIModalOpen(true)}
            onOpenLocation={() => setIsLocationModalOpen(true)}
            selectedLocationName={selectedLocationName}
            onBookingSuccess={handleBookingSuccess}
          />
        )}

        {/* Search Page View */}
        {currentTab === 'search' && (
          <SearchView
            onSelectLab={(lab) => {
              setSelectedLabDetail(lab);
              setCurrentTab('lab-tests');
            }}
            onNavigate={(tab) => {
              setCurrentTab(tab);
              if (tab === 'lab-tests') setSelectedLabDetail(null);
            }}
          />
        )}

        {/* Lab Tests View */}
        {currentTab === 'lab-tests' && (
          selectedLabDetail ? (
            /* Facility / Lab Detail View */
            <LabDetailView
              lab={selectedLabDetail}
              tests={ALL_TESTS}
              onBack={() => setSelectedLabDetail(null)}
              onOpenBooking={(lab, preselected) => handleOpenBooking(lab, 'home', preselected)}
            />
          ) : (
            /* Main Lab Tests View */
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 animate-in fade-in duration-300">
              {/* Header Hero Section */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8 sm:mb-10">
                <div className="max-w-2xl">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-teal-100 text-teal-800 border border-teal-200">
                      <FlaskConical className="w-3.5 h-3.5 text-teal-700" />
                      CERTIFIED DIAGNOSTICS & HOME COLLECTION
                    </span>
                    <span className="hidden sm:inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                      <Radio className="w-3 h-3 text-emerald-500 animate-pulse" />
                      Phlebotomists Active in Patna
                    </span>
                  </div>
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                    Book Certified Lab Tests
                  </h1>
                  <p className="text-sm sm:text-base text-slate-600 mt-2 font-medium">
                    Sterile painless home sample collection or direct walk-in — NABL & ICMR accredited laboratories.
                  </p>
                </div>

                {/* Action Buttons top right */}
                <div className="flex items-center gap-3 flex-wrap">
                  <button
                    onClick={() => setIsAIModalOpen(true)}
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-teal-50 to-cyan-50 border border-teal-200 hover:border-teal-400 hover:shadow-xs rounded-2xl text-xs sm:text-sm font-bold text-teal-900 transition-all cursor-pointer group"
                  >
                    <Sparkles className="w-4 h-4 text-teal-600 group-hover:rotate-12 transition-transform" />
                    <span>AI Biomarker Advisor</span>
                  </button>

                  <button
                    onClick={() => setIsLocationModalOpen(true)}
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 hover:border-slate-300 rounded-2xl text-xs sm:text-sm font-bold text-slate-800 transition-all shadow-xs cursor-pointer hover:bg-slate-50"
                  >
                    <Crosshair className="w-4 h-4 text-teal-700" />
                    <span>
                      {selectedLocationId === 'all' ? 'All Patna Locations' : selectedLocationName}
                    </span>
                  </button>
                </div>
              </div>

              {/* Search & Filter Bar */}
              <div className="bg-white rounded-3xl border border-slate-200/90 p-4 sm:p-6 mb-8 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  {/* Search input */}
                  <div className="relative flex-1 w-full">
                    <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search by lab name, test (CBC, Thyroid, HbA1c, Vitamin D3, MRI)..."
                      className="w-full pl-11 pr-14 py-3 rounded-2xl border border-slate-200 bg-slate-50/70 text-sm font-medium outline-none focus:bg-white focus:ring-2 focus:ring-teal-600 focus:border-teal-600 transition-all"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-700 px-2 py-1 rounded-md hover:bg-slate-100 cursor-pointer"
                      >
                        Clear
                      </button>
                    )}
                  </div>

                  {/* Location Filter Dropdown */}
                  <div className="w-full sm:w-auto">
                    <select
                      value={selectedLocationId}
                      onChange={(e) => {
                        const loc = POPULAR_LOCATIONS.find((l) => l.id === e.target.value);
                        handleLocationSelect(e.target.value, loc ? loc.name : 'All Locations');
                      }}
                      className="w-full sm:w-52 px-3.5 py-3 rounded-2xl border border-slate-200 bg-slate-50/70 text-xs font-bold text-slate-700 outline-none focus:ring-2 focus:ring-teal-600 cursor-pointer"
                    >
                      {POPULAR_LOCATIONS.map((loc) => (
                        <option key={loc.id} value={loc.id}>
                          {loc.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Popular Search Suggestions Chips */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1">
                    Popular:
                  </span>
                  {[
                    'CBC',
                    'Lipid Profile',
                    'Thyroid (T3, T4, TSH)',
                    'HbA1c Diabetes',
                    'Vitamin D3',
                    'Liver Function (LFT)',
                  ].map((testName) => (
                    <button
                      key={testName}
                      onClick={() => setSearchQuery(testName)}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-teal-50 hover:text-teal-800 text-slate-600 rounded-lg text-xs font-semibold shrink-0 transition-colors cursor-pointer"
                    >
                      {testName}
                    </button>
                  ))}
                </div>

                {/* Category Chips & Home Collection Toggle */}
                <div className="flex items-center justify-between flex-wrap gap-2 pt-3 border-t border-slate-100">
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
                    {[
                      { id: 'all', label: 'All Tests' },
                      { id: 'Pathology', label: 'Pathology & Blood' },
                      { id: 'Cardiology', label: 'Cardiology (ECG/Echo)' },
                      { id: 'Radiology', label: 'Radiology (X-Ray/MRI)' },
                      { id: 'Health Packages', label: 'Health Packages' },
                    ].map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                          selectedCategory.toLowerCase() === cat.id.toLowerCase()
                            ? 'bg-teal-700 text-white shadow-xs'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>

                  <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700 select-none bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200/60 hover:bg-slate-100 transition-colors">
                    <input
                      type="checkbox"
                      checked={homeCollectionOnly}
                      onChange={(e) => setHomeCollectionOnly(e.target.checked)}
                      className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500 accent-teal-600 cursor-pointer"
                    />
                    <span>Home Collection Available</span>
                  </label>
                </div>
              </div>

              {/* Certified Partner Labs Grid */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-teal-700" />
                    <span>NABL Certified Diagnostic Labs ({filteredLabs.length})</span>
                  </h2>
                  {selectedLocationId !== 'all' && (
                    <span className="text-xs font-semibold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-full border border-teal-200">
                      Area: {selectedLocationName}
                    </span>
                  )}
                </div>

                {filteredLabs.length === 0 ? (
                  <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center mx-auto mb-3">
                      <FlaskConical className="w-8 h-8" />
                    </div>
                    <h3 className="text-base font-bold text-slate-800">No partner labs match your search</h3>
                    <p className="text-xs text-slate-500 mt-1 mb-4">
                      No labs matched "{searchQuery}". Try searching for tests like CBC, Thyroid, or Vitamin D.
                    </p>
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setSelectedCategory('all');
                        setSelectedLocationId('all');
                        setSelectedLocationName('All Locations');
                        setHomeCollectionOnly(false);
                      }}
                      className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer"
                    >
                      Reset all filters
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredLabs.map((lab) => (
                      <LabCard
                        key={lab.id}
                        lab={lab}
                        testsMap={testsMap}
                        onSelectLab={(l) => setSelectedLabDetail(l)}
                        onBookHomeCollection={(l) => handleOpenBooking(l, 'home')}
                        onBookCentreVisit={(l) => handleOpenBooking(l, 'centre')}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* OneCare Special Assurance Banners */}
              <div className="mt-14 pt-10 border-t border-slate-200 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 bg-white rounded-2xl border border-slate-200 flex items-start gap-4 shadow-sm hover:shadow-md transition-shadow">
                  <div className="p-3 bg-teal-50 text-teal-700 rounded-xl shrink-0 border border-teal-100">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">100% Certified Partner Labs</h4>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      All diagnostic partners are NABL, CAP, and ISO 15189 certified for clinical accuracy & zero contamination.
                    </p>
                  </div>
                </div>

                <div className="p-6 bg-white rounded-2xl border border-slate-200 flex items-start gap-4 shadow-sm hover:shadow-md transition-shadow">
                  <div className="p-3 bg-teal-50 text-teal-700 rounded-xl shrink-0 border border-teal-100">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">On-Time Vacuum Phlebotomy</h4>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      Vaccinated phlebotomists arrive on schedule with sterile vacuum tubes for painless and temperature-safe draws.
                    </p>
                  </div>
                </div>

                <div className="p-6 bg-white rounded-2xl border border-slate-200 flex items-start gap-4 shadow-sm hover:shadow-md transition-shadow">
                  <div className="p-3 bg-teal-50 text-teal-700 rounded-xl shrink-0 border border-teal-100">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Digital Verified Reports</h4>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      Receive signed pathologist reports directly on OneCare Special and WhatsApp as soon as tests are completed.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )
        )}
      </main>

      {/* Footer */}
      <footer className="mt-20 border-t border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-2 space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-700 to-cyan-800 text-white flex items-center justify-center font-black text-lg shadow-sm">
                  O
                </div>
                <span className="text-xl font-black text-slate-900 tracking-tight">
                  OneCare <span className="text-teal-600">Special</span>
                </span>
              </div>
              <p className="text-xs text-slate-500 max-w-sm leading-relaxed">
                OneCare Special Clinical Healthcare Platform — Unifying certified diagnostics, video OPD consultations, doorstep pharmacy, and 108 emergency bed dispatch across India.
              </p>
              <div className="pt-2 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                <span className="flex items-center gap-1 font-bold text-teal-700">
                  <Phone className="w-3.5 h-3.5" /> 1800-208-1080 (Toll-Free 24x7)
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 font-semibold text-slate-600">
                  <Mail className="w-3.5 h-3.5" /> care@onecarespecial.in
                </span>
              </div>
            </div>

            <div>
              <h5 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">
                Clinical Services
              </h5>
              <ul className="space-y-2 text-xs text-slate-600 font-medium">
                <li>
                  <button onClick={() => { setSelectedLabDetail(null); setCurrentTab('lab-tests'); }} className="hover:text-teal-700 cursor-pointer">
                    Book Certified Lab Tests
                  </button>
                </li>
                <li>
                  <button onClick={() => setCurrentTab('opd')} className="hover:text-teal-700 cursor-pointer">
                    Book Video OPD Doctor
                  </button>
                </li>
                <li>
                  <button onClick={() => setCurrentTab('pharmacy')} className="hover:text-teal-700 cursor-pointer">
                    Order Doorstep Medicines (45m)
                  </button>
                </li>
                <li>
                  <button onClick={() => setCurrentTab('emergency')} className="hover:text-red-600 cursor-pointer text-red-600 font-bold">
                    108 Emergency Beds & Ambulance
                  </button>
                </li>
                <li>
                  <button onClick={() => setIsMyBookingsOpen(true)} className="hover:text-teal-700 cursor-pointer">
                    Track Sample & Reports
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h5 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">
                Certified Partner Network
              </h5>
              <ul className="space-y-2 text-xs text-slate-600 font-medium">
                <li>Dr. Lal PathLabs (NABL / CAP)</li>
                <li>Thyrocare Technologies</li>
                <li>SRL Diagnostics</li>
                <li>Metropolis Healthcare</li>
                <li>AIIMS & Paras HMRI Network</li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
            <p>© {new Date().getFullYear()} OneCare Special AI Care. ABDM & HIPAA Compliant.</p>
            <p className="text-[11px] text-slate-400">
              Disclaimer: Diagnostic tests are performed by NABL certified partner laboratories. Always consult a certified medical practitioner.
            </p>
          </div>
        </div>
      </footer>


      {/* Auth Modal with 1-Click Demo Logins & OTP */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        currentUser={currentUser}
        onLogin={(user) => setCurrentUser(user)}
        onLogout={() => setCurrentUser(null)}
      />

      {/* Admin Command Center Modal */}
      {currentUser && (
        <AdminConsoleModal
          isOpen={isAdminConsoleOpen}
          onClose={() => setIsAdminConsoleOpen(false)}
          user={currentUser}
        />
      )}

      {/* Doctor Video OPD Console Modal */}
      {currentUser && (
        <DoctorPortalModal
          isOpen={isDoctorPortalOpen}
          onClose={() => setIsDoctorPortalOpen(false)}
          user={currentUser}
        />
      )}

      {/* Booking Modal */}
      {bookingModalState.isOpen && bookingModalState.lab && (
        <BookingModal
          lab={bookingModalState.lab}
          tests={ALL_TESTS}
          initialMode={bookingModalState.mode}
          initialSelectedTestIds={bookingModalState.preselectedTestIds}
          onClose={() =>
            setBookingModalState({ isOpen: false, lab: null, mode: 'home', preselectedTestIds: [] })
          }
          onSuccess={handleBookingSuccess}
        />
      )}

      {/* Booking Success Confirmation Modal */}
      {confirmedBooking && (
        <BookingSuccessModal
          booking={confirmedBooking}
          onClose={() => setConfirmedBooking(null)}
          onViewMyBookings={() => {
            setConfirmedBooking(null);
            setIsMyBookingsOpen(true);
          }}
        />
      )}

      {/* My Bookings Drawer */}
      <MyBookingsDrawer
        bookings={bookings}
        isOpen={isMyBookingsOpen}
        onClose={() => setIsMyBookingsOpen(false)}
        onCancelBooking={handleCancelBooking}
      />

      {/* Advanced Multimodal & Voice AI Clinical Assistant Modal */}
      <AdvancedAIChatModal
        isOpen={isAIModalOpen}
        onClose={() => setIsAIModalOpen(false)}
        tests={ALL_TESTS}
        labs={CERTIFIED_LABS}
        onBookWithPreselectedTests={(lab, testIds) => {
          setSelectedLabDetail(null);
          setCurrentTab('lab-tests');
          handleOpenBooking(lab, 'home', testIds);
        }}
        onNavigateToOpd={(specialty) => {
          setSelectedLabDetail(null);
          setCurrentTab('opd');
        }}
        onNavigateToPharmacy={() => {
          setSelectedLabDetail(null);
          setCurrentTab('pharmacy');
        }}
      />

      {/* Location Selector Modal */}
      <LocationModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        selectedLocation={selectedLocationId}
        onSelectLocation={handleLocationSelect}
      />

      {/* 108 SOS Modal */}
      <SosModal
        isOpen={isSosModalOpen}
        onClose={() => setIsSosModalOpen(false)}
      />

      {/* BloodBridge AI Emergency Blood & Donor Modal */}
      <BloodBridgeModal
        isOpen={isBloodBridgeModalOpen}
        onClose={() => setIsBloodBridgeModalOpen(false)}
      />

      {/* Persistent Floating AI Action Button Stack (BloodBridge AI directly above Ask OneCare AI) */}
      <FloatingAIButton
        onClick={() => setIsAIModalOpen(true)}
        isOpen={isAIModalOpen}
        onOpenBloodBridge={() => setIsBloodBridgeModalOpen(true)}
      />
    </div>
  );
}

