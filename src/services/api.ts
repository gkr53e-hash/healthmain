import { BookingRequest, LabPartner, LabTest } from '../types/lab';

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  experience: string;
  location: string;
  fee: number;
  avatar: string;
  available: string;
}

export interface Pharmacy {
  id: string;
  name: string;
  area: string;
  deliveryTime: string;
  rating: number;
  topMedicines: string[];
}

export interface EmergencyHospital {
  id: string;
  name: string;
  area: string;
  distanceKm: number;
  beds: {
    general: number;
    icu: number;
    nicu: number;
    ventilator: number;
    total: number;
  };
  phone: string;
  traumaLevel: string;
}

export const api = {
  async getHealth() {
    try {
      const res = await fetch('/api/health');
      return await res.json();
    } catch (e) {
      console.warn('Backend offline, using local data', e);
      return { status: 'fallback' };
    }
  },

  async getLabs(params?: { search?: string; location?: string }) {
    try {
      const q = new URLSearchParams();
      if (params?.search) q.set('search', params.search);
      if (params?.location) q.set('location', params.location);
      const res = await fetch(`/api/labs?${q.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch labs');
      const data = await res.json();
      return data.labs as LabPartner[];
    } catch (e) {
      console.error(e);
      return null;
    }
  },

  async getDoctors(params?: { specialty?: string; search?: string }) {
    try {
      const q = new URLSearchParams();
      if (params?.specialty) q.set('specialty', params.specialty);
      if (params?.search) q.set('search', params.search);
      const res = await fetch(`/api/doctors?${q.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch doctors');
      const data = await res.json();
      return data.doctors as Doctor[];
    } catch (e) {
      console.error(e);
      return null;
    }
  },

  async getPharmacies() {
    try {
      const res = await fetch('/api/pharmacies');
      if (!res.ok) throw new Error('Failed to fetch pharmacies');
      const data = await res.json();
      return data.pharmacies as Pharmacy[];
    } catch (e) {
      console.error(e);
      return null;
    }
  },

  async getHospitals() {
    try {
      const res = await fetch('/api/hospitals');
      if (!res.ok) throw new Error('Failed to fetch hospitals');
      const data = await res.json();
      return data as { hospitals: EmergencyHospital[]; totalAvailableBeds: number };
    } catch (e) {
      console.error(e);
      return null;
    }
  },

  async getBookings() {
    try {
      const res = await fetch('/api/bookings');
      if (!res.ok) throw new Error('Failed to fetch bookings');
      const data = await res.json();
      return data.bookings as BookingRequest[];
    } catch (e) {
      console.error(e);
      return null;
    }
  },

  async createBooking(booking: Partial<BookingRequest> & { type?: string }) {
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(booking),
      });
      if (!res.ok) throw new Error('Failed to create booking');
      const data = await res.json();
      return data.booking as BookingRequest;
    } catch (e) {
      console.error(e);
      return null;
    }
  },

  async cancelBooking(id: string) {
    try {
      const res = await fetch(`/api/bookings/${id}`, {
        method: 'DELETE',
      });
      return res.ok;
    } catch (e) {
      console.error(e);
      return false;
    }
  },

  async aiTriage(symptoms: string) {
    try {
      const res = await fetch('/api/ai-triage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symptoms }),
      });
      if (!res.ok) throw new Error('Failed AI triage');
      return await res.json();
    } catch (e) {
      console.error(e);
      return null;
    }
  },
};
