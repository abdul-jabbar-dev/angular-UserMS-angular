import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, from, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root',
})
export class ReverseGeocodingService {
  private apiKey = '3a161dc4c7234cf682c3689706e153e8';
  private apiUrl = 'https://api.opencagedata.com/geocode/v1/json';
  private deviceIdKey = 'deviceId';

  constructor(private http: HttpClient) {}

  // Returns a promise that resolves with the current geolocation
  private getCurrentPosition(): Promise<GeolocationPosition> {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          timeout: 10000,
        });
      } else {
        reject(new Error('Geolocation is not supported by this browser.'));
      }
    });
  }

  private getAddressFromCoordinates(lat: number, lng: number): Observable<any> {
    const url = `${this.apiUrl}?q=${lat}+${lng}&key=${this.apiKey}`;
    return this.http.get(url).pipe(
      map((response: any) => {
        if (response['results'] && response['results'].length > 0) {
          return response['results'][0].formatted;
        } else {
          return 'Address not found';
        }
      }),
      catchError((error) => {
        console.error('Reverse Geocoding Error:', error);
        return throwError('Failed to get address');
      })
    );
  }

  async getAddress(): Promise<string> {
    try {
      const pos = await this.getCurrentPosition();
      const { latitude, longitude } = pos.coords;
      return await this.getAddressFromCoordinates(
        latitude,
        longitude
      ).toPromise();
    } catch (error) {
      console.error('Geolocation Error:', error);
      return await Promise.reject('Failed to get location');
    }
  }
  getDeviceId(): string {
    let deviceId: string | null = localStorage.getItem(this.deviceIdKey);
    if (!deviceId) {
      deviceId = uuidv4();
     // localStorage.setItem(this.deviceIdKey, deviceId);
    }
    return deviceId!;
  }
}
