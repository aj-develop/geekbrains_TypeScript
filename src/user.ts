import { renderBlock } from './lib.js'

export function renderUserBlock (name: string, avatar: string, favoriteItemsAmount: number) : void {
  const hasFavoriteItems = favoriteItemsAmount > 0
  const favoritesCaption = hasFavoriteItems ? favoriteItemsAmount : 'ничего нет'

  renderBlock(
    'user-block',
    `
    <div class="header-container">
      <img class="avatar" src="${avatar}" alt="${name}" title="${name}" />
      <div class="info">
          <p class="name">${name}</p>
          <p class="fav">
            <i class="heart-icon${hasFavoriteItems ? ' active' : ''}"></i>${favoritesCaption}
          </p>
      </div>
    </div>
    `
  )
}
