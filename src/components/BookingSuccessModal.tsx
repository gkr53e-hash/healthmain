import React from 'react';
import {
  CheckCircle2,
  Calendar,
  Clock,
  MapPin,
  Download,
  Share2,
  ArrowRight,
  ShieldCheck,
  PhoneCall,
  QrCode,
  Sparkles,
  FileCheck2,
} from 'lucide-react';
import { BookingRequest } from '../types/lab';
import { formatCurrency } from '../utils/labBookingLogic';

interface BookingSuccessModalProps {
  booking: BookingRequest;
  onClose: () => void;
  onViewMyBookings: () => void;
}

export const BookingSuccessModal: React.FC<BookingSuccessModalProps> = ({
  booking,
  onClose,
  onViewMyBookings,
}) => {
  const downloadReceipt = () => {
    const reportText = `========================================================\nONECARE SPECIAL HEALTHCARE PLATFORM\nCertified Diagnostic Booking Confirmation & Receipt\n========================================================\nBooking ID: ${booking.id}\nPatient: ${booking.patientName}\nPhone: ${booking.patientPhone}\nLab: ${booking.labName}\nMode: ${booking.mode === 'home' ? 'Home Sample Collection' : 'Centre Visit'}\nSlot: ${booking.slotDate} (${booking.slotTime})\nAddress: ${booking.address}\n\nTESTS SCHEDULED:\n${booking.tests.map((t) => `• ${t.name} - ₹${t.price}`).join('\n')}\n\nTOTAL AMOUNT: ₹${booking.totalAmount}\nSTATUS: ${booking.status}\n\nAccreditation: NABL / CAP / ISO 15189 Certified\nSupport Helpline: 1800-208-1080 (Toll Free 24x7)\n========================================================`;
    const blob = new Blob([reportText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${booking.id}-OneCareSpecial-Pass.txt`;
    a.click();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 text-center relative max-h-[92vh] overflow-y-auto">
        {/* Animated Check */}
        <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-teal-700/20 ring-8 ring-emerald-50">
          <CheckCircle2 className="w-9 h-9 stroke-[2.5]" />
        </div>

        <div className="flex items-center justify-center gap-1.5 mb-1.5">
          <span className="px-3 py-1 bg-emerald-50 text-emerald-800 text-xs font-black uppercase tracking-wider rounded-full border border-emerald-200">
            Booking Confirmed & Telemetry Synced
          </span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1 mb-1">
          {booking.mode === 'home' ? 'Sample Collection Scheduled!' : 'Centre Visit Confirmed!'}
        </h2>
        <p className="text-xs text-slate-500 mb-6">
          OneCare Booking Pass ID: <strong className="text-slate-900 font-mono text-sm bg-slate-100 px-2 py-0.5 rounded">{booking.id}</strong>
        </p>

        {/* Appointment Card */}
        <div className="bg-slate-50/90 rounded-2xl p-4 sm:p-5 text-left border border-slate-200/80 space-y-3 mb-6 relative overflow-hidden">
          {/* Subtle accent border */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-500 to-emerald-500" />

          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Laboratory Partner
              </span>
              <p className="text-base font-black text-slate-900">{booking.labName}</p>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-teal-100 text-teal-800 border border-teal-200">
              {booking.mode === 'home' ? 'Home Collection' : 'Centre Visit'}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs pt-1">
            <div>
              <span className="text-slate-400 block font-medium">Scheduled Date</span>
              <span className="font-bold text-slate-900 flex items-center gap-1.5 mt-0.5">
                <Calendar className="w-3.5 h-3.5 text-teal-600" />
                {booking.slotDate}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Assigned Slot</span>
              <span className="font-bold text-slate-900 flex items-center gap-1.5 mt-0.5">
                <Clock className="w-3.5 h-3.5 text-teal-600" />
                {booking.slotTime}
              </span>
            </div>
          </div>

          <div className="text-xs pt-2.5 border-t border-slate-200/80">
            <span className="text-slate-400 block font-medium">Patient Details</span>
            <p className="font-bold text-slate-900 mt-0.5">
              {booking.patientName} ({booking.patientAge} yrs, {booking.patientGender}) • {booking.patientPhone}
            </p>
          </div>

          <div className="text-xs pt-1">
            <span className="text-slate-400 block font-medium">
              {booking.mode === 'home' ? 'Sample Collection Address' : 'Centre Visit Location'}
            </span>
            <p className="font-medium text-slate-700 flex items-start gap-1.5 mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-teal-600 shrink-0 mt-0.5" />
              <span>{booking.address}</span>
            </p>
          </div>

          <div className="pt-2.5 border-t border-slate-200/80 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-700 block">Total Payable</span>
              <span className="text-[10px] text-slate-400">Cash / UPI / Card post collection</span>
            </div>
            <span className="text-lg font-black text-teal-700">
              {formatCurrency(booking.totalAmount)}
            </span>
          </div>
        </div>

        {/* Preparation Guide Box */}
        <div className="bg-amber-50/80 rounded-2xl p-4 text-left border border-amber-200/80 mb-6 text-xs text-amber-900">
          <div className="flex items-center gap-1.5 font-bold mb-1 text-amber-900">
            <ShieldCheck className="w-4 h-4 text-amber-700" />
            <span>Phlebotomy Preparation & Fasting Guidelines</span>
          </div>
          <ul className="list-disc list-inside space-y-1 text-[11px] text-amber-800">
            <li>Keep 8-10 hours fasting if your tests include Blood Sugar (F) or Lipid profiles.</li>
            <li>Drink 1-2 glasses of plain water before collection to ensure smooth blood draw.</li>
            <li>Vaccinated phlebotomist will arrive with sterile single-use vacuum vacutainers.</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-2.5">
          <button
            onClick={onViewMyBookings}
            className="w-full sm:flex-1 py-3.5 px-4 bg-teal-700 hover:bg-teal-800 active:scale-98 text-white rounded-xl font-bold text-sm shadow-md shadow-teal-700/25 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>View in My Bookings</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={downloadReceipt}
            className="w-full sm:w-auto py-3.5 px-4 border border-slate-200 hover:bg-slate-50 text-slate-800 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            title="Download Booking Pass"
          >
            <Download className="w-4 h-4 text-slate-600" />
            <span>Download Pass</span>
          </button>

          <button
            onClick={onClose}
            className="w-full sm:w-auto py-3.5 px-4 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl font-semibold text-sm transition-all cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

