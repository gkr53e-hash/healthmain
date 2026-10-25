import React, { useState } from 'react';
import {
  ArrowLeft,
  FlaskConical,
  MapPin,
  Star,
  Plus,
  Check,
  Clock,
  Droplets,
  Info,
  ShieldCheck,
  Search,
  Sparkles,
  FileCheck2,
  PhoneCall,
  Calendar
} from 'lucide-react';
import { LabPartner, LabTest } from '../types/lab';
import { formatCurrency } from '../utils/labBookingLogic';

interface LabDetailViewProps {
  lab: LabPartner;
  tests: LabTest[];
  onBack: () => void;
  onOpenBooking: (lab: LabPartner, preselectedTestIds?: string[]) => void;
}

export const LabDetailView: React.FC<LabDetailViewProps> = ({
  lab,
  tests,
  onBack,
  onOpenBooking,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTestIds, setSelectedTestIds] = useState<string[]>([]);
  const [searchFilter, setSearchFilter] = useState('');

  const testMap = new Map(tests.map((t) => [t.id, t]));
  const labTests = lab.allTestIds.map((id) => testMap.get(id)).filter(Boolean) as LabTest[];

  const filteredTests = labTests.filter((test) => {
    if (selectedCategory !== 'all' && test.category.toLowerCase() !== selectedCategory.toLowerCase()) {
      return false;
    }
    if (searchFilter) {
      const q = searchFilter.toLowerCase();
      return (
        test.name.toLowerCase().includes(q) ||
        test.category.toLowerCase().includes(q) ||
        test.description.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const toggleTest = (id: string) => {
    setSelectedTestIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const selectedCount = selectedTestIds.length;
  const selectedTotal = selectedTestIds.reduce((sum, id) => {
    const t = testMap.get(id);
    return sum + (t ? t.price : 0);
  }, 0);

  const categories = ['all', 'Pathology', 'Cardiology', 'Radiology', 'Health Packages'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-300">
      {/* Back Button & Breadcrumbs */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-teal-700 px-3.5 py-2 rounded-xl hover:bg-teal-50 border border-slate-200 hover:border-teal-200 transition-all cursor-pointer shadow-xs"
          aria-label="Back to labs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Certified Labs</span>
        </button>

        <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-slate-500">
          <span>Diagnostics</span>
          <span>/</span>
          <span className="text-slate-900">{lab.name}</span>
        </div>
      </div>

      {/* Main Lab Hero Header Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 mb-8 shadow-sm relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-teal-500/5 rounded-full blur-3xl -z-10 pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          <div className="flex items-start gap-5">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-teal-50 to-emerald-100 border border-teal-200/60 flex items-center justify-center shrink-0 text-teal-700 shadow-sm shadow-teal-700/10">
              <FlaskConical className="w-8 h-8 sm:w-10 sm:h-10 text-teal-700" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold bg-teal-50 text-teal-800 rounded-full border border-teal-200">
                  <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
                  NABL & ICMR Certified Lab
                </span>
                {lab.badge && (
                  <span className="px-2.5 py-1 text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full">
                    {lab.badge}
                  </span>
                )}
                <span className="px-2.5 py-1 text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 rounded-full">
                  Home Collection Available
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {lab.name}
              </h1>

              <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-slate-500 font-medium">
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  <span>
                    {lab.area}, {lab.city}
                  </span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1 font-bold text-slate-800">
                  <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                  <span>{lab.rating.toFixed(1)}</span>
                  <span className="text-slate-400 font-normal">({lab.reviewsCount} verified patient reviews)</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1 text-emerald-700 font-semibold">
                  <Clock className="w-4 h-4 text-emerald-600" />
                  <span>Open: {lab.openingHours}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <button
              onClick={() => onOpenBooking(lab, selectedTestIds)}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-bold text-white bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 rounded-xl shadow-md shadow-teal-700/20 active:scale-98 transition-all cursor-pointer text-center"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Appointment ({selectedCount > 0 ? `${selectedCount} Tests` : 'Choose Tests'})</span>
            </button>
          </div>
        </div>

        {/* Assurance Features strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6">
          <div className="flex items-center gap-3 p-3 bg-slate-50/80 rounded-xl border border-slate-100">
            <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center shrink-0">
              <Droplets className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">Sterile Vacuum Phlebotomy</p>
              <p className="text-[11px] text-slate-500">100% painless vacuum tubes</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-slate-50/80 rounded-xl border border-slate-100">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">Guaranteed Fast Delivery</p>
              <p className="text-[11px] text-slate-500">Reports in 6 to 24 hrs</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-slate-50/80 rounded-xl border border-slate-100">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center shrink-0">
              <FileCheck2 className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">QR-Verified Digital Report</p>
              <p className="text-[11px] text-slate-500">Direct on Portal & WhatsApp</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-slate-50/80 rounded-xl border border-slate-100">
            <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-800 flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">Free AI Biomarker Review</p>
              <p className="text-[11px] text-slate-500">Included with all bookings</p>
            </div>
          </div>
        </div>

        {/* Test Catalogue & Pricing Section */}
        <div className="pt-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-extrabold uppercase tracking-widest text-teal-700">
                  TEST CATALOGUE & DIRECT PRICING
                </span>
                <span className="text-xs bg-slate-100 text-slate-600 font-bold px-2 py-0.5 rounded-full">
                  {filteredTests.length} tests available
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Select individual tests or packages to include in your home collection or walk-in appointment.
              </p>
            </div>

            {/* Test Search & Quick Filters */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="relative min-w-[220px]">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  placeholder="Filter tests (e.g. Lipid, CBC)..."
                  className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                />
              </div>

              {/* Quick Category Chips */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                      selectedCategory.toLowerCase() === cat.toLowerCase()
                        ? 'bg-teal-700 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {cat === 'all' ? 'All Tests' : cat}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Test Grid (2 Columns) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {filteredTests.map((test) => {
              const isSelected = selectedTestIds.includes(test.id);
              return (
                <div
                  key={test.id}
                  onClick={() => toggleTest(test.id)}
                  className={`border rounded-2xl p-4.5 transition-all cursor-pointer flex items-center justify-between gap-4 group ${
                    isSelected
                      ? 'border-teal-500 bg-teal-50/50 ring-2 ring-teal-500/30 shadow-xs'
                      : 'border-slate-200 bg-white hover:border-teal-300 hover:shadow-xs'
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-slate-900 text-sm sm:text-base group-hover:text-teal-800 transition-colors">
                        {test.name}
                      </h4>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 mt-1.5 text-xs text-slate-500">
                      <span className="font-extrabold tracking-wider text-[10px] uppercase text-teal-800 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-100">
                        {test.category}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        {test.reportTime}
                      </span>
                      {test.fastingHours ? (
                        <>
                          <span>•</span>
                          <span className="text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded font-medium border border-amber-200/60">
                            {test.fastingHours}h Fasting
                          </span>
                        </>
                      ) : null}
                    </div>
                    <p className="text-xs text-slate-500 line-clamp-1 mt-1.5 font-normal">
                      {test.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right">
                      <span className="text-base sm:text-lg font-black text-teal-700 block">
                        {formatCurrency(test.price)}
                      </span>
                      {test.originalPrice && (
                        <span className="text-xs text-slate-400 line-through">
                          {formatCurrency(test.originalPrice)}
                        </span>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleTest(test.id);
                      }}
                      className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-teal-700 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-600 group-hover:bg-teal-600 group-hover:text-white'
                      }`}
                      aria-label={isSelected ? 'Remove test' : 'Add test'}
                    >
                      {isSelected ? <Check className="w-4 h-4 stroke-[3]" /> : <Plus className="w-4 h-4 stroke-[2.5]" />}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredTests.length === 0 && (
            <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              <FlaskConical className="w-10 h-10 text-slate-400 mx-auto mb-2 opacity-50" />
              <p className="text-sm font-bold text-slate-700">No diagnostic tests found</p>
              <p className="text-xs text-slate-500 mt-1">Try resetting the category filter or searching a different term.</p>
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSearchFilter('');
                }}
                className="mt-3 px-3 py-1.5 text-xs font-bold text-teal-700 bg-teal-50 hover:bg-teal-100 rounded-lg cursor-pointer"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Sticky Bottom Summary Bar if tests are selected */}
      {selectedCount > 0 && (
        <div className="fixed bottom-5 left-4 right-4 max-w-4xl mx-auto z-40 bg-slate-900/95 backdrop-blur-md text-white rounded-2xl p-4 sm:p-5 shadow-2xl flex items-center justify-between gap-4 border border-slate-800 animate-in slide-in-from-bottom duration-300 ring-1 ring-white/10">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="px-2.5 py-0.5 text-xs font-black bg-teal-400 text-slate-950 rounded-md">
                {selectedCount} {selectedCount === 1 ? 'test' : 'tests'} selected
              </span>
              <span className="text-xl font-black text-white">
                {formatCurrency(selectedTotal)}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1 hidden sm:block">
              Free home phlebotomist dispatch • Certified report synced with OneCare Special & WhatsApp
            </p>
          </div>
          <button
            onClick={() => onOpenBooking(lab, selectedTestIds)}
            className="px-6 py-3 bg-gradient-to-r from-teal-400 to-emerald-400 hover:from-teal-300 hover:to-emerald-300 text-slate-950 font-black rounded-xl text-sm transition-all cursor-pointer shadow-lg active:scale-98 shrink-0"
          >
            Continue to Slot Booking →
          </button>
        </div>
      )}
    </div>
  );
};

