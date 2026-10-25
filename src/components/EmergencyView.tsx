import React, { useState } from 'react';
import {
  Sparkles,
  Crosshair,
  PhoneCall,
  Building2,
  Ambulance,
  HeartPulse,
  Clock,
  ShieldCheck,
  CheckCircle2,
  X,
  MapPin,
  AlertTriangle,
  Radio,
  Zap,
  Activity,
  Phone,
  ShieldAlert,
} from 'lucide-react';
import { api, EmergencyHospital } from '../services/api';
import { BookingRequest } from '../types/lab';

interface EmergencyViewProps {
  onOpenAI: () => void;
  onOpenLocation: () => void;
  selectedLocationName: string;
  onBookingSuccess: (booking: BookingRequest) => void;
}

export const EmergencyView: React.FC<EmergencyViewProps> = ({
  onOpenAI,
  onOpenLocation,
  selectedLocationName,
  onBookingSuccess,
}) => {
  const [activeTab, setActiveTab] = useState<'hospitals' | 'ambulances'>('hospitals');
  const [selectedHospital, setSelectedHospital] = useState<EmergencyHospital | null>(null);
  const [bedType, setBedType] = useState<'ICU' | 'Ventilator' | 'General' | 'NICU'>('ICU');
  const [dispatchAmbulance, setDispatchAmbulance] = useState(true);
  const [patientName, setPatientName] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [pickupAddress, setPickupAddress] = useState('');
  const [reservationConfirmed, setReservationConfirmed] = useState<any | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const hospitals: EmergencyHospital[] = [
    {
      id: 'hosp-1',
      name: 'AIIMS Patna',
      area: 'Phulwari Sharif, Patna',
      distanceKm: 4.2,
      beds: { general: 22, icu: 6, nicu: 3, ventilator: 4, total: 35 },
      phone: '+91 612 2451000',
      traumaLevel: 'Level 1 Apex Trauma Care',
    },
    {
      id: 'hosp-2',
      name: 'Paras HMRI Hospital',
      area: 'Bailey Road, Patna',
      distanceKm: 1.8,
      beds: { general: 18, icu: 5, nicu: 2, ventilator: 3, total: 28 },
      phone: '+91 612 7107777',
      traumaLevel: '24×7 Cardiac & Neuro Critical Care',
    },
    {
      id: 'hosp-3',
      name: 'Ruban Memorial Hospital',
      area: 'Patliputra Colony, Patna',
      distanceKm: 2.6,
      beds: { general: 15, icu: 3, nicu: 1, ventilator: 2, total: 21 },
      phone: '+91 612 2271000',
      traumaLevel: 'Multispecialty Critical Care Center',
    },
    {
      id: 'hosp-4',
      name: 'Big Apollo Spectra',
      area: 'Kankarbagh, Patna',
      distanceKm: 3.4,
      beds: { general: 20, icu: 5, nicu: 2, ventilator: 3, total: 30 },
      phone: '+91 612 3500100',
      traumaLevel: 'Surgical Emergency & Intensive Care',
    },
    {
      id: 'hosp-5',
      name: 'Medanta Superspeciality',
      area: 'Kankarbagh, Patna',
      distanceKm: 3.9,
      beds: { general: 22, icu: 6, nicu: 2, ventilator: 3, total: 33 },
      phone: '+91 612 3505000',
      traumaLevel: 'Comprehensive Heart & Stroke Emergency',
    },
  ];

  const ambulanceTiers = [
    {
      tier: 'Basic Life Support (BLS)',
      eta: '< 8 mins',
      features: 'Trained EMT Paramedic, Continuous Oxygen Cylinder, Spine Board Stretcher, First Aid & Vitals Diagnostic Kit',
      type: 'BLS',
      idealFor: 'Non-critical patient transfer, moderate trauma, stable respiratory support',
    },
    {
      tier: 'Advanced Life Support (ALS)',
      eta: '< 10 mins',
      features: 'Cardiac Defibrillator, Multi-para Telemetry Monitor, Transport Mechanical Ventilator, Emergency IV Drugs',
      type: 'ALS',
      idealFor: 'Severe cardiac arrest, acute chest pain, stroke, unconscious patients',
    },
    {
      tier: 'ICU on Wheels (Mobile Critical Care)',
      eta: '< 12 mins',
      features: 'On-Board Critical Care Physician, Arterial Blood Pressure Line, Dual Syringe Infusion Pumps, Advanced Resuscitation Suite',
      type: 'ICU',
      idealFor: 'Ventilator-dependent patients, poly-trauma, septic shock',
    },
    {
      tier: 'Neonatal ICU Ambulance (NICU)',
      eta: '< 14 mins',
      features: 'Temperature-Controlled Baby Transport Incubator, Neonatal Pulse Oximeter & Resuscitation Suite, Micro-infusion Pump',
      type: 'NICU',
      idealFor: 'Preterm newborns, respiratory distress in infants',
    },
  ];

  const handleReserveClick = (hosp: EmergencyHospital) => {
    setSelectedHospital(hosp);
    setReservationConfirmed(null);
    setError('');
  };

  const handleConfirmReservation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName.trim()) {
      setError('Please enter patient name');
      return;
    }
    if (patientPhone.replace(/\D/g, '').length !== 10) {
      setError('Please enter 10-digit emergency contact phone');
      return;
    }
    if (dispatchAmbulance && !pickupAddress.trim()) {
      setError('Please enter patient pickup address for ambulance dispatch');
      return;
    }

    setSubmitting(true);
    const newBooking: any = {
      id: `EMERG-${Math.floor(10000 + Math.random() * 90000)}`,
      type: 'emergency',
      labId: selectedHospital!.id,
      labName: selectedHospital!.name,
      labArea: selectedHospital!.area,
      labAddress: selectedHospital!.area,
      tests: [
        {
          testId: 'bed-res',
          name: `${bedType} Bed Hold + ${dispatchAmbulance ? 'Emergency Ambulance Dispatch' : 'Direct ER Arrival'}`,
          price: 0,
          category: 'Cardiology',
        },
      ],
      mode: dispatchAmbulance ? 'home' : 'centre',
      slotDate: 'Immediate',
      slotTime: '24×7 Priority Hold (30 mins reserve window)',
      patientName: patientName.trim(),
      patientPhone: patientPhone.trim(),
      patientAge: '45',
      patientGender: 'Male',
      address: dispatchAmbulance ? pickupAddress.trim() : selectedHospital!.area,
      subtotal: 0,
      collectionFee: 0,
      totalAmount: 0,
      status: 'Confirmed',
      createdAt: new Date().toISOString(),
    };

    await api.createBooking(newBooking);

    setTimeout(() => {
      setSubmitting(false);
      setReservationConfirmed(newBooking);
      onBookingSuccess(newBooking);
    }, 400);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
        <div>
          <span className="text-xs font-black tracking-widest uppercase text-red-600 bg-red-50 border border-red-200 px-2.5 py-1 rounded-md inline-block mb-2">
            CRITICAL CARE & EMERGENCY
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            Bed Reservation & Ambulance Dispatch
          </h1>
          <p className="text-sm sm:text-base text-slate-600 mt-2 font-medium max-w-2xl">
            Reserve verified ICU, Ventilator, or General beds in real time across Patna's top hospitals before the ambulance departs.
          </p>
        </div>

        {/* Big Call 108 Button */}
        <div className="flex items-center gap-3">
          <a
            href="tel:108"
            className="inline-flex items-center gap-2.5 px-6 py-3.5 bg-red-600 hover:bg-red-700 active:scale-95 text-white font-black text-base rounded-2xl shadow-xl shadow-red-600/30 pulse-glow-red transition-all cursor-pointer"
          >
            <PhoneCall className="w-5 h-5 fill-white animate-bounce" />
            <span>Call 108 Free SOS</span>
          </a>
        </div>
      </div>

      {/* Emergency Status Alert Ribbon */}
      <div className="mb-8 p-4 sm:p-5 rounded-3xl bg-red-950 text-white border border-red-800 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-red-600 text-white flex items-center justify-center shrink-0 shadow-lg shadow-red-600/40">
            <Radio className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <h4 className="text-sm sm:text-base font-black text-white">108 Emergency Network Active • Patna Hub</h4>
            </div>
            <p className="text-xs text-red-200 mt-0.5">
              147 Beds Online across 5 Super-Specialty Hospitals • Average Ambulance Dispatch Response: 8.4 Minutes.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenAI}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl border border-white/20 transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-teal-400" />
            <span>Symptom Triage</span>
          </button>

          <button
            onClick={onOpenLocation}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl border border-white/20 transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <Crosshair className="w-3.5 h-3.5 text-slate-300" />
            <span>{selectedLocationName}</span>
          </button>
        </div>
      </div>

      {/* Navigation Switcher: Hospitals & Beds vs Ambulance Fleet */}
      <div className="flex items-center gap-2 mb-8 p-1.5 bg-slate-200/80 rounded-2xl max-w-md">
        <button
          onClick={() => setActiveTab('hospitals')}
          className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer flex items-center justify-center gap-2 ${
            activeTab === 'hospitals'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Building2 className="w-4 h-4 text-red-600" />
          <span>Hospitals & Live Beds (5)</span>
        </button>
        <button
          onClick={() => setActiveTab('ambulances')}
          className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer flex items-center justify-center gap-2 ${
            activeTab === 'ambulances'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Ambulance className="w-4 h-4 text-red-600" />
          <span>Ambulance Tiers (4)</span>
        </button>
      </div>

      {/* Hospital Cards View */}
      {activeTab === 'hospitals' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hospitals.map((hosp) => (
            <div
              key={hosp.id}
              className="bg-white rounded-3xl border border-slate-200/90 p-6 flex flex-col justify-between hover:shadow-xl hover:border-red-200 transition-all duration-300 group"
            >
              <div>
                <div className="flex items-start gap-3.5 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center text-red-600 shrink-0 group-hover:scale-105 transition-transform shadow-xs">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-extrabold text-slate-900 truncate">{hosp.name}</h3>
                      <span className="text-[11px] font-bold text-slate-500">{hosp.distanceKm} km</span>
                    </div>
                    <p className="text-xs text-slate-500 truncate">{hosp.area}</p>
                    <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-red-50 text-red-700 border border-red-200 mt-1">
                      {hosp.traumaLevel}
                    </span>
                  </div>
                </div>

                {/* Bed numbers grid */}
                <div className="grid grid-cols-4 gap-2 text-center py-3.5 bg-slate-50 rounded-2xl border border-slate-100 my-4">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">General</span>
                    <span className="text-lg font-black text-slate-900">{hosp.beds.general}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-red-600 block">ICU</span>
                    <span className="text-lg font-black text-red-600">{hosp.beds.icu}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-600 block">NICU</span>
                    <span className="text-lg font-black text-slate-900">{hosp.beds.nicu}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-600 block">Vent</span>
                    <span className="text-lg font-black text-slate-900">{hosp.beds.ventilator}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-bold rounded-full">
                  {hosp.beds.total} total beds
                </span>
                <button
                  onClick={() => handleReserveClick(hosp)}
                  className="px-5 py-2.5 bg-red-600 hover:bg-red-700 active:scale-95 text-white font-black rounded-xl text-xs sm:text-sm transition-all shadow-md shadow-red-600/25 cursor-pointer"
                >
                  Reserve Bed
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Ambulance Dispatch View */}
      {activeTab === 'ambulances' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {ambulanceTiers.map((amb, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 flex flex-col justify-between shadow-xs hover:shadow-xl hover:border-red-300 transition-all duration-300 group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center shrink-0 border border-red-100 group-hover:scale-105 transition-transform">
                      <Ambulance className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-base font-extrabold text-slate-900">{amb.tier}</h4>
                      <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" /> Average Dispatch ETA: {amb.eta}
                      </span>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 bg-red-50 text-red-700 font-black text-xs rounded-full border border-red-200">
                    {amb.type}
                  </span>
                </div>

                <div className="space-y-2 text-xs text-slate-600 mb-6">
                  <p><strong>Equipment:</strong> {amb.features}</p>
                  <p className="text-slate-500"><strong>Best Suited For:</strong> {amb.idealFor}</p>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400">108 Fleet Priority Armed</span>
                <button
                  onClick={() => handleReserveClick(hospitals[0])}
                  className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs sm:text-sm font-black transition-all shadow-md shadow-red-600/25 cursor-pointer"
                >
                  Dispatch {amb.type}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Bed Reservation Modal */}
      {selectedHospital && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in duration-200"
          onClick={() => setSelectedHospital(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-red-100 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedHospital(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {reservationConfirmed ? (
              <div className="text-center py-4">
                <div className="w-16 h-16 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4 ring-8 ring-red-50">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-black text-slate-900">Emergency Bed Reserved!</h3>
                <p className="text-xs text-slate-500 mt-1 mb-4">
                  Pass ID: <strong className="font-mono text-red-600 font-bold">{reservationConfirmed.id}</strong>
                </p>
                <div className="bg-red-50/70 rounded-2xl p-4 text-left text-xs space-y-2 border border-red-200 mb-5">
                  <p><strong>Hospital:</strong> {selectedHospital.name} ({selectedHospital.area})</p>
                  <p><strong>Bed Reserved:</strong> {bedType} Bed (Priority 30-min window held)</p>
                  <p><strong>Ambulance:</strong> {dispatchAmbulance ? 'Live GPS Ambulance Dispatched' : 'Self ER Handover'}</p>
                  <p className="text-red-700 font-black">Present this Pass ID at the hospital Emergency entrance for immediate zero-wait triage admission.</p>
                </div>
                <button
                  onClick={() => setSelectedHospital(null)}
                  className="w-full py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-black text-sm shadow-lg shadow-red-600/30 cursor-pointer"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleConfirmReservation} className="space-y-4">
                <div className="flex items-center gap-3.5 pb-4 border-b border-slate-100">
                  <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center shrink-0 border border-red-200">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900">{selectedHospital.name}</h3>
                    <p className="text-xs text-slate-500">{selectedHospital.area} • {selectedHospital.traumaLevel}</p>
                  </div>
                </div>

                {/* Choose Bed Type */}
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">Select Bed Type</label>
                  <div className="grid grid-cols-4 gap-2">
                    {(['ICU', 'Ventilator', 'General', 'NICU'] as const).map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setBedType(t)}
                        className={`py-2.5 text-xs font-black rounded-xl border text-center transition-all cursor-pointer ${
                          bedType === t
                            ? 'bg-red-600 text-white border-red-600 shadow-md shadow-red-600/20'
                            : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Ambulance toggle */}
                <label className="flex items-center gap-3 p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs font-bold text-slate-800 cursor-pointer hover:bg-slate-100/70 transition-colors">
                  <input
                    type="checkbox"
                    checked={dispatchAmbulance}
                    onChange={(e) => setDispatchAmbulance(e.target.checked)}
                    className="w-4 h-4 text-red-600 rounded focus:ring-red-500 accent-red-600"
                  />
                  <span>Dispatch nearest 108 Emergency Ambulance to patient location</span>
                </label>

                {/* Patient details */}
                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Patient Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ramesh Kumar"
                      value={patientName}
                      onChange={(e) => setPatientName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium outline-none focus:ring-2 focus:ring-red-600"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">10-Digit Emergency Phone</label>
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      placeholder="9876543210"
                      value={patientPhone}
                      onChange={(e) => setPatientPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium outline-none focus:ring-2 focus:ring-red-600"
                    />
                  </div>
                </div>

                {dispatchAmbulance && (
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Patient Pickup Address</label>
                    <input
                      type="text"
                      required
                      placeholder="Exact address or landmark for GPS ambulance dispatch"
                      value={pickupAddress}
                      onChange={(e) => setPickupAddress(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium outline-none focus:ring-2 focus:ring-red-600"
                    />
                  </div>
                )}

                {error && <p className="text-xs text-red-600 font-bold">{error}</p>}

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3.5 bg-red-600 hover:bg-red-700 text-white font-black rounded-xl text-sm transition-all shadow-xl shadow-red-600/30 cursor-pointer disabled:opacity-50"
                  >
                    {submitting ? 'Reserving...' : 'Confirm 108 Emergency Bed Reservation'}
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

