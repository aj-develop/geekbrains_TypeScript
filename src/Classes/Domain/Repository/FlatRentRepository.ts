import { Accommodation } from '../Model/Accommodation.js'
import { ProviderInterface } from '../Model/ProviderInterface.js'
import { SearchInterface } from '../Model/SearchInterface.js'
import { Http } from '../../Utility/Http.js'
import {
  FlatRentResponse,
  FlatRentListResponse,
  FlatRent as FlatRentAccommodation} from '../Model/Providers/FlatRent.js'
import { convertStringToDate } from '../../Utility/Date.js'
import {
  FlatRentSdk,
  searchObject
} from '../../../flat-rent-sdk.js'

export class FlatRentRepository implements ProviderInterface {
  public static provider = 'flatRent'

  public find(filter: SearchInterface): Accommodation[] {

    const flatRentSdk : FlatRentSdk = new FlatRentSdk
    const searchObject : searchObject = {
      checkInDate: convertStringToDate(filter.checkInDate),
      checkOutDate: convertStringToDate(filter.checkOutDate),
      city: filter.city,
      priceLimit: +filter.priceLimit
    }

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return flatRentSdk.search(searchObject)
      .then((response) => {
        //FlatRentRepository.assertIsValidResponse(response)
        return this.convertFlatRentListResponse(response)
      })
  }

  public getById(id: string): Promise<Accommodation> {
    return Http.fetchAsJson<FlatRentResponse>(FlatRentRepository + id)
      .then((response) => {
        FlatRentRepository.assertIsValidResponse(response)
        return FlatRentRepository.convertFlatRentResponse(response.item) })
  }

  private static assertIsValidResponse(response: FlatRentListResponse | FlatRentResponse): void {
    if (response.errorMessage != null) {
      throw new Error(response.errorMessage)
    }
  }

  private convertFlatRentListResponse(response: [FlatRentAccommodation]): Accommodation[] {
    return response.map((item) => {
      return FlatRentRepository.convertFlatRentResponse(item) }
    )
  }

  private static convertFlatRentResponse(item: FlatRentAccommodation): Accommodation {
    return new Accommodation(
      FlatRentRepository.provider,
      String(item.id),
      item.title,
      item.details,
      item.totalPrice,
      item.photos[0],
      0,
      item.bookedDates
    )
  }
}
