import { renderBlock } from './lib.js'
import { User } from './interfaces/user.js'

export function renderUserBlock (user: User) : void
{
  const hasFavoriteItems = user.favoritesAmount > 0
  const favoritesCaption = hasFavoriteItems ? user.favoritesAmount : 'ничего нет'

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
