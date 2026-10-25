import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Crosshair,
  Search,
  Star,
  MapPin,
  Video,
  Stethoscope,
  Calendar,
  Clock,
  X,
  CheckCircle2,
  User,
  Phone,
  ShieldCheck,
  Building,
  Heart,
  Award,
  Zap,
  Filter,
} from 'lucide-react';
import { api, Doctor } from '../services/api';
import { BookingRequest } from '../types/lab';

interface OpdViewProps {
  onOpenAI: () => void;
  onOpenLocation: () => void;
  selectedLocationName: string;
  onBookingSuccess: (booking: BookingRequest) => void;
}

export const OpdView: React.FC<OpdViewProps> = ({
  onOpenAI,
  onOpenLocation,
  selectedLocationName,
  onBookingSuccess,
}) => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [searchName, setSearchName] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('All');
  const [loading, setLoading] = useState(true);

  // Doctor booking modal state
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [consultMode, setConsultMode] = useState<'video' | 'clinic'>('video');
  const [patientName, setPatientName] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [slotDate, setSlotDate] = useState('Tomorrow');
  const [slotTime, setSlotTime] = useState('04:30 PM - 05:00 PM');
  const [bookingConfirmed, setBookingConfirmed] = useState<any | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const specialties = [
    { label: 'All', icon: Stethoscope },
    { label: 'General Physician', icon: User },
    { label: 'Cardiologist', icon: Heart },
    { label: 'Pediatrician', icon: Award },
    { label: 'Orthopedic Surgeon', icon: ShieldCheck },
    { label: 'Gynecologist', icon: Heart },
    { label: 'Neurologist', icon: Zap },
    { label: 'Dermatologist', icon: Sparkles },
    { label: 'ENT Specialist', icon: Stethoscope },
  ];

  const fetchDoctors = async () => {
    setLoading(true);
    const data = await api.getDoctors({
      specialty: selectedSpecialty === 'All' ? undefined : selectedSpecialty,
      search: searchName.trim() || undefined,
    });
    if (data) {
      setDoctors(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchDoctors();
  }, [selectedSpecialty]);

  const handleApplyFilter = (e: React.FormEvent) => {
    e.preventDefault();
    fetchDoctors();
  };

  const handleBookDoctor = (doc: Doctor, mode: 'video' | 'clinic') => {
    setSelectedDoctor(doc);
    setConsultMode(mode);
    setBookingConfirmed(null);
    setError('');
  };

  const handleConfirmConsultation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName.trim()) {
      setError('Please enter patient name');
      return;
    }
    if (patientPhone.replace(/\D/g, '').length !== 10) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }

    setSubmitting(true);
    const newBooking: any = {
      id: `OPD-${Math.floor(10000 + Math.random() * 90000)}`,
      type: 'doctor',
      labId: selectedDoctor!.id,
      labName: selectedDoctor!.name,
      labArea: selectedDoctor!.location,
      labAddress: consultMode === 'video' ? 'Online Tele-Consult (OneCare Special Video)' : selectedDoctor!.location,
      tests: [
        {
          testId: `doc-${selectedDoctor!.id}`,
          name: `${selectedDoctor!.specialty} (${consultMode === 'video' ? 'Video Call' : 'Clinic Visit'})`,
          price: selectedDoctor!.fee,
          category: 'Cardiology',
        },
      ],
      mode: consultMode === 'video' ? 'home' : 'centre',
      slotDate,
      slotTime,
      patientName: patientName.trim(),
      patientPhone: patientPhone.trim(),
      patientAge: '30',
      patientGender: 'Male',
      address: consultMode === 'video' ? 'Secure HD Video Link will be sent via SMS/WhatsApp' : selectedDoctor!.location,
      subtotal: selectedDoctor!.fee,
      collectionFee: 0,
      totalAmount: selectedDoctor!.fee,
      status: 'Confirmed',
      createdAt: new Date().toISOString(),
    };

    // Save to backend
    await api.createBooking(newBooking);

    setTimeout(() => {
      setSubmitting(false);
      setBookingConfirmed(newBooking);
      onBookingSuccess(newBooking);
    }, 400);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
        <div>
          <span className="text-xs font-black tracking-widest uppercase text-teal-700 bg-teal-50 border border-teal-200/80 px-2.5 py-1 rounded-md inline-block mb-2">
            PRIMARY CARE & SPECIALISTS
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            Book OPD Consultation
          </h1>
          <p className="text-sm sm:text-base text-slate-600 mt-2 font-medium max-w-2xl">
            Connect with Patna's leading specialists via encrypted video consult or in-clinic visit with verified appointment passes.
          </p>
        </div>

        {/* Action Buttons top right */}
        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={onOpenAI}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 hover:border-teal-500 hover:bg-teal-50/50 rounded-2xl text-xs sm:text-sm font-bold text-slate-800 transition-all shadow-xs cursor-pointer group"
          >
            <Sparkles className="w-4 h-4 text-teal-600 group-hover:rotate-12 transition-transform" />
            <span>Not sure? Ask Clinical AI</span>
          </button>

          <button
            onClick={onOpenLocation}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 hover:border-slate-300 rounded-2xl text-xs sm:text-sm font-bold text-slate-800 transition-all shadow-xs cursor-pointer"
          >
            <Crosshair className="w-4 h-4 text-slate-600" />
            <span>{selectedLocationName}</span>
          </button>
        </div>
      </div>

      {/* Specialty Filter Horizontal Scroll Pills */}
      <div className="mb-6 overflow-x-auto pb-2 flex items-center gap-2">
        {specialties.map((spec) => {
          const Icon = spec.icon;
          const isActive = selectedSpecialty === spec.label;
          return (
            <button
              key={spec.label}
              onClick={() => setSelectedSpecialty(spec.label)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold flex items-center gap-2 shrink-0 transition-all cursor-pointer border ${
                isActive
                  ? 'bg-teal-700 text-white border-teal-700 shadow-md shadow-teal-700/20'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-teal-600'}`} />
              <span>{spec.label}</span>
            </button>
          );
        })}
      </div>

      {/* Search Bar */}
      <form
        onSubmit={handleApplyFilter}
        className="bg-white rounded-3xl border border-slate-200/90 p-4 sm:p-5 mb-8 shadow-xs"
      >
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search doctor by name, qualification, or hospital..."
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 bg-slate-50/50 text-sm font-medium outline-none focus:bg-white focus:ring-2 focus:ring-teal-600 focus:border-teal-600 transition-all"
            />
            {searchName && (
              <button
                type="button"
                onClick={() => setSearchName('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-600"
              >
                Clear
              </button>
            )}
          </div>

          <button
            type="submit"
            className="w-full sm:w-auto py-3 px-6 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl text-xs sm:text-sm font-black transition-all shadow-md cursor-pointer shrink-0"
          >
            Search Doctors
          </button>
        </div>
      </form>

      {/* Doctor Cards Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="bg-white rounded-3xl border border-slate-200 p-6 animate-pulse h-64" />
          ))}
        </div>
      ) : doctors.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center">
          <Stethoscope className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">No doctors found</h3>
          <p className="text-xs text-slate-500 mt-1 mb-4">
            Try resetting your specialty filter or search term.
          </p>
          <button
            onClick={() => {
              setSelectedSpecialty('All');
              setSearchName('');
            }}
            className="px-4 py-2 bg-teal-700 text-white rounded-xl text-xs font-bold"
          >
            Show All Doctors
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {doctors.map((doc) => (
            <div
              key={doc.id}
              className="bg-white rounded-3xl border border-slate-200/90 p-6 flex flex-col justify-between hover:shadow-xl hover:border-teal-200 transition-all duration-300 group"
            >
              <div>
                {/* Doctor Header */}
                <div className="flex items-start gap-4 mb-4">
                  <div className="relative shrink-0">
                    <img
                      src={doc.avatar}
                      alt={doc.name}
                      className="w-18 h-18 rounded-2xl object-cover border border-slate-100 shadow-xs group-hover:scale-102 transition-transform"
                    />
                    <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 ring-2 ring-white" title="Verified Available" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h3 className="text-base font-extrabold text-slate-900 truncate">
                        {doc.name}
                      </h3>
                      <span title="Verified Specialist">
                        <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0" />
                      </span>
                    </div>

                    <p className="text-xs font-bold text-teal-700 mt-0.5">{doc.specialty}</p>

                    <div className="flex items-center gap-2 text-xs text-slate-500 mt-1.5 font-medium flex-wrap">
                      <span className="flex items-center gap-1 font-bold text-slate-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                        <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                        {doc.rating}
                      </span>
                      <span>•</span>
                      <span className="text-slate-600 font-semibold">{doc.experience}</span>
                    </div>

                    <div className="flex items-center gap-1 text-xs text-slate-500 mt-1.5 truncate">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{doc.location}</span>
                    </div>
                  </div>
                </div>

                {/* Available Slot Badge */}
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs mb-4">
                  <span className="text-slate-500 font-medium flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-teal-600" />
                    Next Slot:
                  </span>
                  <span className="font-extrabold text-teal-800">Today, 04:30 PM</span>
                </div>
              </div>

              {/* Fee & Action Buttons */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Consult Fee</span>
                  <span className="text-lg font-black text-slate-900">₹{doc.fee}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleBookDoctor(doc, 'video')}
                    className="px-3.5 py-2 text-xs font-extrabold text-slate-800 bg-white border border-slate-200 hover:border-teal-500 rounded-xl hover:bg-teal-50/50 flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
                  >
                    <Video className="w-3.5 h-3.5 text-teal-600" />
                    <span>Video OPD</span>
                  </button>
                  <button
                    onClick={() => handleBookDoctor(doc, 'clinic')}
                    className="px-3.5 py-2 text-xs font-extrabold text-white bg-teal-700 hover:bg-teal-800 rounded-xl shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Stethoscope className="w-3.5 h-3.5" />
                    <span>Clinic Visit</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Doctor Booking Modal */}
      {selectedDoctor && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in duration-200"
          onClick={() => setSelectedDoctor(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-100 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedDoctor(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {bookingConfirmed ? (
              <div className="text-center py-4">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-black text-slate-900">Consultation Confirmed!</h3>
                <p className="text-xs text-slate-500 mt-1 mb-4">
                  Appointment ID: <strong className="font-mono text-slate-800">{bookingConfirmed.id}</strong>
                </p>
                <div className="bg-slate-50 rounded-2xl p-4 text-left text-xs space-y-2 mb-5 border border-slate-200">
                  <p><strong>Doctor:</strong> {selectedDoctor.name} ({selectedDoctor.specialty})</p>
                  <p><strong>Date & Time:</strong> {bookingConfirmed.slotDate} • {bookingConfirmed.slotTime}</p>
                  <p><strong>Mode:</strong> {consultMode === 'video' ? 'Secure Tele-Consult Video Call' : 'In-Clinic Visit'}</p>
                  <p><strong>Fee:</strong> ₹{selectedDoctor.fee}</p>
                </div>
                <button
                  onClick={() => setSelectedDoctor(null)}
                  className="w-full py-3 bg-teal-700 hover:bg-teal-800 text-white rounded-xl font-black text-sm cursor-pointer shadow-md"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleConfirmConsultation} className="space-y-4">
                {/* Doctor preview */}
                <div className="flex items-center gap-3.5 pb-4 border-b border-slate-100">
                  <img
                    src={selectedDoctor.avatar}
                    alt={selectedDoctor.name}
                    className="w-14 h-14 rounded-2xl object-cover border border-slate-200"
                  />
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900">{selectedDoctor.name}</h3>
                    <p className="text-xs text-teal-700 font-bold">{selectedDoctor.specialty}</p>
                    <p className="text-[11px] text-slate-500">{selectedDoctor.experience} • {selectedDoctor.location}</p>
                  </div>
                </div>

                {/* Mode toggle */}
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">Consultation Mode</label>
                  <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-2xl border border-slate-200">
                    <button
                      type="button"
                      onClick={() => setConsultMode('video')}
                      className={`py-2.5 text-xs font-extrabold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                        consultMode === 'video' ? 'bg-teal-700 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <Video className="w-4 h-4" />
                      <span>Video Call</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setConsultMode('clinic')}
                      className={`py-2.5 text-xs font-extrabold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                        consultMode === 'clinic' ? 'bg-teal-700 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <Stethoscope className="w-4 h-4" />
                      <span>In-Clinic Visit</span>
                    </button>
                  </div>
                </div>

                {/* Date & Time selection */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Date</label>
                    <select
                      value={slotDate}
                      onChange={(e) => setSlotDate(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-800 outline-none focus:ring-2 focus:ring-teal-600"
                    >
                      <option value="Today">Today</option>
                      <option value="Tomorrow">Tomorrow</option>
                      <option value="Day After">Day After</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Time Slot</label>
                    <select
                      value={slotTime}
                      onChange={(e) => setSlotTime(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-800 outline-none focus:ring-2 focus:ring-teal-600"
                    >
                      <option value="10:00 AM - 10:30 AM">10:00 AM - 10:30 AM</option>
                      <option value="02:30 PM - 03:00 PM">02:30 PM - 03:00 PM</option>
                      <option value="04:30 PM - 05:00 PM">04:30 PM - 05:00 PM</option>
                      <option value="06:30 PM - 07:00 PM">06:30 PM - 07:00 PM</option>
                    </select>
                  </div>
                </div>

                {/* Patient inputs */}
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Patient Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Sharma"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium outline-none focus:ring-2 focus:ring-teal-600"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">10-Digit Mobile Number</label>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    placeholder="e.g. 9876543210"
                    value={patientPhone}
                    onChange={(e) => setPatientPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium outline-none focus:ring-2 focus:ring-teal-600"
                  />
                </div>

                {error && <p className="text-xs text-red-600 font-bold">{error}</p>}

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Total Fee</span>
                    <span className="text-xl font-black text-slate-900">₹{selectedDoctor.fee}</span>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-6 py-3 bg-teal-700 hover:bg-teal-800 text-white font-black rounded-xl text-xs sm:text-sm transition-all shadow-md cursor-pointer disabled:opacity-50"
                  >
                    {submitting ? 'Confirming...' : 'Confirm Appointment'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

