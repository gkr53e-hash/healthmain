import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateBookingTotal,
  validateBookingForm,
  filterLabs,
  formatCurrency,
  FREE_HOME_COLLECTION_THRESHOLD,
  STANDARD_HOME_COLLECTION_FEE,
} from './labBookingLogic';
import { ALL_TESTS, CERTIFIED_LABS } from '../data/labData';

test('calculateBookingTotal correctly charges zero collection fee for centre visit', () => {
  const result = calculateBookingTotal([{ price: 350 }], 'centre');
  assert.equal(result.subtotal, 350);
  assert.equal(result.collectionFee, 0);
  assert.equal(result.totalAmount, 350);
  assert.equal(result.freeCollectionQualified, true);
});

test('calculateBookingTotal applies standard home collection fee if under threshold', () => {
  const result = calculateBookingTotal([{ price: 350 }], 'home');
  assert.equal(result.subtotal, 350);
  assert.equal(result.collectionFee, STANDARD_HOME_COLLECTION_FEE);
  assert.equal(result.totalAmount, 350 + STANDARD_HOME_COLLECTION_FEE);
  assert.equal(result.freeCollectionQualified, false);
});

test('calculateBookingTotal waives collection fee for home visits exceeding threshold', () => {
  const result = calculateBookingTotal([{ price: 350 }, { price: 700 }], 'home');
  assert.equal(result.subtotal, 1050);
  assert.equal(result.collectionFee, 0);
  assert.equal(result.totalAmount, 1050);
  assert.equal(result.freeCollectionQualified, true);
});

test('validateBookingForm rejects invalid phone numbers and missing addresses for home visits', () => {
  const invalid = validateBookingForm({
    patientName: 'A',
    patientPhone: '1234',
    patientAge: '200',
    slotDate: '',
    slotTime: '',
    mode: 'home',
    address: 'Short',
    selectedTestIds: [],
  });
  assert.equal(invalid.isValid, false);
  assert.ok(invalid.errors.patientName);
  assert.ok(invalid.errors.patientPhone);
  assert.ok(invalid.errors.patientAge);
  assert.ok(invalid.errors.slotDate);
  assert.ok(invalid.errors.slotTime);
  assert.ok(invalid.errors.address);
  assert.ok(invalid.errors.tests);
});

test('validateBookingForm accepts valid submissions and permits empty address for centre visit', () => {
  const valid = validateBookingForm({
    patientName: 'Rahul Sharma',
    patientPhone: '9876543210',
    patientAge: '32',
    slotDate: '2026-10-25',
    slotTime: '08:30 AM - 09:30 AM',
    mode: 'centre',
    address: '',
    selectedTestIds: ['t-cbc'],
  });
  assert.equal(valid.isValid, true);
  assert.equal(Object.keys(valid.errors).length, 0);
});

test('filterLabs correctly filters by search query and location', () => {
  const lalResults = filterLabs(CERTIFIED_LABS, ALL_TESTS, {
    searchQuery: 'Lal',
  });
  assert.equal(lalResults.length, 1);
  assert.equal(lalResults[0].name, 'Dr. Lal PathLabs');

  const thyroidResults = filterLabs(CERTIFIED_LABS, ALL_TESTS, {
    searchQuery: 'Thyroid',
  });
  assert.ok(thyroidResults.length >= 2);

  const kankarbaghLabs = filterLabs(CERTIFIED_LABS, ALL_TESTS, {
    searchQuery: '',
    locationFilter: 'kankarbagh',
  });
  assert.ok(kankarbaghLabs.length >= 2);
});

test('formatCurrency outputs rupee symbol and formatting', () => {
  assert.equal(formatCurrency(1999), '₹1,999');
  assert.equal(formatCurrency(350), '₹350');
});
