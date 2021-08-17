import { Accommodation } from './Accommodation.js'
import { SearchInterface } from './SearchInterface.js'

export interface ProviderInterface {
  find(filter: SearchInterface): Promise<Accommodation[]> | Accommodation[]
  getById(id: string): Promise<Accommodation>
}
