import test from 'ava';

import R from 'ramda';

import { calcPrice, calcYield } from '../src/bond';

const title = bond => `${bond.settlement} ${bond.maturity} ${bond.rate} ${bond.redemption} ${bond.frequency} ${bond.price} ${bond.yield}`;

const approxEqual = (a, b) => Math.abs(a - b) < 1e-10;

const testCalcPrice = (bond, price, convention) => test(`calcPrice ${title(bond)} ${convention}`, (t) => {
  t.true(
    approxEqual(
      calcPrice(
        bond.settlement,
        bond.maturity,
        bond.rate,
        bond.yield,
        bond.redemption,
        bond.frequency,
        convention
      ), price));
});

const testCalcYield = (bond, yld, convention) => test(`calcYield ${title(bond)} ${convention}`, (t) => {
  t.true(
    approxEqual(
      calcYield(
        bond.settlement,
        bond.maturity,
        bond.rate,
        bond.price,
        bond.redemption,
        bond.frequency,
        convention
      ), yld));
});

const mapTestCalc = (testCalc, prop, bond) => R.compose(
  R.mapObjIndexed((value, key) => testCalc(bond, value, key)),
  R.prop(prop),
)(bond);

const testBonds = R.map(bond =>
  mapTestCalc(testCalcPrice, 'prices', bond) &&
  mapTestCalc(testCalcYield, 'yields', bond)
);

const bonds = [
  {
    settlement: '2000-03-02',
    maturity: '2020-05-15',
    rate: 0.04,
    redemption: 100,
    frequency: 2,
    yield: 0.05,
    prices: {
      '30U/360': 87.3684351753566,
      'ACTUAL/ACTUAL': 87.36824142551,
      'ACTUAL/360': 87.3694732958558,
      'ACTUAL/365': 87.3679380374216,
      '30E/360': 87.3684351753566,
    },
    price: 102,
    yields: {
      '30U/360': 0.038562485711828,
      'ACTUAL/ACTUAL': 0.0385625072757728,
      'ACTUAL/360': 0.038562370756769,
      'ACTUAL/365': 0.0385625411114318,
      '30E/360': 0.038562485711828,
    },
  },
  {
    settlement: '2000-02-29',
    maturity: '2020-05-15',
    rate: 0.04,
    redemption: 100,
    frequency: 2,
    yield: 0.05,
    prices: {
      '30U/360': 87.3653308121343,
      'ACTUAL/ACTUAL': 87.3661935242832,
      'ACTUAL/360': 87.367398721389,
      'ACTUAL/365': 87.3658966998256,
      '30E/360': 87.3653308121343,
    },
    price: 98,
    yields: {
      '30U/360': 0.0414674524362749,
      'ACTUAL/ACTUAL': 0.0414675732336102,
      'ACTUAL/360': 0.0414677428628424,
      'ACTUAL/365': 0.0414675316128867,
      '30E/360': 0.0414674524362749,
    },
  },
  {
    settlement: '2000-03-02',
    maturity: '2019-02-28',
    rate: 0.04,
    redemption: 101,
    frequency: 4,
    yield: 0.035,
    prices: {
      '30U/360': 107.432010205581,
      'ACTUAL/ACTUAL': 107.432041059242,
      'ACTUAL/360': 107.432010205581,
      'ACTUAL/365': 107.432029647392,
      '30E/360': 107.431301096697,
    },
    price: 98,
    yields: {
      '30U/360': 0.0418789696104424,
      'ACTUAL/ACTUAL': 0.0418789617951502,
      'ACTUAL/360': 0.0418789696102784,
      'ACTUAL/365': 0.0418789646854887,
      '30E/360': 0.0418791499081951,
    },
  },
  {
    settlement: '2000-03-02',
    maturity: '2000-08-12',
    rate: 0.04,
    redemption: 99,
    frequency: 2,
    yield: 0.035,
    prices: {
      '30U/360': 99.2307318259178,
      'ACTUAL/ACTUAL': 99.2326553499516,
      'ACTUAL/360': 99.2323229146249,
      'ACTUAL/365': 99.2327373325154,
      '30E/360': 99.2307318259178,
    },
    price: 100.5,
    yields: {
      '30U/360': 0.00620518477661382,
      'ACTUAL/ACTUAL': 0.00645729871901717,
      'ACTUAL/360': 0.00645729871901717,
      'ACTUAL/365': 0.00645729871901717,
      '30E/360': 0.00620518477661382,
    },
  },
  {
    settlement: '2000-02-29',
    maturity: '2000-08-12',
    rate: 0.04,
    redemption: 99,
    frequency: 2,
    yield: 0.035,
    prices: {
      '30U/360': 99.2355105587533,
      'ACTUAL/ACTUAL': 99.2358086778342,
      'ACTUAL/360': 99.2355105587533,
      'ACTUAL/365': 99.2358821964173,
      '30E/360': 99.2355105587533,
    },
    price: 100.05,
    yields: {
      '30U/360': 0.016873271875212,
      'ACTUAL/ACTUAL': 0.0167965871031687,
      'ACTUAL/360': 0.0167965871031687,
      'ACTUAL/365': 0.0167965871031687,
      '30E/360': 0.0167697548698426,
    },
  },
  {
    settlement: '2000-01-02',
    maturity: '2000-02-29',
    rate: 0.04,
    redemption: 100.25,
    frequency: 1,
    yield: 0.0375,
    prices: {
      '30U/360': 100.26838314811,
      'ACTUAL/ACTUAL': 100.268021154409,
      'ACTUAL/360': 100.266132522908,
      'ACTUAL/365': 100.26770680053,
      '30E/360': 100.267624044923,
    },
    price: 99.99,
    yields: {
      '30U/360': 0.0552735980860227,
      'ACTUAL/ACTUAL': 0.0545752843977059,
      'ACTUAL/360': 0.0545752843977059,
      'ACTUAL/365': 0.0545752843977059,
      '30E/360': 0.0539039335501639,
    },
  },
  {
    settlement: '2000-03-15',
    maturity: '2002-03-15',
    rate: 0.04,
    redemption: 100,
    frequency: 1,
    yield: 0.04,
    prices: {
      '30U/360': 100,
      'ACTUAL/ACTUAL': 100,
      'ACTUAL/360': 100,
      'ACTUAL/365': 100,
      '30E/360': 100,
    },
    price: 100,
    yields: {
      '30U/360': 0.04,
      'ACTUAL/ACTUAL': 0.04,
      'ACTUAL/360': 0.04,
      'ACTUAL/365': 0.04,
      '30E/360': 0.04,
    },
  },
];

testBonds(bonds);
