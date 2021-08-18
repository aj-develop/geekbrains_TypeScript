import { renderBlock } from './lib.js'
import { User } from './interfaces/user.js'
import {FavoriteStorage} from './storage-helper.js'

export function renderUserBlock (user: User | undefined) : void
{
  const favoriteStorage = new FavoriteStorage()
  const hasFavoriteItems = favoriteStorage.getFavoritesAmount() > 0
  const favoritesCaption = hasFavoriteItems ? favoriteStorage.getFavoritesAmount() : 'ничего нет'

  if (user != undefined) {
    renderBlock(
      'user-block',
      `
    <div class="header-container">
      <img class="avatar" src="${user.avatarUrl}" alt="${user.name}" title="${user.name}" />
      <div class="info">
          <p class="name">${user.name}</p>
          <p class="fav">
            <i class="heart-icon${hasFavoriteItems ? ' active' : ''}"></i>${favoritesCaption}
          </p>
      </div>
    </div>
    `
    )
  }
}
