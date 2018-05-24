import R from 'ramda';

const dTol = R.defaultTo(1e-13);
const dEps = R.defaultTo(1e-14);
const dMaxIter = R.defaultTo(100);

const _newton = (f, fp, x0, tol, eps, maxIter, iter) => {
  if (iter > maxIter) return x0;

  const y = f(x0);
  const yp = fp(x0);

  if (Math.abs(yp) < eps) throw new Error(`Newton's method failed to converge because yp is smaller than eps (${eps})`);

  const x1 = x0 - (y / yp);

  if (Math.abs(x0 - x1) <= tol * Math.abs(x1)) return x1;

  return _newton(f, fp, x1, tol, eps, maxIter, iter + 1);
};

export default function (f, fp, x0, tol, eps, maxIter) {
  return _newton(f, fp, x0, dTol(tol), dEps(eps), dMaxIter(maxIter), 0);
}
