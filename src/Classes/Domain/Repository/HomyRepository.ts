import { Accommodation } from '../Model/Accommodation.js'
import { ProviderInterface } from '../Model/ProviderInterface.js'
import { SearchInterface } from '../Model/SearchInterface.js'
import { Http } from '../../Utility/Http.js'
import {
  HomyResponse,
  HomyListResponse,
  Homy as HomyAccommodation
} from '../Model/Providers/Homy.js'
import { dateStringToUnixStamp } from '../../Utility/Date.js'

export class HomyRepository implements ProviderInterface {
  public static provider = 'homy'
  private static apiUrl = 'http://localhost:3030/places?'

  public find(filter: SearchInterface): Promise<Accommodation[]> {
    return Http.fetchAsJson<[HomyAccommodation]>(
      HomyRepository.apiUrl + HomyRepository.convertFilterToQueryString(filter)
    )
      .then((response) => {
        //HomyRepository.assertIsValidResponse(response)
        return this.convertHomyListResponse(response)
      })
  }

  public getById(id: string): Promise<Accommodation> {
    return Http.fetchAsJson<HomyResponse>(HomyRepository.apiUrl + id)
      .then((response) => {
        HomyRepository.assertIsValidResponse(response)
        return HomyRepository.convertHomyResponse(response.item) })
  }

  private static assertIsValidResponse(response: HomyListResponse | HomyResponse): void {
    if (response.errorMessage != null) {
      throw new Error(response.errorMessage)
    }
  }

  private static convertFilterToQueryString(filter: SearchInterface): string {
    const checkin = dateStringToUnixStamp(filter.checkInDate)
    const checkout = dateStringToUnixStamp(filter.checkOutDate)

    let queryString = `checkInDate=${checkin}&` +
      `checkOutDate=${checkout}&` +
      `coordinates=${filter.cityCoordinates}`

    if (+filter.priceLimit > 0) {
      queryString += `&maxPrice=${filter.priceLimit}`
    }

    return queryString
  }


  private convertHomyListResponse(response: [HomyAccommodation]): Accommodation[] {
    return response.map((item) => {
      return HomyRepository.convertHomyResponse(item) }
    )
  }

  private static convertHomyResponse(item: HomyAccommodation): Accommodation {
    return new Accommodation(
      HomyRepository.provider,
      String(item.id),
      item.name,
      item.description,
      item.price,
      item.image,
      item.remoteness,
      item.bookedDates
    )
  }

}
