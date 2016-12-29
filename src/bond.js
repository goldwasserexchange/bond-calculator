import R from 'ramda';

import { differenceInDays } from 'date-fns';

import { days, accrued, previous as previousCoupon, next as nextCoupon, num } from './coupon';

import newton from './newton';

const _price = (rate, yld, redemption, frequency, DSC, E, N, A) => R.reduce(
    (acc, k) => acc + 100 * rate / frequency / (1 + yld / frequency) ** (k - 1 + DSC / E),
    redemption / (1 + yld / frequency) ** (N - 1 + DSC / E) - 100 * rate / frequency * A / E,
    R.range(1, N + 1)
);

export const calcPrice = (settlement, maturity, rate, yld, redemption, frequency, convention) => {
  const previous = previousCoupon(settlement, maturity, frequency);
  const next = nextCoupon(settlement, maturity, frequency);
  const E = days(previous, next, frequency, convention);
  const A = accrued(previous, settlement, convention);
  const DSC = E - A;
  const N = num(settlement, maturity, frequency);

  if (N === 1) {
    const T1 = 100 * rate / frequency + redemption;
    const T2 = yld / frequency * DSC / E + 1;
    const T3 = 100 * rate / frequency * A / E;
    return T1 / T2 - T3;
  }

  return _price(rate, yld, redemption, frequency, DSC, E, N, A);
};

const dPriceDYld = (rate, yld, redemption, frequency, DSC, E, N) => R.reduce(
  (acc, k) =>
    acc - (100 * rate / frequency) ** 2 *
          (k - 1 + DSC / E) *
          (1 + yld / frequency) ** (-(k + DSC / E)),
    -redemption / frequency * (N - 1 + DSC / E) * (1 + yld / frequency) ** (-(N + DSC / E)),
    R.range(1, N + 1)
);

export const calcYield = (settlement, maturity, rate, pr, redemption, frequency, convention) => {
  const previous = previousCoupon(settlement, maturity, frequency);
  const next = nextCoupon(settlement, maturity, frequency);
  const A = accrued(previous, settlement, convention);
  let E = days(previous, next, frequency, convention);
  let DSC = E - A;
  const N = num(settlement, maturity, frequency);

  if (N === 1) {
    DSC = accrued(settlement, maturity, convention);
    if (R.contains('ACTUAL', convention)) E = differenceInDays(maturity, previous);
    return (redemption / 100 + rate / frequency - pr / 100 - A / E * rate / frequency) /
           (pr / 100 + A / E * rate / frequency) * frequency * E / DSC;
  }

  const f = x => _price(rate, x, redemption, frequency, DSC, E, N, A) - pr;
  const fp = x => dPriceDYld(rate, x, redemption, frequency, DSC, E, N);

  return newton(f, fp, rate);
};
