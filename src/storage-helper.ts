import {IStorageItem} from './interfaces/IStorageItem.js'
import {User} from './interfaces/user.js'
import {Place} from './interfaces/place.js'

export class StorageItem {
    key: string;
    value: any;

    constructor(data: IStorageItem) {
      this.key = data.key;
      this.value = data.value;
    }
}

export class LocalStorageWorker {
    localStorageSupported: boolean;

    constructor() {
      this.localStorageSupported = typeof window['localStorage'] != 'undefined' && window['localStorage'] != null
    }

    // add value to storage
    add(key: string, item: string) : void {
      if (this.localStorageSupported) {
        localStorage.setItem(key, item)
      }
    }

    // get all values from storage
    getAllItems() : Array<StorageItem> {
      const list = new Array<StorageItem>()

      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        const value = localStorage.getItem(key)

        list.push(new StorageItem({
          key: key,
          value: value
        }))
      }

      return list
    }

    // get only all values from localStorage
    getAllValues() : Array<any> {
      const list = new Array<any>()

      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        const value = localStorage.getItem(key)

        list.push(value)
      }

      return list
    }

    // get one item by key from storage
    get(key: string) : string {
      if (this.localStorageSupported) {
        return localStorage.getItem(key)
      } else {
        return null
      }
    }

    // remove value from storage
    remove(key: string) : void {
      if (this.localStorageSupported) {
        localStorage.removeItem(key)
      }
    }

    // clear storage (remove all items from it)
    clear() : void {
      if (this.localStorageSupported) {
        localStorage.clear()
      }
    }
}

export class FavoriteStorage {
  storageWorker: LocalStorageWorker;
  storageKey: string

  constructor() {
    this.storageWorker = new LocalStorageWorker();
    this.storageKey = 'favoriteItems'
  }

  isFavoriteItemsInStorage(id : string) : boolean {
    const storageData = this.get()
    let isFavoriteItemsInStorage = false
    if (storageData) {
      const findIndex = storageData.findIndex(place => String(place.id) === String(id))
      isFavoriteItemsInStorage = findIndex >= 0
    }
    return isFavoriteItemsInStorage
  }

  getFavoritesAmount () : number {
    const favorites = this.get()
    return favorites ? favorites.length : 0
  }

  get() : Array<Place> {
    const storageData = this.storageWorker.get(this.storageKey)
    if (storageData != null && storageData.length > 0) {
      return   JSON.parse(storageData)
    }
  }

  save(favorites : Array<Place>) : void {
    this.storageWorker.add(this.storageKey, JSON.stringify(favorites))
  }

  saveInitial(favoriteItem: DOMStringMap) : void {
    const set = []
    set[0] = favoriteItem
    this.storageWorker.add(this.storageKey, JSON.stringify(set))
  }

  clear() : void {
    this.storageWorker.remove(this.storageKey)
  }

}

export class UserStorage {
  storageWorker: LocalStorageWorker;
  storageKey: string

  constructor() {
    this.storageWorker = new LocalStorageWorker();
    this.storageKey = 'user'
  }

  // save to storage (save as JSON string)
  save() : void {
    const newUser : User = {
      name: 'Wade Warren',
      avatarUrl: '/img/avatar.png',
      favoritesAmount: 7
    }
    const jsonUser = JSON.stringify(newUser)
    this.storageWorker.add(this.storageKey, jsonUser)
  }

  getUserData() : User {
    const storageData = this.storageWorker.get(this.storageKey)

    if (storageData != null && storageData.length > 0) {
      return JSON.parse(storageData)
    }
  }
}
