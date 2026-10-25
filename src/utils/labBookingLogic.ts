import { BookingFormErrors, BookingItem, BookingMode, LabPartner, LabTest } from '../types/lab';

export interface BookingTotals {
  subtotal: number;
  collectionFee: number;
  totalAmount: number;
  freeCollectionQualified: boolean;
  freeThreshold: number;
}

export const FREE_HOME_COLLECTION_THRESHOLD = 500;
export const STANDARD_HOME_COLLECTION_FEE = 100;

export function calculateBookingTotal(
  tests: { price: number }[],
  mode: BookingMode
): BookingTotals {
  const subtotal = tests.reduce((acc, t) => acc + (t.price || 0), 0);
  const freeThreshold = FREE_HOME_COLLECTION_THRESHOLD;

  if (tests.length === 0) {
    return {
      subtotal: 0,
      collectionFee: 0,
      totalAmount: 0,
      freeCollectionQualified: false,
      freeThreshold,
    };
  }

  let collectionFee = 0;
  let freeCollectionQualified = false;

  if (mode === 'home') {
    if (subtotal >= freeThreshold) {
      collectionFee = 0;
      freeCollectionQualified = true;
    } else {
      collectionFee = STANDARD_HOME_COLLECTION_FEE;
      freeCollectionQualified = false;
    }
  } else {
    // Centre visit
    collectionFee = 0;
    freeCollectionQualified = true;
  }

  return {
    subtotal,
    collectionFee,
    totalAmount: subtotal + collectionFee,
    freeCollectionQualified,
    freeThreshold,
  };
}

export function validateBookingForm(form: {
  patientName: string;
  patientPhone: string;
  patientAge: string;
  slotDate: string;
  slotTime: string;
  address?: string;
  mode: BookingMode;
  selectedTestIds: string[];
}): { isValid: boolean; errors: BookingFormErrors } {
  const errors: BookingFormErrors = {};

  if (!form.patientName || form.patientName.trim().length < 2) {
    errors.patientName = 'Please enter patient full name (at least 2 characters)';
  }

  const cleanPhone = (form.patientPhone || '').replace(/\D/g, '');
  if (cleanPhone.length !== 10) {
    errors.patientPhone = 'Please enter a valid 10-digit mobile number';
  }

  const ageNum = parseInt(form.patientAge, 10);
  if (isNaN(ageNum) || ageNum < 1 || ageNum > 120) {
    errors.patientAge = 'Please enter a valid age between 1 and 120';
  }

  if (!form.slotDate) {
    errors.slotDate = 'Please select an appointment date';
  }

  if (!form.slotTime) {
    errors.slotTime = 'Please select a preferred time slot';
  }

  if (form.mode === 'home' && (!form.address || form.address.trim().length < 6)) {
    errors.address = 'Please enter complete home address for sample collection';
  }

  if (!form.selectedTestIds || form.selectedTestIds.length === 0) {
    errors.tests = 'Please select at least one test to book';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export function filterLabs(
  labs: LabPartner[],
  tests: LabTest[],
  options: {
    searchQuery: string;
    category?: string;
    locationFilter?: string;
    homeCollectionOnly?: boolean;
  }
): LabPartner[] {
  const query = options.searchQuery.trim().toLowerCase();
  const testMap = new Map(tests.map((t) => [t.id, t]));

  return labs.filter((lab) => {
    // Home collection filter
    if (options.homeCollectionOnly && !lab.hasHomeCollection) {
      return false;
    }

    // Location filter
    if (
      options.locationFilter &&
      options.locationFilter !== 'all' &&
      !lab.area.toLowerCase().includes(options.locationFilter.toLowerCase())
    ) {
      return false;
    }

    // Category filter: does this lab have any tests in this category?
    if (options.category && options.category !== 'all') {
      const labTests = lab.allTestIds.map((id) => testMap.get(id)).filter(Boolean) as LabTest[];
      const hasCategory = labTests.some(
        (t) => t.category.toLowerCase() === options.category?.toLowerCase()
      );
      if (!hasCategory) return false;
    }

    // Search query: match lab name, area, or any test name
    if (query) {
      const nameMatch = lab.name.toLowerCase().includes(query);
      const areaMatch = lab.area.toLowerCase().includes(query);
      const testMatch = lab.allTestIds.some((id) => {
        const t = testMap.get(id);
        return (
          t &&
          (t.name.toLowerCase().includes(query) ||
            t.category.toLowerCase().includes(query) ||
            t.description.toLowerCase().includes(query))
        );
      });

      if (!nameMatch && !areaMatch && !testMatch) {
        return false;
      }
    }

    return true;
  });
}

export function generateBookingId(): string {
  const random = Math.floor(10000 + Math.random() * 90000);
  return `MED-LAB-${random}`;
}

export function formatCurrency(amount: number): string {
  return `₹${amount.toLocaleString('en-IN')}`;
}
