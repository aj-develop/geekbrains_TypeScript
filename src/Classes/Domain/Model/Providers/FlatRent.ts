export interface  FlatRentListResponse {
  errorMessage?: string
  items:  FlatRent[]
}

export interface  FlatRentResponse {
  errorMessage?: string
  item:  FlatRent
}

export interface  FlatRent {
  id: string;
  title: string;
  details: string;
  photos: string[];
  coordinates: number[];
  bookedDates: [];
  totalPrice: number;
}
