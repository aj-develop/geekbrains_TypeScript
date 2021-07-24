import {IStorageItem} from './interfaces/IStorageItem.js'
import {User} from './interfaces/user.js'

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

export class UserStorage {
  storageWorker: LocalStorageWorker;

  // main key that use for store user
  storageKey: string

  constructor(storageKey: string) {
    this.storageWorker = new LocalStorageWorker();
    this.storageKey = storageKey
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
