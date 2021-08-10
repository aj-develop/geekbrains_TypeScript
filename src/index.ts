import { renderSearchFormBlock } from './search-form.js'
import {
  renderSearchStubBlock,
  search,
  renderSearchResultsBlock,
  renderEmptyOrErrorSearchBlock
} from './search-results.js'
import { renderUserBlock } from './user.js'
import {
  renderToast,
  toggleFavoriteItem
} from './lib.js'
import { UserStorage } from './storage-helper.js'
import { SearchFormData } from './interfaces/searchFormData.js'

window.addEventListener('DOMContentLoaded', () => {
  const userStorage = new UserStorage()
  userStorage.save()
  const user = userStorage.getUserData()
  renderUserBlock(user)
  renderSearchFormBlock()

  const searchFormData: SearchFormData = {
    checkInDate: '',
    checkOutDate: '',
    city: '',
    cityCoordinates: '',
    provider: [],
    priceLimit: 0
  }

  const form: HTMLFormElement = document.querySelector('#search-form')
  form.onsubmit = () => {
    const formData = new FormData(form)
    Object.keys(searchFormData).forEach((element) => {
      if (formData.get(element)){
        element === 'provider' ?
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          searchFormData[element] = formData.getAll(element) :
          searchFormData[element] = formData.get(element)
      }
    });
    search(searchFormData)
      .then(placesIn => {

        let places;
        if (placesIn.length > 0) {
          if (placesIn.length === 1) {
            places = placesIn[0]
          } else if (placesIn.length === 2) {
            places = [ ...placesIn[0], ...placesIn[1] ]
          }
          console.log(places)
          renderSearchResultsBlock(places)
          const divFavorites = document.querySelectorAll('div.favorites')
          divFavorites.forEach((element) => {
            element?.addEventListener('click', toggleFavoriteItem)
          })
        } else {
          renderEmptyOrErrorSearchBlock('По вашему запросу ничего не найдено :(')
        }
      })
    return false;
  };


  // тест - работает
  // renderSearchFormBlock('2021-07-25', '2021-08-03')
  renderSearchStubBlock()
})
