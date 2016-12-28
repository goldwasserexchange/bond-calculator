import R from 'ramda';

import { getYear, getMonth, getDate, differenceInDays, differenceInMonths, isBefore, isAfter } from 'date-fns';

import { countDays30360, startOfEndOfMonth, isEndOfMonth, isEndOfFebruary, addPeriods, changeYear } from './utils';

const differenceInMonthsC = R.curry(differenceInMonths);
const isBeforeC = R.curry(isBefore);
const isAfterC = R.curry(isAfter);

export const days = (previous, next, frequency, convention) => {
  switch (convention) {
    case 'ACTUAL/365':
      return 365 / frequency;
    case 'ACTUAL/ACTUAL':
      return differenceInDays(next, previous);
    case '30U/360':
    case '30E/360':
    case 'ACTUAL/360':
    default:
      return 360 / frequency;
  }
};

export const accrued = (date1, date2, convention) => {
  let d1 = getDate(date1);
  const m1 = getMonth(date1);
  const y1 = getYear(date1);

  let d2 = getDate(date2);
  const m2 = getMonth(date2);
  const y2 = getYear(date2);

  switch (convention) {
    case '30E/360':
      return countDays30360(d1, m1, y1, d2, m2, y2);
    case 'ACTUAL/360':
    case 'ACTUAL/365':
    case 'ACTUAL/ACTUAL':
      return differenceInDays(date2, date1);
    case '30U/360':
    default:
      if (isEndOfFebruary(date1)) d1 = 30;
      if (isEndOfFebruary(date1) && isEndOfFebruary(date2)) d2 = 30;
      return countDays30360(d1, m1, y1, d2, m2, y2);
  }
};

export const dates = (settlement, maturity, frequency) =>
  R.map(
    R.compose(
      R.when(R.always(isEndOfMonth(maturity)), startOfEndOfMonth),
      addPeriods(changeYear(maturity, settlement), frequency)
    ),
    R.range(-2, 3)
  );

export const previous = (settlement, maturity, frequency) => R.compose(
  R.findLast(isBeforeC(R.__, settlement)),
  dates
)(settlement, maturity, frequency);

export const next = (settlement, maturity, frequency) => R.compose(
  R.find(isAfterC(R.__, settlement)),
  dates
)(settlement, maturity, frequency);

export const num = (settlement, maturity, frequency) => R.compose(
  Math.ceil,
  R.add(1),
  R.multiply(frequency / 12),
  differenceInMonthsC(maturity),
  next
)(settlement, maturity, frequency);
