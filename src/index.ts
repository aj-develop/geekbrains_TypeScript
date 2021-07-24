import { renderSearchFormBlock } from './search-form.js'
import { renderSearchStubBlock, search } from './search-results.js'
import { renderUserBlock } from './user.js'
import { renderToast } from './lib.js'
import { UserStorage } from './storage-helper.js'
import { SearchFormData } from './interfaces/searchFormData.js'
import { SearchCallback } from './interfaces/searchCallback.js'

window.addEventListener('DOMContentLoaded', () => {
  const userStorage = new UserStorage('user')
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

    const callback: SearchCallback = (error, place) => {
      setTimeout(function(){
        // if (error == null && place != null) {
        if (Math.random() < 0.5) {
          console.log(place)
        } else {
          console.error('Fail', error)
        }
      }, 2000);
    }

    search(searchFormData, callback)

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
