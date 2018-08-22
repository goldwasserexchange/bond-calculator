import test from 'ava';

import {
  countDays30360,
  startOfEndOfMonth,
  isEndOfMonth,
  isFebruary,
  isEndOfFebruary,
  endOfFebruary,
  addPeriods,
  changeYear,
} from '../src/utils';

test('countDays30360', (t) => {
  const d1 = 31;
  const m1 = 1;
  const y1 = 2000;
  const d2 = 28;
  const m2 = 3;
  const y2 = 2001;
  t.is(countDays30360(d1, m1, y1, d2, m2, y2), 418);
});

test('startOfEndOfMonth', (t) => {
  const date = new Date(2000, 1, 15);
  t.deepEqual(startOfEndOfMonth(date), new Date(2000, 1, 29));
});

test('isEndOfMonth', (t) => {
  t.true(isEndOfMonth(new Date(2000, 0, 31)));
  t.false(isEndOfMonth(new Date(2000, 0, 30)));
});

test('isFebruary', (t) => {
  t.true(isFebruary(new Date(2000, 1, 29)));
  t.false(isFebruary(new Date(2001, 1, 29)));
});

test('isEndOfFebruary', (t) => {
  t.true(isEndOfFebruary(new Date(2000, 1, 29)));
  t.false(isEndOfFebruary(new Date(2000, 1, 28)));
});

test('endOfFebruary', (t) => {
  t.deepEqual(endOfFebruary(2000), new Date(2000, 1, 29));
});

test('addPeriods', (t) => {
  const date = new Date(1999, 7, 31);
  const frequency = 2;
  const n = 1;
  const fn = addPeriods(date, frequency);
  t.is(typeof fn, 'function');
  t.deepEqual(fn(n), new Date(2000, 1, 29));
});

test('changeYear not end of february', (t) => {
  const date1 = new Date(2000, 2, 20);
  const date2 = new Date(2012, 4, 18);
  t.deepEqual(changeYear(date1, date2), new Date(2012, 2, 20));
});

test('changeYear end of february', (t) => {
  const date1 = new Date(2000, 1, 29);
  const date2 = new Date(2011, 4, 18);
  t.deepEqual(changeYear(date1, date2), new Date(2011, 1, 28));
});
