import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root',
})
export class StoreService {
  constructor() {}
  addTokenFromStore(token: string) {
    return localStorage.setItem('token', token);
  }
  removeTokenFromStore() {
    return localStorage.removeItem('token');
  }
  getTokenFromStore() {
    return localStorage.getItem('token');
  }

  setDataFromStore(
    key: string,
    { property, value }: { property: string; value: any }
  ) {
    const get = localStorage.getItem(key);
    if (get) {
      let getedData = JSON.parse(get);
      getedData[property] = JSON.stringify(value);
      localStorage.setItem(key, JSON.stringify(getedData));
    } else {
      const data = JSON.stringify({ [property]: value });
      localStorage.setItem(key, data);
    }
  }
  getDataFromStore(key: string) {
    console.log(key);
    const get = localStorage.getItem(key);
    if (get) {
      return JSON.parse(get);
    } else {
      return 0;
    }
  }
  getProperty(key: string, property: string) {
    const get = localStorage.getItem(key);
    if (get) {
      let data = JSON.parse(get)?.[property];
      return data;
    } else {
      return 0;
    }
  }
}
