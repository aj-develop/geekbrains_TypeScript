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
    checkin: '',
    checkout: '',
    city: '',
    cityCoordinates: '',
    flatRent: false,
    homy: false,
    price: 0
  }

  const form: HTMLFormElement = document.querySelector('#search-form')
  form.onsubmit = () => {
    const formData = new FormData(form)
    Object.keys(searchFormData).forEach((element) => {
      if (formData.get(element)){
        searchFormData[element] = formData.get(element)
      }
    });
    search(searchFormData)
      .then(places => {
        if (places.length > 0) {
          renderSearchResultsBlock(places)
          const divFavorites = document.querySelectorAll('div.favorites')
          divFavorites.forEach( (element) => {
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
  renderToast(
    {text: 'Это пример уведомления. Используйте его при необходимости', type: 'success'},
    {name: 'Понял', handler: () => {console.log('Уведомление закрыто')}}
  )
})
