import Joi from 'joi';

import { calcPrice, calcYield } from './bond';

const schema = Joi.object().keys({
  settlement: Joi.date().max(Joi.ref('maturity')).required(),
  maturity: Joi.date().required(),
  rate: Joi.number().min(0).max(1).required(),
  redemption: Joi.number().positive().required(),
  frequency: Joi.number().valid([1, 2, 4]).required(),
  convention: Joi.string().valid([
    '30U/360',
    'ACTUAL/ACTUAL',
    'ACTUAL/360',
    'ACTUAL/365',
    '30E/360']).required(),
});

module.exports = (bond) => {
  if (!bond) throw new Error('A bond object is required');

  const validation = Joi.validate(bond, schema);

  if (validation.error) throw validation.error;

  const validBond = validation.value;

  return {
    price: yld => calcPrice(validBond.settlement,
                            validBond.maturity,
                            validBond.rate,
                            yld,
                            validBond.redemption,
                            validBond.frequency,
                            validBond.convention),
    yield: price => calcYield(validBond.settlement,
                              validBond.maturity,
                              validBond.rate,
                              price,
                              validBond.redemption,
                              validBond.frequency,
                              validBond.convention),
  };
};
