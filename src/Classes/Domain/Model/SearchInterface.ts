export interface SearchInterface extends Record<string, any> {
  checkInDate: string ,
  checkOutDate: string,
  city: string,
  cityCoordinates: string,
  priceLimit: string,
  provider: FormDataEntryValue[]
}
