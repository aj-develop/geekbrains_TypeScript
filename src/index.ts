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
import { sortPriceASC, sortByMethod} from './Classes/Utility/Sort.js'

window.addEventListener('DOMContentLoaded', () => {
  const userStorage = new UserStorage()
  userStorage.save()
  const user = userStorage.getUserData()
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

  const form: HTMLFormElement = document.querySelector('#search-form')
  form.onsubmit = () => {
    const formData = new FormData(form)
    Object.keys(filter).forEach((element) => {
      if (formData.get(element)){
        element === 'provider' ?
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          filter[element] = formData.getAll(element) :
          filter[element] = formData.get(element)
      }
    });
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    search(filter)
      .then(results => {
        const allResults: Accommodation[] = [].concat(results[0], results[1]).filter(item => item)
        if (allResults.length > 0) {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          renderSearchResultsHeader()
          renderSearchResultsBlock(allResults.sort(sortPriceASC))
          const divFavorites = document.querySelectorAll('div.favorites')
          divFavorites.forEach((element) => {
            element?.addEventListener('click', toggleFavoriteItem)
          })
          const resultsFilter = document.querySelector('#results-filter');
          resultsFilter.addEventListener(
            'change',
            sortAllResults.bind(this, allResults)
          );
        }
        else {
          renderEmptyOrErrorSearchBlock('По вашему запросу ничего не найдено :(')
        }
      })
    return false;
  };
  renderSearchStubBlock()
})

function sortAllResults(accommodations: Accommodation[], event: Event) : void
{
  const eventTargetElement = <HTMLSelectElement>event.target;
  if (eventTargetElement){
    const index = eventTargetElement.options.selectedIndex;
    accommodations.sort(sortByMethod[eventTargetElement.options[index].value]);
    renderBlock('search-results-list', '')
    renderSearchResultsBlock(accommodations)
  }
}
