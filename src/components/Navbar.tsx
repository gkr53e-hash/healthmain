import React, { useState } from 'react';
import {
  PhoneCall,
  CalendarCheck,
  Menu,
  X,
  Sparkles,
  User,
  ShieldCheck,
  Stethoscope,
  ChevronDown,
  Activity,
  HeartPulse,
  Radio,
  Search,
} from 'lucide-react';
import { UserProfile } from '../types/user';

interface NavbarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  bookingCount: number;
  onOpenMyBookings: () => void;
  onOpenSOS: () => void;
  onOpenAI: () => void;
  currentUser: UserProfile | null;
  onOpenAuth: () => void;
  onOpenRoleDashboard: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  bookingCount,
  onOpenMyBookings,
  onOpenSOS,
  onOpenAI,
  currentUser,
  onOpenAuth,
  onOpenRoleDashboard,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'ai-care', label: 'AI Clinical Care', isAI: true, badge: 'Voice & Vision' },
    { id: 'search', label: 'Search' },
    { id: 'opd', label: 'OPD Doctors' },
    { id: 'lab-tests', label: 'Lab Tests' },
    { id: 'pharmacy', label: 'Pharmacy' },
    { id: 'emergency', label: '108 Emergency' },
  ];

  const handleNavClick = (id: string, isAI?: boolean) => {
    setMobileMenuOpen(false);
    if (isAI) {
      onOpenAI();
    } else {
      onSelectTab(id);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full">
      {/* Top Professional Ticker / Status Bar */}
      <div className="bg-slate-950 text-white text-[11px] font-semibold border-b border-slate-800/80 px-4 py-1.5 hidden md:block">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 font-bold border border-emerald-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              <span>LIVE 108 EMERGENCY NETWORK</span>
            </span>
            <span className="text-slate-400">
              Patna Metro & AIIMS Region • 147 Available Beds • &lt; 12m Ambulance Response
            </span>
          </div>

          <div className="flex items-center gap-4 text-slate-300">
            <span className="flex items-center gap-1 text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
              <span>NABL & CAP Certified Diagnostics</span>
            </span>
            <span className="text-slate-700">|</span>
            <button
              onClick={onOpenAI}
              className="text-teal-300 hover:text-white font-bold flex items-center gap-1 cursor-pointer transition-colors"
            >
              <Sparkles className="w-3 h-3 text-teal-400" />
              <span>2-Way Clinical AI Voice Consultation</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Glass Navigation Bar */}
      <div className="bg-white/95 backdrop-blur-xl border-b border-slate-200/90 shadow-xs transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Brand Logo */}
            <div
              className="flex items-center gap-3 cursor-pointer group select-none"
              onClick={() => onSelectTab('home')}
              aria-label="OneCare Special Home"
            >
              <div className="relative flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-teal-600 via-teal-700 to-cyan-800 shadow-md shadow-teal-700/25 text-white font-black text-2xl tracking-tighter ring-1 ring-teal-500/30 group-hover:scale-105 transition-all">
                <span className="relative z-10 flex items-center justify-center font-black">
                  O
                  <span className="absolute -bottom-0.5 right-1 w-2.5 h-2.5 rounded-full bg-cyan-300 ring-2 ring-teal-700 animate-pulse" />
                </span>
                <svg
                  className="absolute inset-0 w-full h-full opacity-30 stroke-white fill-none"
                  viewBox="0 0 44 44"
                >
                  <path
                    d="M4 22h8l3-7 5 14 4-10 3 5 4-2h9"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 group-hover:text-teal-700 transition-colors">
                    OneCare <span className="text-teal-600">Special</span>
                  </span>
                  <span className="px-2 py-0.5 text-[10px] font-black uppercase tracking-wider bg-teal-50 text-teal-800 rounded-md border border-teal-200/80 shadow-2xs">
                    AI Care
                  </span>
                </div>
                <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                  One Platform, Every Care
                </span>
              </div>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1" aria-label="Main Navigation">
              {navLinks.map((link) => {
                const isActive = currentTab === link.id;
                return (
                  <button
                    key={link.id}
                    onClick={() => handleNavClick(link.id, link.isAI)}
                    className={`relative px-3.5 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                      isActive
                        ? 'bg-teal-700 text-white shadow-md shadow-teal-700/25'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                    }`}
                  >
                    {link.isAI && <Sparkles className="w-3.5 h-3.5 text-teal-500 animate-pulse" />}
                    <span>{link.label}</span>
                    {link.badge && !isActive && (
                      <span className="text-[9px] px-1.5 py-0.2 bg-teal-50 text-teal-700 font-extrabold rounded-full border border-teal-200">
                        {link.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Right Action Items */}
            <div className="flex items-center gap-2 sm:gap-2.5">
              {/* Quick Demo Login Pill */}
              {!currentUser ? (
                <button
                  onClick={onOpenAuth}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-black text-teal-800 bg-teal-50/80 border border-teal-300 rounded-xl hover:bg-teal-100 transition-all shadow-xs cursor-pointer group"
                  title="1-Click Demo Login as Patient, Doctor, Admin, or Lab"
                >
                  <Sparkles className="w-3.5 h-3.5 text-teal-600 group-hover:rotate-12 transition-transform" />
                  <span>Demo Login</span>
                </button>
              ) : (
                <div
                  onClick={onOpenAuth}
                  className="inline-flex items-center gap-2 p-1.5 pr-3 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 cursor-pointer shadow-xs transition-all hover:border-slate-300"
                  title="Click to view profile or switch demo role"
                >
                  <div className="relative">
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.name}
                      className="w-8 h-8 rounded-xl object-cover border border-slate-200"
                    />
                    <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
                  </div>
                  <div className="text-left hidden sm:block">
                    <div className="text-xs font-extrabold text-slate-900 leading-tight">
                      {currentUser.name.split(' ')[0]}
                    </div>
                    <div className="text-[10px] font-black uppercase text-teal-700 leading-none">
                      {currentUser.role}
                    </div>
                  </div>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </div>
              )}

              {/* Role specific launcher button */}
              {currentUser && (currentUser.role === 'admin' || currentUser.role === 'doctor') && (
                <button
                  onClick={onOpenRoleDashboard}
                  className={`hidden md:inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-extrabold rounded-xl text-white shadow-xs transition-transform active:scale-95 cursor-pointer ${
                    currentUser.role === 'admin'
                      ? 'bg-rose-600 hover:bg-rose-700 shadow-rose-600/20'
                      : 'bg-cyan-700 hover:bg-cyan-800 shadow-cyan-700/20'
                  }`}
                >
                  {currentUser.role === 'admin' ? (
                    <>
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Command Center</span>
                    </>
                  ) : (
                    <>
                      <Stethoscope className="w-3.5 h-3.5" />
                      <span>Doctor Room</span>
                    </>
                  )}
                </button>
              )}

              {/* My Bookings Pill */}
              {bookingCount > 0 && (
                <button
                  onClick={onOpenMyBookings}
                  className="hidden xl:inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-teal-800 bg-teal-50 border border-teal-300 rounded-xl hover:bg-teal-100 transition-all shadow-xs cursor-pointer"
                  title="View your booked tests & appointments"
                >
                  <CalendarCheck className="w-3.5 h-3.5 text-teal-700" />
                  <span>Bookings</span>
                  <span className="ml-0.5 px-1.5 py-0.2 bg-teal-700 text-white rounded-full text-[10px] font-black">
                    {bookingCount}
                  </span>
                </button>
              )}

              {/* 108 SOS Button */}
              <button
                onClick={onOpenSOS}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 sm:px-4 sm:py-2.5 text-xs sm:text-sm font-black text-white bg-red-600 hover:bg-red-700 active:scale-95 transition-all rounded-xl shadow-lg shadow-red-600/30 pulse-glow-red cursor-pointer"
                aria-label="Call 108 SOS Emergency"
              >
                <PhoneCall className="w-3.5 h-3.5 fill-white animate-bounce" />
                <span className="tracking-wide">108 SOS</span>
              </button>

              {/* Mobile menu hamburger */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-slate-200 bg-white/98 backdrop-blur-2xl px-4 pt-3 pb-6 shadow-2xl animate-in slide-in-from-top duration-200">
          <div className="grid grid-cols-2 gap-2 mb-4">
            {navLinks.map((link) => {
              const isActive = currentTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id, link.isAI)}
                  className={`py-3 px-3.5 rounded-xl text-left text-xs font-extrabold transition-all flex items-center justify-between ${
                    isActive
                      ? 'bg-teal-700 text-white shadow-sm'
                      : 'text-slate-700 hover:bg-slate-100 bg-slate-50'
                  }`}
                >
                  <span>{link.label}</span>
                  {link.isAI && <Sparkles className="w-3.5 h-3.5 text-teal-400" />}
                </button>
              );
            })}
          </div>

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2.5">
            {/* Quick Demo Login button in mobile drawer */}
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAuth();
              }}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 text-xs font-black text-teal-900 bg-teal-50 border border-teal-300 rounded-xl cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-teal-600" />
              <span>
                {currentUser
                  ? `Switch Role (${currentUser.name} - ${currentUser.role.toUpperCase()})`
                  : 'Demo Login (Patient / Doctor / Admin / Lab)'}
              </span>
            </button>

            {bookingCount > 0 && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenMyBookings();
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 text-xs font-bold text-teal-800 bg-teal-50/70 border border-teal-200 rounded-xl"
              >
                <CalendarCheck className="w-4 h-4 text-teal-700" />
                <span>My Bookings ({bookingCount})</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

