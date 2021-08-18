import { renderSearchFormBlock } from './search-form.js'
import {
  renderSearchStubBlock,
  search,
  renderSearchResultsBlock,
  renderEmptyOrErrorSearchBlock,
  renderSearchResultsHeader
} from './search-results.js'
import { renderUserBlock } from './user.js'
import { toggleFavoriteItem, renderBlock } from './lib.js'
import { UserStorage } from './storage-helper.js'
import { SearchInterface } from './Classes/Domain/Model/SearchInterface.js'
import { Accommodation } from './Classes/Domain/Model/Accommodation.js';
import {sortByMethod, sortPriceASC} from './Classes/Utility/Sort.js'

window.addEventListener('DOMContentLoaded', () => {
  const userStorage = new UserStorage()
  userStorage.save()
  const user = userStorage.getUserData() || undefined
  renderUserBlock(user)
  renderSearchFormBlock()

  const filter: SearchInterface = {
    checkInDate: '',
    checkOutDate: '',
    city: '',
    cityCoordinates: '',
    priceLimit: '',
    provider: []
  }

  const form: HTMLFormElement | null = document.querySelector('#search-form')
  if (form != null) {
    form.onsubmit = () => {
      const formData = new FormData(form)
      Object.keys(filter).forEach((element ) => {
        if (formData.get(element)){
          element === 'provider' ?
            filter['provider'] = formData.getAll(element) :
            filter[element] = formData.get(element)
        }
      });
      search(filter)
        .then(results => {
          if (results != null) {
            const allResults: Accommodation[] = [...results[0], ...results[1]].filter(item => item)
            if (allResults.length > 0) {
              renderSearchResultsHeader()
              renderSearchResultsBlock(allResults.sort(sortPriceASC))
              const divFavorites = document.querySelectorAll('div.favorites')
              divFavorites.forEach((element) => {
                element?.addEventListener('click', toggleFavoriteItem)
              })
              const resultsFilter = document.querySelector('#results-filter');
              if (resultsFilter != null) {
                resultsFilter.addEventListener(
                  'change',
                  sortAllResults.bind(this, allResults)
                );
              }
            } else {
              renderEmptyOrErrorSearchBlock('По вашему запросу ничего не найдено :(')
            }
          }
        })
      return false;
    };
  }
  renderSearchStubBlock()
})

function sortAllResults(accommodations: Accommodation[], event: Event) : void
{
  const eventTargetElement = <HTMLSelectElement>event.target;
  if (eventTargetElement){
    const index : number = eventTargetElement.options.selectedIndex;
    if (index)  {
      if (eventTargetElement.options[index]) {
        const methodName = eventTargetElement.options[index].value
        accommodations.sort(sortByMethod[methodName]);
        renderBlock('search-results-list', '')
        renderSearchResultsBlock(accommodations)
      }
    }
  }
}
