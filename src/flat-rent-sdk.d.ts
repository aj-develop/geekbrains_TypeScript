import { FlatRent } from './Classes/Domain/Model/Providers/FlatRent.js';

export function cloneDate(date: Date) : Date
export function addDays(date : Date, days : number) : Date
export interface searchObject {
  checkInDate: Date,
  checkOutDate: Date,
  city: string,
  priceLimit: number
}
export class FlatRentSdk {
  get(id : string) : Promise<FlatRent|null>
  search(parameters : searchObject) : Promise<[FlatRent] | null>
  book(flatId : number, checkInDate : Date, checkOutDate: Date) : number
}
