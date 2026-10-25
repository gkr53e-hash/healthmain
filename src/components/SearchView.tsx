import React, { useState } from 'react';
import {
  Search,
  Stethoscope,
  FlaskConical,
  Pill,
  Building2,
  ArrowRight,
  Sparkles,
  MapPin,
  Star,
  Clock,
  ChevronRight,
} from 'lucide-react';
import { ALL_TESTS, CERTIFIED_LABS } from '../data/labData';
import { LabPartner, LabTest } from '../types/lab';

interface SearchViewProps {
  onSelectLab: (lab: LabPartner) => void;
  onNavigate: (tab: string) => void;
}

export const SearchView: React.FC<SearchViewProps> = ({ onSelectLab, onNavigate }) => {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<'all' | 'tests' | 'labs' | 'services'>('all');

  const q = query.toLowerCase().trim();

  const trendingQueries = [
    'CBC Blood Count',
    'Thyroid Profile',
    'Lipid & Cholesterol',
    'Dr. Lal PathLabs',
    'Cardiologist',
    'Paracetamol 650',
    'ICU Bed AIIMS',
  ];

  const matchingTests = q
    ? ALL_TESTS.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q)
      )
    : ALL_TESTS.slice(0, 6);

  const matchingLabs = q
    ? CERTIFIED_LABS.filter(
        (l) => l.name.toLowerCase().includes(q) || l.area.toLowerCase().includes(q)
      )
    : CERTIFIED_LABS.slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Search Header */}
      <div className="max-w-2xl mx-auto text-center mb-8">
        <span className="text-xs font-black tracking-widest uppercase text-teal-700 bg-teal-50 border border-teal-200/80 px-2.5 py-1 rounded-md inline-block mb-2">
          GLOBAL HEALTH DIRECTORY
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Search OneCare Special
        </h1>
        <p className="text-sm text-slate-600 mt-2 font-medium">
          Instant access to certified lab tests, specialists, pharmacy delivery, and 108 emergency beds.
        </p>

        {/* Search Input Box */}
        <div className="relative mt-6">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tests (CBC, Thyroid), doctors, pharmacies, or ICU beds..."
            className="w-full pl-12 pr-10 py-4 rounded-2xl border border-slate-300 bg-white shadow-md text-sm font-medium outline-none focus:ring-2 focus:ring-teal-600 focus:border-teal-600 transition-all"
            autoFocus
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>

        {/* Trending Searches */}
        <div className="flex items-center justify-center gap-1.5 flex-wrap mt-3 text-xs">
          <span className="text-slate-400 font-bold text-[11px]">Trending:</span>
          {trendingQueries.map((item, idx) => (
            <button
              key={idx}
              onClick={() => setQuery(item)}
              className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-teal-50 hover:text-teal-800 text-slate-600 border border-slate-200 text-[11px] font-semibold transition-colors cursor-pointer"
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="max-w-4xl mx-auto flex items-center justify-center gap-2 mb-8 border-b border-slate-200 pb-3">
        {[
          { id: 'all', label: 'All Results' },
          { id: 'tests', label: `Diagnostic Tests (${matchingTests.length})` },
          { id: 'labs', label: `Certified Labs (${matchingLabs.length})` },
          { id: 'services', label: 'Care Services' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveCategory(tab.id as any)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeCategory === tab.id
                ? 'bg-teal-700 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="space-y-8 max-w-4xl mx-auto">
        {/* Lab Tests Results */}
        {(activeCategory === 'all' || activeCategory === 'tests') && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <FlaskConical className="w-4 h-4 text-teal-600" />
                <span>Diagnostic Lab Tests</span>
              </span>
              <button
                onClick={() => onNavigate('lab-tests')}
                className="text-xs font-bold text-teal-700 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>View all tests</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {matchingTests.map((test) => (
                <div
                  key={test.id}
                  onClick={() => {
                    onSelectLab(CERTIFIED_LABS[0]);
                  }}
                  className="p-4 bg-white rounded-2xl border border-slate-200/90 hover:border-teal-400 hover:shadow-md transition-all cursor-pointer flex items-center justify-between gap-3 group"
                >
                  <div className="min-w-0 flex-1">
                    <h4 className="font-extrabold text-sm text-slate-900 group-hover:text-teal-700 transition-colors truncate">
                      {test.name}
                    </h4>
                    <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-500">
                      <span className="font-bold text-slate-400 uppercase tracking-wider">{test.category}</span>
                      <span>•</span>
                      <span className="flex items-center gap-0.5">
                        <Clock className="w-3 h-3 text-slate-400" />
                        {test.reportTime}
                      </span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-base font-black text-teal-700 block">₹{test.price}</span>
                    <span className="text-[10px] text-teal-600 font-bold group-hover:underline">Book Test →</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Certified Labs Results */}
        {(activeCategory === 'all' || activeCategory === 'labs') && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-black uppercase tracking-wider text-slate-500 block">
                Certified Partner Laboratories
              </span>
              <button
                onClick={() => onNavigate('lab-tests')}
                className="text-xs font-bold text-teal-700 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>View all labs</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              {matchingLabs.map((lab) => (
                <div
                  key={lab.id}
                  onClick={() => onSelectLab(lab)}
                  className="p-5 bg-white rounded-2xl border border-slate-200/90 hover:border-teal-400 hover:shadow-md transition-all cursor-pointer group"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-extrabold text-sm text-slate-900 group-hover:text-teal-700 transition-colors">
                      {lab.name}
                    </h4>
                    <span className="flex items-center gap-1 text-[11px] font-bold text-slate-800 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200">
                      <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                      {lab.rating}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    <span>{lab.area}</span>
                  </p>
                  <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] font-bold text-emerald-700">✓ Home Collection</span>
                    <span className="text-xs font-bold text-teal-700">Browse Menu →</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Service shortcuts */}
        {(activeCategory === 'all' || activeCategory === 'services') && (
          <div className="pt-2">
            <span className="text-xs font-black uppercase tracking-wider text-slate-500 block mb-4">
              OneCare Special Care Services
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div
                onClick={() => onNavigate('opd')}
                className="p-5 rounded-2xl bg-teal-50/70 border border-teal-200 flex items-center gap-3.5 cursor-pointer hover:bg-teal-50 transition-colors group shadow-2xs"
              >
                <div className="w-12 h-12 rounded-xl bg-teal-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                  <Stethoscope className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-black text-sm text-slate-900 group-hover:text-teal-800 transition-colors">
                    OPD Specialists
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">Video consultation or clinic visit</p>
                </div>
              </div>

              <div
                onClick={() => onNavigate('pharmacy')}
                className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200 flex items-center gap-3.5 cursor-pointer hover:bg-amber-50 transition-colors group shadow-2xs"
              >
                <div className="w-12 h-12 rounded-xl bg-amber-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                  <Pill className="w-6 h-6 rotate-45" />
                </div>
                <div>
                  <p className="font-black text-sm text-slate-900 group-hover:text-amber-800 transition-colors">
                    Order Medicines
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">45-min doorstep delivery</p>
                </div>
              </div>

              <div
                onClick={() => onNavigate('emergency')}
                className="p-5 rounded-2xl bg-red-50/70 border border-red-200 flex items-center gap-3.5 cursor-pointer hover:bg-red-50 transition-colors group shadow-2xs"
              >
                <div className="w-12 h-12 rounded-xl bg-red-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                  <Building2 className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-black text-sm text-slate-900 group-hover:text-red-800 transition-colors">
                    Emergency ICU Beds
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">Reserve bed & dispatch ambulance</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

