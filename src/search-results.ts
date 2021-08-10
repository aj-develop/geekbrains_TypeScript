import { renderBlock, renderToast, convertStringToDate } from './lib.js'
import { SearchFormData } from './interfaces/searchFormData.js'
import { Place } from './interfaces/place.js'
import { FavoriteStorage } from './storage-helper.js'
import { FlatRentSdk, searchObject } from './flat-rent-sdk.js'
import { FlatRent } from './interfaces/flatRent.js'

export function renderSearchStubBlock () : void {
  renderBlock(
    'search-results-block',
    `
    <div class="before-results-block">
      <img src="img/start-search.png"  alt="start search"/>
      <p>Чтобы начать поиск, заполните форму и&nbsp;нажмите "Найти"</p>
    </div>
    `
  )
}

export function renderEmptyOrErrorSearchBlock (reasonMessage?: string) : void {
  renderBlock(
    'search-results-block',
    `
    <div class="no-results-block">
      <img src="img/no-results.png"  alt="no results"/>
      <p>${reasonMessage}</p>
    </div>
    `
  )
}

export function renderSearchResultsBlock (places: Place[] | FlatRent[]) : void {
  let placesHTML = '';
  const favoriteStorage = new FavoriteStorage()

  places.forEach( (place) => {

    if ((<FlatRent>place).title) {
      place = <Place>{
        ...place,
        image: (<FlatRent>place).photos[0],
        name: (<FlatRent>place).title,
        description: (<FlatRent>place).details,
        price: (<FlatRent>place).totalPrice,
        remoteness: null
      }
    }

    placesHTML += `<li class="result">
        <div class="result-container">
          <div class="result-img-container">
            <div
                data-id="${place.id}"
                data-name="${place.name} "
                data-image="${place.image}"
                class="favorites ${favoriteStorage.isFavoriteItemsInStorage(place.id) ? ' active' : ''}"></div>
            <img class="result-img" src="${place.image}" alt="">
          </div>
          <div class="result-info">
            <div class="result-info--header">
              <p>${place.name}</p>
              <p class="price">${place.price}&#8381;</p>
            </div>`

    if(place.remoteness){
      placesHTML += `<div class="result-info--map"><i class="map-icon"></i> ${place.remoteness}км от вас</div>`
    }

    placesHTML +=`<div class="result-info--descr">${place.description}</div>
            <div class="result-info--footer">
              <div>
                <button>Забронировать</button>
              </div>
            </div>
          </div>
        </div>
      </li>`
  })

  renderBlock(
    'search-results-block',
    `
    <div class="search-results-header">
        <p>Результаты поиска</p>
        <div class="search-results-filter">
            <span><i class="icon icon-filter"></i> Сортировать:</span>
            <select>
                <option selected="">Сначала дешёвые</option>
                <option selected="">Сначала дорогие</option>
                <option>Сначала ближе</option>
            </select>
        </div>
    </div>
    <ul class="results-list">` + placesHTML + '</ul>'
  )
}

export async function search (searchFormData : SearchFormData)
{
  const provider : [] = searchFormData.provider

  if (provider.length>0) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (provider.indexOf('homy') !== -1 && provider.indexOf('flatRent') === -1) {
      return Promise.all([searchHomy(searchFormData)])
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
    } else if (provider.indexOf('flatRent') !== -1 && provider.indexOf('homy') === -1) {
      return Promise.all([searchFlatRent(searchFormData)])
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
    } else if (provider.indexOf('homy') !== -1 && provider.indexOf('flatRent') !== -1) {
      return Promise.all([
        searchHomy(searchFormData),
        searchFlatRent(searchFormData)
      ])
    }
  } else {
    renderToast(
      {text: 'Выберите, пожалуйста, провайдера!', type: 'error'},
      {name: 'Понял', handler: () => {console.log('Уведомление закрыто')}}
    )
  }
}
/**
 * search places
 * @param searchFormData
 */
export async function searchFlatRent (searchFormData : SearchFormData)
{
  const flatRentSdk : FlatRentSdk = new FlatRentSdk
  const searchObject : searchObject = {
    checkInDate: convertStringToDate(searchFormData.checkInDate),
    checkOutDate: convertStringToDate(searchFormData.checkOutDate),
    city: searchFormData.city,
    priceLimit: searchFormData.priceLimit
  }
  return flatRentSdk.search(searchObject)
}
/**
 * search places
 * @param searchFormData
 */
export async function searchHomy (searchFormData : SearchFormData)
{
  const checkin = dateStringToUnixStamp(searchFormData.checkInDate)
  const checkout = dateStringToUnixStamp(searchFormData.checkOutDate)

  let url = 'http://localhost:3030/places?' +
    `checkInDate=${checkin}&` +
    `checkOutDate=${checkout}&` +
    `coordinates=${searchFormData.cityCoordinates}`

  if (+searchFormData.priceLimit > 0) {
    url += `&maxPrice=${searchFormData.priceLimit}`
  }

  try {
    const response = await fetch(url)
    const responseText = await response.text()
    return JSON.parse(responseText)
  } catch (error) {
    console.error('Looks like there was a problem: \n', error);
  }
}

/**
 * dateStringToUnixStamp
 * @param dateString
 * @return number
 */
function dateStringToUnixStamp(dateString : string) : number {
  return dateToUnixStamp(new Date(dateString))
}

/**
 * dateToUnixStamp
 * @param date
 * @return number
 */
function dateToUnixStamp(date: Date) : number {
  return date.getTime() / 1000
}
