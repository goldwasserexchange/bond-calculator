import test from 'ava';

import R from 'ramda';

import bondCalculator from '../src/index';

const errorContains = (error, msg) => error.message.indexOf(msg) !== -1;

const testMissing = R.curry((testBond, prop) =>
  test(`throws if ${prop} is missing`, (t) => {
    const error = t.throws(() => R.compose(bondCalculator, R.dissoc(prop))(testBond));
    t.true(errorContains(error, prop));
  }));

const testAssoc = (testBond, prop, val) =>
  test(`throws if ${prop} is ${val}`, (t) => {
    const error = t.throws(() => R.compose(bondCalculator, R.assoc(prop, val))(testBond));
    t.true(errorContains(error, prop));
  });

const testMissingsKeys = testBond => R.compose(R.map(testMissing(testBond)), R.keys)(testBond);

const hasPriceYield = R.both(R.has('price'), R.has('yield'));

const bond = {
  settlement: '2016-12-26',
  maturity: '2023-01-17',
  rate: 0.02625,
  redemption: 100,
  frequency: 2,
  convention: '30U/360',
};

testMissingsKeys(bond);

test('throws if bond is missing', (t) => {
  const error = t.throws(() => bondCalculator());
  t.true(error.message.indexOf('bond') !== -1);
});

testAssoc(bond, 'settlement', '2023-01-18');

testAssoc(bond, 'rate', 1.001);

testAssoc(bond, 'rate', -0.001);

testAssoc(bond, 'redemption', -1);

testAssoc(bond, 'frequency', 12);

testAssoc(bond, 'convention', 'UNKNOWN');

test('returns a object with price and yield functions', (t) => {
  const bc = bondCalculator(bond);
  t.true(hasPriceYield(bc));
});

test('price', (t) => {
  const bc = bondCalculator(bond);
  t.is(bc.price(0.025), 100.69785390232649);
});

test('yield', (t) => {
  const bc = bondCalculator(bond);
  t.is(bc.yield(98), 0.0298817753210426);
});
