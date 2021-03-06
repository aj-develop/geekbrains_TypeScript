import {FavoriteStorage} from './storage-helper.js'
import {Place} from './interfaces/place';

export function renderBlock (elementId: string, html: string) : void
{
  const element = document.getElementById(elementId)
  element.innerHTML = html
}

export function toggleFavoriteItem (this: HTMLElement) : void
{
  const placeIn = this.dataset
  const favoriteStorage = new FavoriteStorage()
  const favoriteItemsInStorage = favoriteStorage.get()

  if (favoriteItemsInStorage){
    const findIndex = favoriteItemsInStorage.findIndex(place => Number(place.id) === Number(placeIn.id))
    if (findIndex >= 0) { // remove item from favoriteItems storage
      favoriteItemsInStorage.splice(findIndex,1)
      this.classList.remove('active');
      if (favoriteItemsInStorage.length > 0) { // save items to favoriteItems storage
        favoriteStorage.save(favoriteItemsInStorage)
      } else { // clear favoriteItems storage
        favoriteStorage.clear()
      }
    } else { // add item to favoriteItems storage
      const placeInObject : Partial<Place> = {}
      Object.assign(placeInObject, {...placeIn})
      favoriteItemsInStorage.push(<Place>placeInObject)
      favoriteStorage.save(favoriteItemsInStorage)
      this.classList.add('active');
    }
  } else { // initial
    favoriteStorage.saveInitial(placeIn)
    this.classList.add('active');
  }
}
export function renderToast (message, action?) : void
{
  let messageText = ''
  
  if (message != null) {
    messageText = `
      <div id="info-block" class="info-block ${message.type}">
        <p>${message.text}</p>
        <button id="toast-main-action">${action?.name || 'Закрыть'}</button>
      </div>
    `
  }
  
  renderBlock(
    'toast-block',
    messageText
  )

  const button = document.getElementById('toast-main-action')
  if (button != null) {
    button.onclick = function() {
      if (action != null && action.handler != null) {
        action.handler()
      }
      renderToast(null)
    }
  }
}

/**
 * convert date to string '2021-07-11'
 * @param date
 */
export function convertDateToString(date: Date) :string
{
  return date.toISOString().substr(0,10)
}

/**
 * convert string '2021-07-11' to date
 * @param string
 */
export function convertStringToDate(dateString : string) :Date
{
  return new Date(dateString)
}

