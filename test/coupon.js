import test from 'ava';

import { days, accrued, dates, previous, next, num } from '../src/coupon';

test('days ACTUAL/365', (t) => {
  t.is(days(new Date(2000, 0, 15), new Date(2000, 3, 15), 4, 'ACTUAL/365'), 365 / 4);
});

test('days ACTUAL/ACTUAL', (t) => {
  t.is(days(new Date(2000, 0, 15), new Date(2000, 3, 15), 4, 'ACTUAL/ACTUAL'), 16 + 29 + 31 + 15);
});

test('days 30U/360', (t) => {
  t.is(days(new Date(2000, 0, 15), new Date(2000, 3, 15), 4, '30U/360'), 360 / 4);
});

test('days 30E/360', (t) => {
  t.is(days(new Date(2000, 0, 15), new Date(2000, 3, 15), 4, '30E/360'), 360 / 4);
});

test('days ACTUAL/360', (t) => {
  t.is(days(new Date(2000, 0, 15), new Date(2000, 3, 15), 4, 'ACTUAL/360'), 360 / 4);
});

test('days UNKNOWN convention', (t) => {
  t.is(days(new Date(2000, 0, 15), new Date(2000, 3, 15), 4, 'UNKNOWN'), 360 / 4);
});

test('accrued 30E/360', (t) => {
  t.is(accrued(new Date(2000, 0, 20), new Date(2000, 3, 15), '30E/360'), 10 + 30 + 30 + 15);
});

test('accrued ACTUAL/360', (t) => {
  t.is(accrued(new Date(2000, 0, 20), new Date(2000, 3, 15), 'ACTUAL/360'), 11 + 29 + 31 + 15);
});

test('accrued ACTUAL/365', (t) => {
  t.is(accrued(new Date(2000, 0, 20), new Date(2000, 3, 15), 'ACTUAL/365'), 11 + 29 + 31 + 15);
});

test('accrued ACTUAL/ACTUAL', (t) => {
  t.is(accrued(new Date(2000, 0, 20), new Date(2000, 3, 15), 'ACTUAL/ACTUAL'), 11 + 29 + 31 + 15);
});

test('accrued 30U/360 not end of february', (t) => {
  t.is(accrued(new Date(2000, 0, 20), new Date(2000, 3, 15), '30U/360'), 10 + 30 + 30 + 15);
});

test('accrued 30U/360 date1 end of february', (t) => {
  t.is(accrued(new Date(2000, 1, 29), new Date(2000, 3, 15), '30U/360'), 30 + 15);
});

test('accrued 30U/360 date1 and date2 end of february', (t) => {
  t.is(accrued(new Date(2000, 1, 29), new Date(2001, 1, 28), '30U/360'), 360);
});

test('accrued UNKNOWN not end of february', (t) => {
  t.is(accrued(new Date(2000, 0, 20), new Date(2000, 3, 15), 'UNKNOWN'), 10 + 30 + 30 + 15);
});

test('accrued UNKNOWN date1 end of february', (t) => {
  t.is(accrued(new Date(2000, 1, 29), new Date(2000, 3, 15), 'UNKNOWN'), 30 + 15);
});

test('accrued UNKNOWN date1 and date2 end of february', (t) => {
  t.is(accrued(new Date(2000, 1, 29), new Date(2001, 1, 28), 'UNKNOWN'), 360);
});

test('dates maturity not end of month', (t) => {
  t.deepEqual(dates(new Date(2000, 2, 10), new Date(2020, 4, 20), 1), [
    new Date(1997, 4, 20),
    new Date(1998, 4, 20),
    new Date(1999, 4, 20),
    new Date(2000, 4, 20),
    new Date(2001, 4, 20),
    new Date(2002, 4, 20),
    new Date(2003, 4, 20),
  ]);
});

test('dates maturity end of month', (t) => {
  t.deepEqual(dates(new Date(2000, 2, 10), new Date(2020, 4, 31), 4), [
    new Date(1999, 7, 31),
    new Date(1999, 10, 30),
    new Date(2000, 1, 29),
    new Date(2000, 4, 31),
    new Date(2000, 7, 31),
    new Date(2000, 10, 30),
    new Date(2001, 1, 28),
  ]);
});

test('previous not on a coupon date', (t) => {
  t.deepEqual(previous(new Date(2000, 2, 10), new Date(2020, 4, 31), 4), new Date(2000, 1, 29));
});

test('previous on a coupon date', (t) => {
  t.deepEqual(previous(new Date(2000, 4, 31), new Date(2020, 4, 31), 4), new Date(2000, 4, 31));
});

test('next not on a coupon date', (t) => {
  t.deepEqual(next(new Date(2000, 2, 10), new Date(2020, 4, 31), 4), new Date(2000, 4, 31));
});

test('next on a coupon date', (t) => {
  t.deepEqual(next(new Date(2000, 4, 31), new Date(2020, 4, 31), 4), new Date(2000, 7, 31));
});

test('num more than 1', (t) => {
  t.is(num(new Date(2000, 2, 10), new Date(2020, 4, 20), 1), 21);
});

test('num exactly 1', (t) => {
  t.is(num(new Date(2020, 2, 10), new Date(2020, 4, 20), 1), 1);
});

test('num exactly 0', (t) => {
  t.is(num(new Date(2020, 4, 20), new Date(2020, 4, 20), 1), 0);
});
