import { Place } from './place.js'

export interface SearchCallback {
  (error?: Error, place?: Place[]): void
}
