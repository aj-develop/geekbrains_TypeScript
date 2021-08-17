import { Accommodation } from '../Domain/Model/Accommodation.js';

export function sortPriceASC(one: Accommodation, two: Accommodation) : number
{
  return one.price - two.price;
}

export function sortPriceDESC(one: Accommodation, two: Accommodation) : number
{
  return two.price - one.price;
}

export function sortRemotenessASC(one: Accommodation, two: Accommodation) : number
{
  return one.remoteness - two.remoteness;
}

export const sortByMethod = {
  'sortPriceASC': sortPriceASC,
  'sortPriceDESC': sortPriceDESC,
  'sortRemotenessASC': sortRemotenessASC
}
