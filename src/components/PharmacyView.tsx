import React, { useState } from 'react';
import {
  Sparkles,
  Crosshair,
  Pill,
  Clock,
  MapPin,
  Check,
  Plus,
  ShoppingBag,
  X,
  CheckCircle2,
  Upload,
  Search,
  Star,
  ShieldCheck,
  Truck,
  FileCheck,
} from 'lucide-react';
import { api, Pharmacy } from '../services/api';
import { BookingRequest } from '../types/lab';
import { formatCurrency } from '../utils/labBookingLogic';

interface PharmacyViewProps {
  onOpenAI: () => void;
  onOpenLocation: () => void;
  selectedLocationName: string;
  onBookingSuccess: (booking: BookingRequest) => void;
}

export const PharmacyView: React.FC<PharmacyViewProps> = ({
  onOpenAI,
  onOpenLocation,
  selectedLocationName,
  onBookingSuccess,
}) => {
  const [selectedPharmacy, setSelectedPharmacy] = useState<Pharmacy | null>(null);
  const [medicineSearchQuery, setMedicineSearchQuery] = useState('');
  const [selectedMeds, setSelectedMeds] = useState<{ name: string; price: number }[]>([
    { name: 'Paracetamol 650mg (Strip of 15)', price: 45 },
  ]);
  const [patientName, setPatientName] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [prescriptionAttached, setPrescriptionAttached] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState<any | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const pharmacies: Pharmacy[] = [
    {
      id: 'ph-1',
      name: 'Apollo Pharmacy',
      area: 'Bailey Road, Patna',
      deliveryTime: '~45 min delivery',
      rating: 4.8,
      topMedicines: [
        'Paracetamol 650mg (Strip of 15) - ₹45',
        'Azithromycin 500mg (Strip of 5) - ₹120',
        'Cetirizine 10mg (Strip of 10) - ₹35',
        'Pantoprazole 40mg (Strip of 10) - ₹85',
        'Vitamin C + Zinc Tablets - ₹110',
      ],
    },
    {
      id: 'ph-2',
      name: 'MedPlus',
      area: 'Kankarbagh, Patna',
      deliveryTime: '~45 min delivery',
      rating: 4.7,
      topMedicines: [
        'Metformin 500mg SR (Strip of 10) - ₹60',
        'Telmisartan 40mg (Strip of 15) - ₹95',
        'Atorvastatin 10mg (Strip of 10) - ₹80',
        'Amoxicillin Clavulanate 625mg - ₹185',
        'Multivitamin Gold Capsules - ₹220',
      ],
    },
    {
      id: 'ph-3',
      name: '1mg Store',
      area: 'Patliputra Colony, Patna',
      deliveryTime: '~40 min delivery',
      rating: 4.9,
      topMedicines: [
        'Dolo 650 Tablets (Strip of 15) - ₹40',
        'Digestive Enzyme Syrup 200ml - ₹145',
        'Calcium + D3 Tablets (Strip of 15) - ₹160',
        'ORS Hydration Sachet (Pack of 5) - ₹50',
        'Antiseptic Solution 250ml - ₹90',
      ],
    },
    {
      id: 'ph-4',
      name: 'Netmeds Local',
      area: 'Rajendra Nagar, Patna',
      deliveryTime: '~50 min delivery',
      rating: 4.6,
      topMedicines: [
        'Thyronorm 50mcg (Bottle of 120) - ₹190',
        'Pain Relief Gel 30g - ₹75',
        'Steam Inhaler Vaporizer - ₹240',
        'Digital BP Monitor - ₹1250',
        'Pulse Oximeter Fingertip - ₹650',
      ],
    },
  ];

  const handleOrderClick = (ph: Pharmacy) => {
    setSelectedPharmacy(ph);
    setOrderConfirmed(null);
    setError('');
  };

  const handleConfirmOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName.trim()) {
      setError('Please enter recipient name');
      return;
    }
    if (patientPhone.replace(/\D/g, '').length !== 10) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }
    if (!deliveryAddress.trim()) {
      setError('Please enter delivery address');
      return;
    }

    setSubmitting(true);
    const subtotal = selectedMeds.reduce((sum, m) => sum + m.price, 0);
    const deliveryFee = 25;
    const totalAmount = subtotal + deliveryFee;

    const newBooking: any = {
      id: `PHARM-${Math.floor(10000 + Math.random() * 90000)}`,
      type: 'pharmacy',
      labId: selectedPharmacy!.id,
      labName: selectedPharmacy!.name,
      labArea: selectedPharmacy!.area,
      labAddress: selectedPharmacy!.area,
      tests: selectedMeds.map((m, i) => ({
        testId: `med-${i}`,
        name: m.name,
        price: m.price,
        category: 'Pathology',
      })),
      mode: 'home',
      slotDate: 'Today',
      slotTime: selectedPharmacy!.deliveryTime,
      patientName: patientName.trim(),
      patientPhone: patientPhone.trim(),
      patientAge: '30',
      patientGender: 'Male',
      address: deliveryAddress.trim(),
      subtotal,
      collectionFee: deliveryFee,
      totalAmount,
      status: 'Confirmed',
      createdAt: new Date().toISOString(),
    };

    await api.createBooking(newBooking);

    setTimeout(() => {
      setSubmitting(false);
      setOrderConfirmed(newBooking);
      onBookingSuccess(newBooking);
    }, 400);
  };

  const filteredPharmacies = pharmacies.filter((ph) => {
    if (!medicineSearchQuery) return true;
    const q = medicineSearchQuery.toLowerCase();
    return (
      ph.name.toLowerCase().includes(q) ||
      ph.area.toLowerCase().includes(q) ||
      ph.topMedicines.some((m) => m.toLowerCase().includes(q))
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
        <div>
          <span className="text-xs font-black tracking-widest uppercase text-amber-700 bg-amber-50 border border-amber-200/80 px-2.5 py-1 rounded-md inline-block mb-2">
            DOORSTEP PHARMACY
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            Order Medicines Home Delivered
          </h1>
          <p className="text-sm sm:text-base text-slate-600 mt-2 font-medium max-w-2xl">
            Choose from licensed pharmacy partners across Patna. Genuine medicines with verified expiration dates delivered within 45 minutes.
          </p>
        </div>

        {/* Action Buttons top right */}
        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={onOpenAI}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 hover:border-amber-500 hover:bg-amber-50/50 rounded-2xl text-xs sm:text-sm font-bold text-slate-800 transition-all shadow-xs cursor-pointer group"
          >
            <Sparkles className="w-4 h-4 text-amber-600 group-hover:rotate-12 transition-transform" />
            <span>Scan Medicine / Prescription</span>
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

      {/* Express Delivery Assurance Strip */}
      <div className="mb-8 p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-amber-600/30">
            <Truck className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-black text-slate-900">45-Minute Superfast Delivery in Patna</h4>
            <p className="text-xs text-slate-600 mt-0.5">
              100% genuine medicines dispensed by registered pharmacists with tamper-proof packaging.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold text-amber-900 bg-white/80 px-3.5 py-1.5 rounded-full border border-amber-200 shrink-0">
          <ShieldCheck className="w-4 h-4 text-amber-600" />
          <span>CDSCO & ABDM Compliant</span>
        </div>
      </div>

      {/* Search Input for Medicines */}
      <div className="mb-8 bg-white rounded-3xl border border-slate-200 p-4 sm:p-5 shadow-xs">
        <div className="relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={medicineSearchQuery}
            onChange={(e) => setMedicineSearchQuery(e.target.value)}
            placeholder="Search medicine by name (e.g. Paracetamol, Pantoprazole, Dolo 650, Multivitamins)..."
            className="w-full pl-12 pr-4 py-3 rounded-2xl border border-slate-200 bg-slate-50/50 text-sm font-medium outline-none focus:bg-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
          />
          {medicineSearchQuery && (
            <button
              onClick={() => setMedicineSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-600"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Pharmacy Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredPharmacies.map((ph) => (
          <div
            key={ph.id}
            className="bg-white rounded-3xl border border-slate-200/90 p-6 flex flex-col justify-between hover:shadow-xl hover:border-amber-300 transition-all duration-300 group"
          >
            <div>
              {/* Header Box */}
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 shadow-xs group-hover:scale-105 transition-transform">
                  <Pill className="w-6 h-6 rotate-45" />
                </div>
                <div className="flex items-center gap-1 text-xs font-bold text-slate-800 bg-amber-50/80 px-2 py-0.5 rounded-md border border-amber-200">
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  <span>{ph.rating}</span>
                </div>
              </div>

              <h3 className="text-base font-extrabold text-slate-900 group-hover:text-amber-700 transition-colors">
                {ph.name}
              </h3>
              <div className="flex items-center gap-1 text-xs text-slate-500 mt-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="truncate">{ph.area}</span>
              </div>

              {/* Delivery ETA Pill */}
              <div className="mt-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-800 border border-amber-200/80 rounded-full text-[11px] font-bold">
                  <Clock className="w-3 h-3 text-amber-600" />
                  <span>{ph.deliveryTime}</span>
                </span>
              </div>

              {/* Top Medicines list */}
              <div className="mt-4 pt-3 border-t border-slate-100">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-2">
                  Top Stocked Medicines
                </span>
                <div className="space-y-1.5">
                  {ph.topMedicines.slice(0, 3).map((item, idx) => (
                    <div
                      key={idx}
                      className="text-xs text-slate-700 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-100 truncate"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-6">
              <button
                onClick={() => handleOrderClick(ph)}
                className="w-full py-3 bg-amber-600 hover:bg-amber-700 active:scale-95 text-white font-black rounded-xl text-xs sm:text-sm transition-all shadow-md shadow-amber-600/25 cursor-pointer flex items-center justify-center gap-1.5"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Order from {ph.name.split(' ')[0]}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pharmacy Order Modal */}
      {selectedPharmacy && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in duration-200"
          onClick={() => setSelectedPharmacy(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-100 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedPharmacy(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {orderConfirmed ? (
              <div className="text-center py-4">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-black text-slate-900">Medicine Order Dispatched!</h3>
                <p className="text-xs text-slate-500 mt-1 mb-4">
                  Order ID: <strong className="font-mono text-slate-800">{orderConfirmed.id}</strong>
                </p>
                <div className="bg-slate-50 rounded-2xl p-4 text-left text-xs space-y-2 mb-5 border border-slate-200">
                  <p><strong>Pharmacy:</strong> {selectedPharmacy.name} ({selectedPharmacy.area})</p>
                  <p><strong>Estimated Arrival:</strong> {selectedPharmacy.deliveryTime}</p>
                  <p><strong>Delivery Address:</strong> {orderConfirmed.address}</p>
                  <p><strong>Payment:</strong> Cash / UPI on Delivery</p>
                  <p><strong>Total Amount:</strong> {formatCurrency(orderConfirmed.totalAmount)}</p>
                </div>
                <button
                  onClick={() => setSelectedPharmacy(null)}
                  className="w-full py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-black text-sm cursor-pointer shadow-md"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleConfirmOrder} className="space-y-4">
                <div className="flex items-center gap-3.5 pb-4 border-b border-slate-100">
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-200">
                    <Pill className="w-6 h-6 rotate-45" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900">{selectedPharmacy.name}</h3>
                    <p className="text-xs text-slate-500">{selectedPharmacy.area} • {selectedPharmacy.deliveryTime}</p>
                  </div>
                </div>

                {/* Prescription upload */}
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-dashed border-slate-300 text-center">
                  <Upload className="w-5 h-5 text-slate-400 mx-auto mb-1" />
                  <p className="text-xs font-bold text-slate-700">
                    {prescriptionAttached ? '✓ Prescription Attached (digital_rx.jpg)' : 'Upload Doctor Prescription (Optional)'}
                  </p>
                  <button
                    type="button"
                    onClick={() => setPrescriptionAttached(!prescriptionAttached)}
                    className="mt-1 text-xs font-bold text-teal-700 hover:underline cursor-pointer"
                  >
                    {prescriptionAttached ? 'Remove file' : '+ Attach photo or prescription PDF'}
                  </button>
                </div>

                {/* Selected medicines */}
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">
                    Select Medicines & Essentials (Tap to Add/Remove)
                  </label>
                  <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                    {selectedPharmacy.topMedicines.map((item, idx) => {
                      const [name, priceStr] = item.split(' - ₹');
                      const price = parseInt(priceStr, 10) || 50;
                      const isAdded = selectedMeds.some((m) => m.name === name);
                      return (
                        <div
                          key={idx}
                          onClick={() => {
                            if (isAdded) {
                              setSelectedMeds((prev) => prev.filter((m) => m.name !== name));
                            } else {
                              setSelectedMeds((prev) => [...prev, { name, price }]);
                            }
                          }}
                          className={`p-3 rounded-xl border flex items-center justify-between text-xs cursor-pointer transition-all ${
                            isAdded
                              ? 'border-amber-500 bg-amber-50 font-black text-amber-950 shadow-2xs'
                              : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className={`w-4 h-4 rounded flex items-center justify-center text-[10px] ${isAdded ? 'bg-amber-600 text-white' : 'border border-slate-300'}`}>
                              {isAdded && '✓'}
                            </span>
                            <span>{name}</span>
                          </div>
                          <span className="font-mono font-bold text-slate-900">₹{price}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Patient / Recipient Details */}
                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Recipient Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rahul Sharma"
                      value={patientName}
                      onChange={(e) => setPatientName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">10-Digit Mobile</label>
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      placeholder="9876543210"
                      value={patientPhone}
                      onChange={(e) => setPatientPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Delivery Address</label>
                  <input
                    type="text"
                    required
                    placeholder="House/Flat No., Landmark, Colony, Patna"
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                {error && <p className="text-xs text-red-600 font-bold">{error}</p>}

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">
                      Total (incl. ₹25 express fee)
                    </span>
                    <span className="text-xl font-black text-slate-900">
                      ₹{selectedMeds.reduce((s, m) => s + m.price, 0) + 25}
                    </span>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting || selectedMeds.length === 0}
                    className="px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white font-black rounded-xl text-xs sm:text-sm transition-all shadow-md cursor-pointer disabled:opacity-50"
                  >
                    {submitting ? 'Placing Order...' : 'Confirm Delivery'}
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

