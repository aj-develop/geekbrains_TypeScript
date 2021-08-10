import {Place} from './interfaces/place.js';

export function cloneDate(date: Date) : Date
export function addDays(date : Date, days : number) : Date
export interface searchObject {
  checkInDate: Date,
  checkOutDate: Date,
  city: string,
  priceLimit: number
}
export class FlatRentSdk {
  get(id : string) : Promise<Place|null>
  search(parameters : searchObject) : [Place]
  book(flatId : number, checkInDate : Date, checkOutDate: Date) : number
}
