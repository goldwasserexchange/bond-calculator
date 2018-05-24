import test from 'ava';

import newton from '../src/newton';

test('throws for too small yp', (t) => {
  const f = () => 1;
  const fp = () => 1e-15;
  const error = t.throws(() => newton(f, fp, 0));
  t.true(error.message.indexOf('eps') !== -1);
});

test('returns x0 after maxIter', (t) => {
  const f = x => x + 1;
  const fp = () => -2;
  t.is(newton(f, fp, 0), 609841766302823000);
});

test('finds the positive root of x^2 + x - 2', (t) => {
  const f = x => x ** 2 + x - 2;
  const fp = x => 2 * x + 1;
  t.is(newton(f, fp, 2), 1);
});

test('finds the negative root of x^2 + x - 2', (t) => {
  const f = x => x ** 2 + x - 2;
  const fp = x => 2 * x + 1;
  t.is(newton(f, fp, -2), -2);
});

test('finds the root of sin(x) at x = pi', (t) => {
  const f = x => Math.sin(x);
  const fp = x => Math.cos(x);
  t.is(newton(f, fp, 3), Math.PI);
});
