export interface HomyListResponse {
  errorMessage?: string
  items: Homy[]
}

export interface HomyResponse {
  errorMessage?: string
  item: Homy
}

export interface Homy {
  id: number;
  image: string;
  name: string;
  description: string;
  remoteness: number;
  bookedDates: number[];
  price: number;
}
