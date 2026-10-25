import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  PhoneCall,
  Activity,
  Video,
  FlaskConical,
  Ambulance,
  Building2,
  Clock,
  ShieldCheck,
  CheckCircle,
  FileText,
  MapPin,
  HeartPulse,
  Search,
  Star,
  Zap,
  Users,
  CheckCircle2,
  Stethoscope,
  Pill,
  Award,
  ChevronRight,
  ShieldAlert,
  Radio,
  Droplets,
} from 'lucide-react';
import { HeroClinicalVisualizer } from './HeroClinicalVisualizer';

interface HomeViewProps {
  onNavigate: (tab: string) => void;
  onOpenAI: () => void;
  onOpenSOS: () => void;
  onOpenBloodBridge?: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onNavigate,
  onOpenAI,
  onOpenSOS,
  onOpenBloodBridge,
}) => {
  const [activeStoryTab, setActiveStoryTab] = useState<'triage' | 'opd' | 'labs' | 'ambulance'>('triage');
  const [heroSearch, setHeroSearch] = useState('');

  const quickChips = [
    { label: '🩸 BloodBridge AI', isBloodBridge: true },
    { label: 'CBC Blood Test', tab: 'lab-tests' },
    { label: 'Cardiologist', tab: 'opd' },
    { label: 'Thyroid Profile', tab: 'lab-tests' },
    { label: 'ICU Bed Availability', tab: 'emergency' },
    { label: 'Pan-D / Pantoprazole', tab: 'pharmacy' },
    { label: 'Ask Clinical AI', isAI: true },
  ];

  const handleQuickChip = (chip: { label: string; tab?: string; isAI?: boolean; isBloodBridge?: boolean }) => {
    if (chip.isBloodBridge && onOpenBloodBridge) {
      onOpenBloodBridge();
    } else if (chip.isAI) {
      onOpenAI();
    } else if (chip.tab) {
      onNavigate(chip.tab);
    }
  };

  const networkPartners = [
    { name: 'AIIMS Patna', type: 'Super-Specialty & Trauma' },
    { name: 'Paras HMRI', type: 'Cardiac & Neuro Care' },
    { name: 'Dr. Lal PathLabs', type: 'NABL & CAP Certified' },
    { name: 'Medanta Hospital', type: 'Critical Care Network' },
    { name: 'Thyrocare', type: 'Central Pathology' },
    { name: 'Ruban Memorial', type: 'Multispecialty ICU' },
    { name: 'Apollo Pharmacy', type: '24×7 Medicine Hub' },
  ];

  const carePillars = [
    {
      title: 'AI Clinical Triage',
      desc: 'Multilingual 2-way voice consultation, prescription deciphering & lab report analysis.',
      badge: 'Vision & Voice AI',
      icon: Sparkles,
      color: 'from-teal-500/20 to-cyan-500/10 border-teal-500/30 text-teal-300',
      actionText: 'Launch Clinical AI',
      action: onOpenAI,
    },
    {
      title: 'Top OPD Specialists',
      desc: 'Same-day video consultations or verified clinic appointments with senior doctors.',
      badge: 'Tele-Health & In-Clinic',
      icon: Stethoscope,
      color: 'from-cyan-500/20 to-blue-500/10 border-cyan-500/30 text-cyan-300',
      actionText: 'Browse 50+ Doctors',
      action: () => onNavigate('opd'),
    },
    {
      title: 'Diagnostic Lab Tests',
      desc: 'Free home sample collection by certified phlebotomists. Reports delivered in 6–12 hrs.',
      badge: 'NABL & CAP Certified',
      icon: FlaskConical,
      color: 'from-emerald-500/20 to-teal-500/10 border-emerald-500/30 text-emerald-300',
      actionText: 'Book Lab Tests',
      action: () => onNavigate('lab-tests'),
    },
    {
      title: 'Doorstep Pharmacy',
      desc: '100% genuine medicines from licensed pharmacies delivered to your doorstep in 45 mins.',
      badge: '45-Min Express Delivery',
      icon: Pill,
      color: 'from-amber-500/20 to-orange-500/10 border-amber-500/30 text-amber-300',
      actionText: 'Order Medicines',
      action: () => onNavigate('pharmacy'),
    },
    {
      title: '108 ICU Bed Hold',
      desc: 'Real-time ICU, ventilator & general bed reservation across top network hospitals.',
      badge: 'Live Telemetry Bed Grid',
      icon: Building2,
      color: 'from-rose-500/20 to-red-500/10 border-rose-500/30 text-rose-300',
      actionText: 'View Live Beds (147)',
      action: () => onNavigate('emergency'),
    },
    {
      title: 'GPS Ambulance Fleet',
      desc: 'BLS, ALS and Mobile ICU cardiac ambulances dispatched with live GPS tracking.',
      badge: '< 12-Min Avg Arrival',
      icon: Ambulance,
      color: 'from-red-500/20 to-rose-500/10 border-red-500/30 text-red-300',
      actionText: 'Emergency Dispatch',
      action: onOpenSOS,
    },
  ];

  return (
    <div className="bg-[#040814] text-white selection:bg-teal-500 selection:text-white">
      {/* Top Live Emergency & Clinical Broadcast Marquee Ticker */}
      <div className="bg-slate-950/95 border-b border-teal-500/20 overflow-hidden py-2 px-3 sm:px-6 relative z-20 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-[10px] font-black uppercase tracking-wider shrink-0 shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-ping" />
            <span>LIVE DISPATCH</span>
          </div>
          <div className="overflow-hidden flex-1 relative">
            <div className="animate-marquee flex items-center gap-8 text-xs font-semibold text-slate-300 whitespace-nowrap">
              <span className="flex items-center gap-2">
                <span className="text-emerald-400 font-bold">●</span> 147 Total Beds &amp; 33 ICU beds available across Patna Network (AIIMS, Paras, Medanta)
              </span>
              <span className="flex items-center gap-2">
                <span className="text-teal-400 font-bold">●</span> 108 Emergency Ambulance GPS live fleet active — Avg response &lt; 12 mins
              </span>
              <span className="flex items-center gap-2">
                <span className="text-cyan-400 font-bold">●</span> 45-min Doorstep Medicine Delivery live across Bailey Rd, Kankarbagh &amp; Boring Rd
              </span>
              <span className="flex items-center gap-2">
                <span className="text-amber-400 font-bold">●</span> Free Home Phlebotomy Sample Collection available for tomorrow 6:00 AM – 11:00 AM
              </span>
              <span className="flex items-center gap-2">
                <span className="text-rose-400 font-bold">●</span> 18 Certified MD Doctors online for instant video tele-consultations
              </span>
              {/* Seamless loop duplicate */}
              <span className="flex items-center gap-2">
                <span className="text-emerald-400 font-bold">●</span> 147 Total Beds &amp; 33 ICU beds available across Patna Network (AIIMS, Paras, Medanta)
              </span>
              <span className="flex items-center gap-2">
                <span className="text-teal-400 font-bold">●</span> 108 Emergency Ambulance GPS live fleet active — Avg response &lt; 12 mins
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-10 pb-16 sm:pt-16 sm:pb-28 border-b border-slate-800/80">
        {/* Subtle Ambient Radial Lighting with Gentle Floating Animations */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-b from-teal-500/15 via-cyan-500/5 to-transparent blur-3xl pointer-events-none" />
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-teal-600/10 rounded-full blur-3xl pointer-events-none animate-float-gentle" />
        <div className="absolute top-1/3 -right-20 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none animate-float-delayed" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Hero Column */}
            <div className="lg:col-span-7 space-y-6 text-left">
              {/* Trust Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-teal-500/30 text-teal-300 text-xs font-bold tracking-wide shadow-xs backdrop-blur-md">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-400" />
                </span>
                <span>Next-Gen Unified Healthcare Platform • Bihar & NCR</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.08] text-white">
                Two ecosystems.{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-cyan-300 to-sky-300">
                  One intelligent AI care platform.
                </span>
              </h1>

              {/* Subheading */}
              <p className="text-slate-300 text-sm sm:text-base lg:text-lg leading-relaxed max-w-2xl font-normal">
                From AI symptom triage and video OPD consultations to home lab sample collection, 45-minute pharmacy delivery, and 108 emergency ICU bed holds — OneCare Special synchronizes your entire medical journey.
              </p>

              {/* Interactive Quick Search in Hero */}
              <div className="p-2 sm:p-2.5 rounded-2xl bg-slate-900/90 border border-slate-700/80 shadow-2xl backdrop-blur-xl max-w-xl">
                <div className="flex items-center gap-2">
                  <div className="pl-2 text-slate-400">
                    <Search className="w-5 h-5 text-teal-400" />
                  </div>
                  <input
                    type="text"
                    value={heroSearch}
                    onChange={(e) => setHeroSearch(e.target.value)}
                    placeholder="Search symptoms, doctors, CBC, Thyroid, ICU beds..."
                    className="w-full bg-transparent text-white placeholder-slate-400 text-xs sm:text-sm font-medium outline-none py-2"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        onNavigate('search');
                      }
                    }}
                  />
                  <button
                    onClick={() => onNavigate('search')}
                    className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-extrabold text-xs transition-all cursor-pointer shrink-0 shadow-md flex items-center gap-1.5"
                  >
                    <span>Search</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Quick Suggestion Chips */}
                <div className="flex items-center gap-1.5 pt-2 mt-1 border-t border-slate-800/80 overflow-x-auto pb-1 text-[11px] font-semibold text-slate-400">
                  <span className="text-slate-400 shrink-0">Popular:</span>
                  {quickChips.map((chip, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleQuickChip(chip)}
                      className="px-2 py-0.5 rounded-md bg-slate-800/80 hover:bg-teal-950 hover:text-teal-300 text-slate-300 border border-slate-700/60 hover:border-teal-500/40 transition-colors shrink-0 cursor-pointer"
                    >
                      {chip.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3.5 pt-1">
                <button
                  onClick={() => {
                    try {
                      const savedUrl = localStorage.getItem('bloodbridge_custom_url');
                      const autoRedirect = localStorage.getItem('bloodbridge_auto_redirect');
                      if (
                        savedUrl &&
                        savedUrl.trim() !== '' &&
                        !savedUrl.includes('github.com') &&
                        autoRedirect === 'true'
                      ) {
                        let finalUrl = savedUrl.trim();
                        if (!finalUrl.startsWith('http://') && !finalUrl.startsWith('https://')) {
                          finalUrl = `https://${finalUrl}`;
                        }
                        window.open(finalUrl, '_blank', 'noopener,noreferrer');
                        return;
                      }
                    } catch (e) {
                      console.error(e);
                    }
                    if (onOpenBloodBridge) onOpenBloodBridge();
                  }}
                  className="px-5 py-3.5 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white font-black text-xs sm:text-sm flex items-center gap-2 transition-all shadow-lg shadow-rose-600/30 active:scale-98 cursor-pointer group"
                >
                  <Droplets className="w-4 h-4 text-rose-200 fill-white group-hover:scale-110 transition-transform" />
                  <span>BloodBridge AI</span>
                </button>

                <button
                  onClick={onOpenAI}
                  className="px-5 py-3.5 rounded-xl bg-white hover:bg-slate-100 text-slate-950 font-black text-xs sm:text-sm flex items-center gap-2 transition-all shadow-lg active:scale-98 cursor-pointer group"
                >
                  <Sparkles className="w-4 h-4 text-teal-600 group-hover:rotate-12 transition-transform" />
                  <span>Ask OneCare Special AI</span>
                </button>


                <button
                  onClick={onOpenSOS}
                  className="px-5 py-3.5 rounded-xl border border-red-500/50 bg-red-950/40 hover:bg-red-900/50 text-red-300 font-extrabold text-xs sm:text-sm flex items-center gap-2 transition-all active:scale-98 cursor-pointer"
                >
                  <PhoneCall className="w-4 h-4 text-red-400" />
                  <span>108 Emergency</span>
                </button>
              </div>

              {/* Live Medical Telemetry Counters */}
              <div className="pt-6 border-t border-slate-800/90 grid grid-cols-3 gap-4">
                <div className="p-3 rounded-2xl bg-slate-900/40 border border-slate-800/60">
                  <div className="flex items-center gap-1.5 text-teal-400 font-black text-xl sm:text-2xl">
                    <Activity className="w-4 h-4 text-teal-400" />
                    <span>24×7</span>
                  </div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">
                    Live Emergency Desk
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-slate-900/40 border border-slate-800/60">
                  <div className="flex items-center gap-1.5 text-cyan-400 font-black text-xl sm:text-2xl">
                    <Clock className="w-4 h-4 text-cyan-400" />
                    <span>&lt; 12min</span>
                  </div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">
                    Ambulance ETA (Patna)
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-slate-900/40 border border-slate-800/60">
                  <div className="flex items-center gap-1.5 text-emerald-400 font-black text-xl sm:text-2xl">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>100%</span>
                  </div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">
                    NABL Certified Labs
                  </div>
                </div>
              </div>
            </div>

            {/* Right Hero Clinical Showcase Card: Interactive Animated Medical Visualizer */}
            <div className="lg:col-span-5 relative">
              <HeroClinicalVisualizer
                onNavigate={onNavigate}
                onOpenAI={onOpenAI}
                onOpenSOS={onOpenSOS}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Network Hospitals & Partner Labs Strip with Smooth Infinite Animated Marquee */}
      <section className="py-5 border-b border-slate-800 bg-slate-950/80 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <span className="text-[11px] font-black uppercase tracking-widest text-slate-400 shrink-0 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
              <span>Trusted Network Partners &amp; Diagnostic Chains:</span>
            </span>

            <div className="overflow-hidden flex-1 relative">
              <div className="animate-marquee flex items-center gap-3">
                {[...networkPartners, ...networkPartners].map((p, idx) => (
                  <div
                    key={idx}
                    className="px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-slate-300 flex items-center gap-2 shrink-0 hover:border-teal-500/40 hover:bg-slate-800/80 transition-all cursor-default shadow-xs"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
                    <span>{p.name}</span>
                    <span className="text-[10px] text-slate-400 font-normal">({p.type})</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6 Core Care Pillars Section */}
      <section className="py-16 sm:py-24 border-b border-slate-800 bg-slate-950/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-black uppercase tracking-widest text-teal-400 block mb-2">
              COMPREHENSIVE CARE ECOSYSTEM
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
              Every medical need, seamlessly linked
            </h2>
            <p className="text-sm sm:text-base text-slate-400 mt-3">
              No repeated medical forms or disconnected clinic records. Experience unified digital healthcare designed around the patient.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {carePillars.map((pillar, idx) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={idx}
                  className={`p-6 sm:p-7 rounded-3xl bg-gradient-to-b ${pillar.color} bg-slate-900/60 border backdrop-blur-md flex flex-col justify-between hover:-translate-y-1 hover:shadow-2xl transition-all duration-300`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="px-2.5 py-1 rounded-full bg-white/10 text-[10px] font-black uppercase tracking-wider text-slate-300">
                        {pillar.badge}
                      </span>
                    </div>

                    <h3 className="text-xl font-black text-white mb-2">{pillar.title}</h3>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal mb-6">
                      {pillar.desc}
                    </p>
                  </div>

                  <button
                    onClick={pillar.action}
                    className="w-full py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer border border-white/10"
                  >
                    <span>{pillar.actionText}</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Interactive Ecosystem Story Tabs */}
      <section className="py-16 sm:py-24 border-b border-slate-800 bg-slate-950/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto mb-10">
            <span className="text-xs font-black uppercase tracking-widest text-teal-400 mb-2 block">
              PATIENT JOURNEY SIMULATOR
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              One connected flow for every health situation
            </h2>
            <p className="text-sm text-slate-400 mt-2">
              Watch how a patient transitions effortlessly from AI Triage → Video OPD → Home Lab Collection → Pharmacy Delivery, with one-tap emergency bed reservations.
            </p>
          </div>

          {/* Interactive Navigation Pills */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-4xl mx-auto mb-8">
            {[
              { id: 'triage', label: '1. AI Triage', icon: Sparkles, tab: 'ai-care', time: 'Instant' },
              { id: 'opd', label: '2. Video OPD', icon: Video, tab: 'opd', time: '15 Mins' },
              { id: 'labs', label: '3. Home Lab Tests', icon: FlaskConical, tab: 'lab-tests', time: 'Same Day' },
              { id: 'ambulance', label: '4. Live 108 Bed Hold', icon: Ambulance, tab: 'emergency', time: '< 12 Mins' },
            ].map((item) => {
              const Icon = item.icon;
              const isActive = activeStoryTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveStoryTab(item.id as any);
                  }}
                  className={`p-4 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center gap-2 ${
                    isActive
                      ? 'bg-teal-950/80 border-teal-500 text-teal-300 shadow-lg shadow-teal-500/10'
                      : 'bg-slate-900/50 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <Icon className="w-4 h-4 text-teal-400" />
                    <span className="text-xs font-black">{item.label}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-bold bg-slate-800/80 px-2 py-0.5 rounded-full">
                    ETA: {item.time}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Interactive Journey Preview Card */}
          <div className="max-w-5xl mx-auto rounded-3xl overflow-hidden border border-slate-800 relative group shadow-2xl bg-slate-900 text-left">
            <div className="grid grid-cols-1 md:grid-cols-12 items-center">
              <div className="md:col-span-7 p-8 sm:p-10 space-y-4">
                <span className="text-xs font-black text-teal-400 uppercase tracking-widest">
                  Integrated Clinical Workflow
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-white">
                  Connected clinical care from home to hospital
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                  No repeating medical history, no misplaced paper reports. When a doctor writes an e-prescription during a video OPD, recommended lab tests automatically map to accredited partners (Dr. Lal PathLabs, Thyrocare) with home collection, and medicines route to verified local pharmacies.
                </p>

                <div className="pt-2 flex flex-wrap gap-3">
                  <button
                    onClick={() => onNavigate('lab-tests')}
                    className="px-5 py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 rounded-xl font-bold text-xs transition-colors cursor-pointer"
                  >
                    Explore Certified Lab Tests
                  </button>
                  <button
                    onClick={() => onNavigate('opd')}
                    className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold text-xs border border-slate-700 transition-colors cursor-pointer"
                  >
                    Browse OPD Doctors
                  </button>
                </div>
              </div>

              <div className="md:col-span-5 relative h-64 md:h-full min-h-[300px]">
                <img
                  src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=800"
                  alt="OneCare Special Ecosystem"
                  className="w-full h-full object-cover opacity-85"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-transparent to-transparent hidden md:block" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dual Primary & Emergency Care Detail */}
      <section className="py-16 sm:py-24 border-b border-slate-800 bg-slate-950/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-extrabold uppercase tracking-widest text-teal-400 block mb-2">
              DUAL ECOSYSTEMS
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              A dedicated ecosystem for every moment
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-2">
              Primary care for planned visits. Critical care for emergency moments.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Primary Care Ecosystem */}
            <div className="bg-slate-900/60 rounded-3xl border border-slate-800 p-8 flex flex-col justify-between hover:border-teal-500/40 transition-colors">
              <div>
                <span className="px-3 py-1 bg-teal-950 text-teal-400 text-xs font-bold rounded-full border border-teal-800/80 inline-block mb-4">
                  Primary Care Ecosystem
                </span>
                <h3 className="text-2xl font-black text-white mb-2">
                  OPD → Rx → Lab Tests → Pharmacy → Follow-up
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 mb-6 font-normal">
                  Book a video or clinic OPD. Our AI prescription reader auto-routes tests and medicines to the right partner — with home collection and delivery.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-300 mb-6">
                  <div className="flex items-center gap-2">
                    <Video className="w-4 h-4 text-teal-400 shrink-0" />
                    <span>Book OPD (video / clinic)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-teal-400 shrink-0" />
                    <span>AI reads prescription</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FlaskConical className="w-4 h-4 text-teal-400 shrink-0" />
                    <span>Lab test with home collection</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-teal-400 shrink-0" />
                    <span>Medicine home delivery</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => onNavigate('lab-tests')}
                className="w-full py-3.5 bg-teal-600 hover:bg-teal-500 text-white font-extrabold rounded-2xl text-xs sm:text-sm transition-all shadow-md cursor-pointer text-center"
              >
                Book Diagnostic Lab Tests
              </button>
            </div>

            {/* Emergency Care Ecosystem */}
            <div className="bg-slate-900/60 rounded-3xl border border-slate-800 p-8 flex flex-col justify-between hover:border-red-500/40 transition-colors">
              <div>
                <span className="px-3 py-1 bg-red-950 text-red-400 text-xs font-bold rounded-full border border-red-800/80 inline-block mb-4">
                  Emergency Care Ecosystem
                </span>
                <h3 className="text-2xl font-black text-white mb-2">
                  Bed reservation → Ambulance → Hospital transfer
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 mb-6 font-normal">
                  Reserve an ICU / NICU / general bed before the ambulance departs. Choose Basic, ALS or Cardiac ICU ambulance — track live dispatch to arrival.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-300 mb-6">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-red-400 shrink-0" />
                    <span>Select hospital & bed</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Ambulance className="w-4 h-4 text-red-400 shrink-0" />
                    <span>Pick ambulance tier</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-red-400 shrink-0" />
                    <span>Live pickup & transfer</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-red-400 shrink-0" />
                    <span>Priority ER handover</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => onNavigate('emergency')}
                className="w-full py-3.5 bg-red-600 hover:bg-red-500 text-white font-extrabold rounded-2xl text-xs sm:text-sm transition-all shadow-md shadow-red-600/30 cursor-pointer text-center"
              >
                Emergency Access (108 SOS)
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Emergency Quick Helpline Bottom Strip */}
      <section className="py-8 bg-gradient-to-r from-red-950/70 via-slate-950 to-red-950/70 border-t border-red-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3.5 text-center sm:text-left">
              <div className="w-12 h-12 rounded-2xl bg-red-600 text-white flex items-center justify-center shrink-0 shadow-lg shadow-red-600/40">
                <Ambulance className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h4 className="text-base font-black text-white">Emergency Medical Assistance in Patna?</h4>
                <p className="text-xs text-red-300">
                  Tap 108 for instant free ambulance dispatch, or connect directly with our 24×7 ICU triage team.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={onOpenSOS}
                className="px-5 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-red-600/30 cursor-pointer transition-transform active:scale-95"
              >
                <PhoneCall className="w-4 h-4 fill-white" />
                <span>Call 108 Free SOS</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

