import { renderBlock, renderToast} from './lib.js'
import { FavoriteStorage } from './storage-helper.js'
import { HomyRepository } from './Classes/Domain/Repository/HomyRepository.js'
import { FlatRentRepository } from './Classes/Domain/Repository/FlatRentRepository.js'
import { SearchInterface } from './Classes/Domain/Model/SearchInterface.js'
import { Accommodation } from './Classes/Domain/Model/Accommodation.js';

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

export function renderSearchResultsHeader () : void {
  renderBlock(
    'search-results-block',
    `
    <div class="search-results-header">
        <p>Результаты поиска</p>
        <div class="search-results-filter">
            <span><i class="icon icon-filter"></i> Сортировать:</span>
            <select id="results-filter">
                <option value="sortPriceASC" selected="selected">Сначала дешёвые</option>
                <option value="sortPriceDESC" >Сначала дорогие</option>
                <option value="sortRemotenessASC">Сначала ближе</option>
            </select>
        </div>
    </div>
    <ul class="results-list" id="search-results-list"></ul>
    `
  )
}



export function renderSearchResultsBlock (places: Accommodation[]) : void {
  let placesHTML = '';
  const favoriteStorage = new FavoriteStorage()

  places.forEach( (place) => {
    placesHTML += `
      <li class="result">
          <div class="result-container">
            <div class="result-img-container">
              <div
                  data-id="${place.getId()}"
                  data-name="${place.name} "
                  data-image="${place.image}"
                  class="favorites ${favoriteStorage.isFavoriteItemsInStorage(place.getId()) ? ' active' : ''}"></div>
              <img class="result-img" src="${place.image}" alt="">
            </div>
            <div class="result-info">
              <div class="result-info--header">
                <p>${place.name}</p>
                <p class="price">${place.price}&#8381;</p>
              </div>`

    if(place.remoteness>0){
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
    'search-results-list',
    placesHTML
  )

}

export async function search (searchFormData : SearchInterface)
{
  const provider : FormDataEntryValue[] = searchFormData.provider
  const homy = new HomyRepository()
  const flatRent = new FlatRentRepository()

  if (provider.length>0) {
    if (provider.indexOf('homy') !== -1 && provider.indexOf('flatRent') === -1) {
      return Promise.all([homy.find(searchFormData)])
    }
    else if (provider.indexOf('flatRent') !== -1 && provider.indexOf('homy') === -1) {
      return Promise.all([flatRent.find(searchFormData)])
    }
    else if (provider.indexOf('homy') !== -1 && provider.indexOf('flatRent') !== -1) {
      return Promise.all([
        homy.find(searchFormData),
        flatRent.find(searchFormData)
      ])
    }
  } else {
    renderToast(
      {text: 'Выберите, пожалуйста, провайдера!', type: 'error'},
      {name: 'Понял', handler: () => {console.log('Уведомление закрыто')}}
    )
  }
}
