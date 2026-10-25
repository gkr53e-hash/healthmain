import React from 'react';
import {
  X,
  Calendar,
  Clock,
  MapPin,
  CheckCircle,
  FileText,
  Download,
  AlertTriangle,
  ArrowRight,
  Home,
  ShieldCheck,
  Building2,
  Sparkles,
} from 'lucide-react';
import { BookingRequest } from '../types/lab';
import { formatCurrency } from '../utils/labBookingLogic';

interface MyBookingsDrawerProps {
  bookings: BookingRequest[];
  isOpen: boolean;
  onClose: () => void;
  onCancelBooking: (id: string) => void;
}

export const MyBookingsDrawer: React.FC<MyBookingsDrawerProps> = ({
  bookings,
  isOpen,
  onClose,
  onCancelBooking,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden bg-slate-950/60 backdrop-blur-sm flex justify-end animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300 border-l border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-gradient-to-r from-teal-50/60 via-slate-50 to-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-700 text-white flex items-center justify-center font-black shadow-xs">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-slate-900">My Lab Bookings</h2>
                <span className="px-2 py-0.5 text-[10px] font-extrabold bg-teal-100 text-teal-800 rounded-full">
                  {bookings.filter((b) => b.status !== 'Cancelled').length} Active
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">Track sample collection & digital reports</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Close drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {bookings.length === 0 ? (
            <div className="text-center py-16 px-4">
              <div className="w-16 h-16 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center mx-auto mb-4 border border-teal-100">
                <Calendar className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-slate-900">No bookings yet</h3>
              <p className="text-xs text-slate-500 max-w-xs mx-auto mt-1 mb-6">
                You haven't scheduled any lab tests yet. Choose from certified partner labs to book a home sample collection or centre visit.
              </p>
              <button
                onClick={onClose}
                className="px-5 py-2.5 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white font-bold rounded-xl text-xs transition-all cursor-pointer shadow-sm"
              >
                Explore Lab Tests
              </button>
            </div>
          ) : (
            bookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-sm hover:shadow-md transition-all space-y-3 relative overflow-hidden group"
              >
                {/* Accent top stripe */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-500 to-cyan-500" />

                {/* Status bar */}
                <div className="flex items-center justify-between pt-1">
                  <span className="font-mono text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                    {booking.id}
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[11px] font-extrabold ${
                      booking.status === 'Cancelled'
                        ? 'bg-rose-50 text-rose-700 border border-rose-200'
                        : booking.status === 'Completed'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-teal-50 text-teal-800 border border-teal-200'
                    }`}
                  >
                    {booking.status}
                  </span>
                </div>

                <div>
                  <h4 className="font-bold text-slate-900 text-sm group-hover:text-teal-700 transition-colors">
                    {booking.labName}
                  </h4>
                  <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                    <span className="flex items-center gap-1 font-medium">
                      <Calendar className="w-3.5 h-3.5 text-teal-600" />
                      {booking.slotDate}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1 font-medium">
                      <Clock className="w-3.5 h-3.5 text-teal-600" />
                      {booking.slotTime}
                    </span>
                  </div>
                </div>

                {/* Mode & Patient */}
                <div className="p-3 bg-slate-50 rounded-xl text-xs space-y-1.5 border border-slate-100">
                  <div className="flex items-center justify-between text-slate-600 font-medium">
                    <span className="flex items-center gap-1.5 font-bold text-slate-800">
                      <Home className="w-3.5 h-3.5 text-teal-600" />
                      {booking.mode === 'home' ? 'Home Sample Collection' : 'Centre Visit'}
                    </span>
                    <span className="font-black text-slate-900 text-sm">
                      {formatCurrency(booking.totalAmount)}
                    </span>
                  </div>
                  <p className="text-slate-600 text-[11px] truncate">
                    Patient: <strong className="text-slate-800">{booking.patientName}</strong> ({booking.patientPhone})
                  </p>
                  <p className="text-slate-500 text-[11px] truncate">
                    Address: {booking.address}
                  </p>
                </div>

                {/* Tests List */}
                <div className="space-y-1.5">
                  <span className="text-[10px] uppercase font-extrabold tracking-wider text-slate-400">
                    Booked Tests ({booking.tests.length})
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {booking.tests.map((t, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 bg-slate-100 text-slate-700 text-[11px] rounded-md font-medium border border-slate-200/60"
                      >
                        {t.name}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                {booking.status !== 'Cancelled' && (
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <button
                      onClick={() => {
                        const sampleReport = `========================================================\nONECARE SPECIAL HEALTHCARE PLATFORM\nCertified Diagnostic Booking Confirmation & Receipt\n========================================================\nBooking ID: ${booking.id}\nPatient: ${booking.patientName}\nPhone: ${booking.patientPhone}\nLab: ${booking.labName}\nMode: ${booking.mode === 'home' ? 'Home Sample Collection' : 'Centre Visit'}\nSlot: ${booking.slotDate} (${booking.slotTime})\nAddress: ${booking.address}\n\nTESTS SCHEDULED:\n${booking.tests.map((t) => `• ${t.name} - ₹${t.price}`).join('\n')}\n\nTOTAL AMOUNT: ₹${booking.totalAmount}\nSTATUS: ${booking.status}\n\nAccreditation: NABL / CAP / ISO 15189 Certified\nSupport Helpline: 1800-208-1080 (Toll Free 24x7)\n========================================================`;
                        const blob = new Blob([sampleReport], { type: 'text/plain' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `${booking.id}-OneCareSpecial-Receipt.txt`;
                        a.click();
                      }}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-700 hover:text-teal-900 px-2.5 py-1.5 rounded-lg hover:bg-teal-50 transition-colors cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download Receipt</span>
                    </button>

                    <button
                      onClick={() => onCancelBooking(booking.id)}
                      className="text-xs font-semibold text-rose-600 hover:text-rose-800 px-2 py-1 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

