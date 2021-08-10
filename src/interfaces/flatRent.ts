export interface FlatRent {
  id: string;
  title: string;
  details: string;
  photos: string[];
  coordinates: number[];
  bookedDates: Date[];
  totalPrice: number;
}
