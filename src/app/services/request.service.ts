import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { StoreService } from './store.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RequestService {
  // private apiUrl = 'https://angular-userms-nest-knex.onrender.com';
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient, public store: StoreService) {}

  async get(
    pref: string,
    query?: Record<string, string | number | boolean>
  ): Promise<Observable<any>> {
    let options = { headers: new HttpHeaders(), params: new HttpParams() };

    const token = this.store.getToken() as string;
    if (token && token.length > 15) {
      options.headers = options.headers.append('Authorization', token);
    }

    if (query) {
      Object.keys(query).forEach((key) => {
        options.params = options.params.append(key, query[key].toString());
      });
    }

    return this.http.get(this.apiUrl + pref, {
      headers: options.headers,
      params: options.params,
    });
  }

  async put(pref: string, body: any): Promise<Observable<any>> {
    let options = { headers: new HttpHeaders() };

    const token = this.store.getToken() as string;
    if (token && token.length > 15) {
      options.headers = options.headers.append('Authorization', token);
    }

    console.log(this.apiUrl + pref);
    return this.http.put(this.apiUrl + pref, body, {
      headers: options.headers,
    });
  }

  async delete(pref: string): Promise<Observable<any>> {
    let options = { headers: new HttpHeaders() };

    const token = this.store.getToken() as string;
    if (token && token.length > 15) {
      options.headers = options.headers.append('Authorization', token);
    }

    return this.http.delete(this.apiUrl + pref, {
      headers: options.headers,
    });
  }

  async create(pref: string, data: any): Promise<Observable<any>> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    if (this.store.getToken()) {
      headers.append('Authorization', this.store.getToken() as string);  
      headers.append('authorization', this.store.getToken() as string);
    }
    const body = JSON.stringify(data);
    return await this.http.post(this.apiUrl + pref, body, { headers });
  }
}
