import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root',
})
export class StoreService {
  constructor() {}
  addToken(token: string) {
    return localStorage.setItem('token', token);
  }
  removeToken() {
    return localStorage.removeItem('token');
  }
  getToken() {
    return localStorage.getItem('token');
  }
}
