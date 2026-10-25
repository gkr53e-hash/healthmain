import React, { useState } from 'react';
import {
  X,
  Check,
  Calendar,
  Clock,
  MapPin,
  AlertCircle,
  Sparkles,
  User,
  Phone,
  Home,
  ShieldCheck,
  Building2,
  ChevronRight,
  Info
} from 'lucide-react';
import { BookingItem, BookingMode, BookingRequest, LabPartner, LabTest } from '../types/lab';
import {
  calculateBookingTotal,
  formatCurrency,
  generateBookingId,
  validateBookingForm,
} from '../utils/labBookingLogic';
import { AVAILABLE_TIME_SLOTS } from '../data/labData';

interface BookingModalProps {
  lab: LabPartner;
  tests: LabTest[];
  initialMode?: BookingMode;
  initialSelectedTestIds?: string[];
  onClose: () => void;
  onSuccess: (booking: BookingRequest) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  lab,
  tests,
  initialMode = 'home',
  initialSelectedTestIds = [],
  onClose,
  onSuccess,
}) => {
  const [mode, setMode] = useState<BookingMode>(initialMode);

  // Available tests for this lab
  const testMap = new Map(tests.map((t) => [t.id, t]));
  const labTests = lab.allTestIds.map((id) => testMap.get(id)).filter(Boolean) as LabTest[];

  // Selected tests state
  const [selectedTestIds, setSelectedTestIds] = useState<string[]>(
    initialSelectedTestIds.length > 0
      ? initialSelectedTestIds
      : lab.popularTestIds.length > 0
      ? [lab.popularTestIds[0]]
      : [labTests[0]?.id || '']
  );

  // Form fields
  const todayStr = new Date().toISOString().split('T')[0];
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split('T')[0];

  const [slotDate, setSlotDate] = useState<string>(tomorrowStr);
  const [slotTime, setSlotTime] = useState<string>(AVAILABLE_TIME_SLOTS[1] || '07:30 AM - 08:30 AM');
  const [patientName, setPatientName] = useState<string>('');
  const [patientPhone, setPatientPhone] = useState<string>('');
  const [patientAge, setPatientAge] = useState<string>('');
  const [patientGender, setPatientGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [address, setAddress] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Live calculation
  const selectedTestObjects = selectedTestIds
    .map((id) => testMap.get(id))
    .filter(Boolean) as LabTest[];

  const totals = calculateBookingTotal(selectedTestObjects, mode);

  const toggleTest = (id: string) => {
    setSelectedTestIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      } else {
        return [...prev, id];
      }
    });
    if (errors.tests) {
      setErrors((prev) => ({ ...prev, tests: undefined }));
    }
  };

  const handleConfirm = (e: React.FormEvent) => {
    e.preventDefault();

    const validation = validateBookingForm({
      patientName,
      patientPhone,
      patientAge,
      slotDate,
      slotTime,
      address,
      mode,
      selectedTestIds,
    });

    if (!validation.isValid) {
      setErrors(validation.errors as Record<string, string>);
      return;
    }

    setIsSubmitting(true);

    const bookingItems: BookingItem[] = selectedTestObjects.map((t) => ({
      testId: t.id,
      name: t.name,
      price: t.price,
      category: t.category,
    }));

    const newBooking: BookingRequest = {
      id: generateBookingId(),
      labId: lab.id,
      labName: lab.name,
      labArea: lab.area,
      labAddress: lab.address,
      tests: bookingItems,
      mode,
      slotDate,
      slotTime,
      patientName: patientName.trim(),
      patientPhone: patientPhone.trim(),
      patientAge: patientAge.trim(),
      patientGender,
      address: mode === 'home' ? address.trim() : lab.address,
      notes: notes.trim() || undefined,
      subtotal: totals.subtotal,
      collectionFee: totals.collectionFee,
      totalAmount: totals.totalAmount,
      status: 'Confirmed',
      createdAt: new Date().toISOString(),
    };

    setTimeout(() => {
      setIsSubmitting(false);
      onSuccess(newBooking);
    }, 450);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-xl w-full my-auto shadow-2xl border border-slate-100 overflow-hidden relative flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="booking-modal-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-gradient-to-r from-teal-50/70 via-slate-50 to-white sticky top-0 z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 text-[10px] font-black uppercase tracking-wider bg-teal-100 text-teal-800 rounded-md">
                Certified Diagnostic
              </span>
              {lab.badge && (
                <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-100 text-emerald-800 rounded-md">
                  {lab.badge}
                </span>
              )}
            </div>
            <h2 id="booking-modal-title" className="text-xl font-black text-slate-900 tracking-tight">
              {lab.name}
            </h2>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span>{lab.area}, {lab.city}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <form onSubmit={handleConfirm} className="overflow-y-auto px-6 py-5 space-y-6 flex-1">
          {/* Select Tests Section */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-black uppercase tracking-wider text-slate-700">
                1. Select Diagnostic Tests
              </label>
              <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
                {selectedTestIds.length} of {labTests.length} selected
              </span>
            </div>

            {errors.tests && (
              <p className="text-xs font-semibold text-rose-600 flex items-center gap-1 mb-2 bg-rose-50 p-2 rounded-xl border border-rose-200">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errors.tests}</span>
              </p>
            )}

            <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
              {labTests.map((test) => {
                const isSelected = selectedTestIds.includes(test.id);
                return (
                  <div
                    key={test.id}
                    onClick={() => toggleTest(test.id)}
                    className={`flex items-center justify-between p-3 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-teal-600 bg-teal-50/60 ring-1 ring-teal-600/30 shadow-2xs'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-colors ${
                          isSelected
                            ? 'border-teal-600 bg-teal-600 text-white'
                            : 'border-slate-300 bg-white'
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                      <div>
                        <span className="text-sm font-bold text-slate-900 block">
                          {test.name}
                        </span>
                        <div className="flex items-center gap-2 text-[11px] font-medium text-slate-500">
                          <span className="text-teal-700 font-bold">{test.category}</span>
                          <span>•</span>
                          <span>{test.reportTime}</span>
                          {test.fastingHours ? (
                            <>
                              <span>•</span>
                              <span className="text-amber-700">{test.fastingHours}h fasting</span>
                            </>
                          ) : null}
                        </div>
                      </div>
                    </div>
                    <span className="text-sm font-black text-slate-900">
                      {formatCurrency(test.price)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Mode Toggle */}
          <div>
            <label className="text-xs font-black uppercase tracking-wider text-slate-700 block mb-2">
              2. Appointment Mode
            </label>
            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-2xl border border-slate-200">
              <button
                type="button"
                onClick={() => setMode('home')}
                className={`py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                  mode === 'home'
                    ? 'bg-teal-700 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Home className="w-4 h-4" />
                <span>Home Collection</span>
              </button>
              <button
                type="button"
                onClick={() => setMode('centre')}
                className={`py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                  mode === 'centre'
                    ? 'bg-teal-700 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Building2 className="w-4 h-4" />
                <span>Centre Walk-in</span>
              </button>
            </div>
            {mode === 'home' && totals.collectionFee > 0 && (
              <p className="text-xs text-amber-700 font-medium mt-2 flex items-center gap-1.5 bg-amber-50 p-2 rounded-xl border border-amber-200">
                <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span>Add ₹{totals.freeThreshold - totals.subtotal} more to unlock <strong>FREE Home Collection</strong>!</span>
              </p>
            )}
            {mode === 'home' && totals.freeCollectionQualified && (
              <p className="text-xs text-emerald-800 font-bold mt-2 flex items-center gap-1.5 bg-emerald-50 p-2 rounded-xl border border-emerald-200">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>100% Free Home Sample Collection Applied!</span>
              </p>
            )}
          </div>

          {/* Slot Selection */}
          <div className="space-y-3">
            <label className="text-xs font-black uppercase tracking-wider text-slate-700 block">
              3. Date & Time Slot
            </label>
            
            {/* Quick date picks & date input */}
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setSlotDate(todayStr)}
                className={`py-2 px-3 text-xs font-bold rounded-xl border text-center transition-all cursor-pointer ${
                  slotDate === todayStr
                    ? 'bg-teal-700 border-teal-700 text-white shadow-xs'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                Today
              </button>
              <button
                type="button"
                onClick={() => setSlotDate(tomorrowStr)}
                className={`py-2 px-3 text-xs font-bold rounded-xl border text-center transition-all cursor-pointer ${
                  slotDate === tomorrowStr
                    ? 'bg-teal-700 border-teal-700 text-white shadow-xs'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                Tomorrow
              </button>
              <div className="relative">
                <input
                  type="date"
                  min={todayStr}
                  value={slotDate}
                  onChange={(e) => setSlotDate(e.target.value)}
                  className="w-full py-2 px-2.5 text-xs font-bold rounded-xl border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-600"
                />
              </div>
            </div>

            {/* Time Slot Picker */}
            <div>
              <div className="relative">
                <select
                  value={slotTime}
                  onChange={(e) => setSlotTime(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-600 appearance-none cursor-pointer"
                >
                  {AVAILABLE_TIME_SLOTS.map((slot) => (
                    <option key={slot} value={slot}>
                      {slot} (Slots Available)
                    </option>
                  ))}
                </select>
                <Clock className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
              {errors.slotTime && (
                <p className="text-xs font-semibold text-rose-600 mt-1">{errors.slotTime}</p>
              )}
            </div>
          </div>

          {/* Patient Details */}
          <div className="space-y-3 pt-3 border-t border-slate-100">
            <label className="text-xs font-black uppercase tracking-wider text-slate-700 block">
              4. Patient Details
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <input
                  type="text"
                  placeholder="Patient Full Name"
                  value={patientName}
                  onChange={(e) => {
                    setPatientName(e.target.value);
                    if (errors.patientName) setErrors((prev) => ({ ...prev, patientName: undefined }));
                  }}
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm font-medium outline-none focus:ring-2 focus:ring-teal-600 transition-all ${
                    errors.patientName ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200 bg-slate-50/50 focus:bg-white'
                  }`}
                />
                {errors.patientName && (
                  <p className="text-[11px] font-semibold text-rose-600 mt-1">{errors.patientName}</p>
                )}
              </div>

              <div>
                <input
                  type="tel"
                  placeholder="10-Digit Mobile Number"
                  maxLength={10}
                  value={patientPhone}
                  onChange={(e) => {
                    setPatientPhone(e.target.value);
                    if (errors.patientPhone) setErrors((prev) => ({ ...prev, patientPhone: undefined }));
                  }}
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm font-medium outline-none focus:ring-2 focus:ring-teal-600 transition-all ${
                    errors.patientPhone ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200 bg-slate-50/50 focus:bg-white'
                  }`}
                />
                {errors.patientPhone && (
                  <p className="text-[11px] font-semibold text-rose-600 mt-1">{errors.patientPhone}</p>
                )}
              </div>

              <div>
                <input
                  type="number"
                  placeholder="Age in Years (e.g. 35)"
                  min={1}
                  max={120}
                  value={patientAge}
                  onChange={(e) => {
                    setPatientAge(e.target.value);
                    if (errors.patientAge) setErrors((prev) => ({ ...prev, patientAge: undefined }));
                  }}
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm font-medium outline-none focus:ring-2 focus:ring-teal-600 transition-all ${
                    errors.patientAge ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200 bg-slate-50/50 focus:bg-white'
                  }`}
                />
                {errors.patientAge && (
                  <p className="text-[11px] font-semibold text-rose-600 mt-1">{errors.patientAge}</p>
                )}
              </div>

              <div className="flex rounded-xl border border-slate-200 overflow-hidden p-0.5 bg-slate-100">
                {(['Male', 'Female', 'Other'] as const).map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setPatientGender(g)}
                    className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                      patientGender === g
                        ? 'bg-white text-slate-900 shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Address Section */}
          <div className="space-y-1.5">
            <label className="text-xs font-black uppercase tracking-wider text-slate-700 block">
              {mode === 'home' ? '5. Home Collection Address' : '5. Centre Location'}
            </label>
            {mode === 'home' ? (
              <div>
                <input
                  type="text"
                  placeholder="Complete Address (House/Flat No, Landmark, Area in Patna)"
                  value={address}
                  onChange={(e) => {
                    setAddress(e.target.value);
                    if (errors.address) setErrors((prev) => ({ ...prev, address: undefined }));
                  }}
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm font-medium outline-none focus:ring-2 focus:ring-teal-600 transition-all ${
                    errors.address ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200 bg-slate-50/50 focus:bg-white'
                  }`}
                />
                {errors.address && (
                  <p className="text-[11px] font-semibold text-rose-600 mt-1">{errors.address}</p>
                )}
              </div>
            ) : (
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-600 space-y-1">
                <p className="font-bold text-slate-900">{lab.name} — Main Diagnostic Centre</p>
                <p>{lab.address}</p>
                <p className="text-teal-700 font-semibold pt-1">
                  ✓ Photo ID & booking QR code required on arrival.
                </p>
              </div>
            )}
          </div>

          {/* Pricing Breakdown Summary Card */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-600">
              <span>Tests Subtotal ({selectedCount(selectedTestIds)}):</span>
              <span className="font-bold text-slate-900">{formatCurrency(totals.subtotal)}</span>
            </div>

            {mode === 'home' && (
              <div className="flex items-center justify-between text-xs text-slate-600">
                <span>Phlebotomist Home Dispatch:</span>
                <span className={totals.collectionFee === 0 ? 'text-emerald-700 font-bold' : 'font-bold text-slate-900'}>
                  {totals.collectionFee === 0 ? 'FREE' : formatCurrency(totals.collectionFee)}
                </span>
              </div>
            )}

            <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-900 block">Total Payable</span>
                <span className="text-[11px] text-slate-500">Pay online or after sample collection</span>
              </div>
              <span className="text-xl font-black text-teal-700">
                {formatCurrency(totals.totalAmount)}
              </span>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-1">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 active:scale-98 text-white font-black text-sm sm:text-base transition-all shadow-lg shadow-teal-700/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Confirming Certified Appointment...</span>
                </>
              ) : mode === 'home' ? (
                <span>Confirm Home Sample Collection →</span>
              ) : (
                <span>Confirm Centre Visit Appointment →</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

function selectedCount(ids: string[]): string {
  return `${ids.length} ${ids.length === 1 ? 'test' : 'tests'}`;
}

