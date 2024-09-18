import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { SupabaseService } from 'src/app/services/supabase.service';
import { OAuthResponse } from '@supabase/supabase-js';
import { StoreService } from './store.service';
import { Router } from '@angular/router';
import { RequestService } from './request.service';
import { firstValueFrom } from 'rxjs/internal/firstValueFrom';
interface DeviceInfo {
  address: string | null;
  deviceId: string;
  userAgent: string;
  platform: string;
}
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isAuthenticatedSubject: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(this.hasToken());
  public isAuthenticated$: Observable<boolean> =
    this.isAuthenticatedSubject.asObservable();

  private userSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public user$: Observable<any> = this.userSubject.asObservable();

  constructor(
    public supabase: SupabaseService,
    public store: StoreService,
    public route: Router,
    public request: RequestService
  ) {
    this.isLogin();
  }

  private hasToken(): boolean {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        jwtDecode(token);
        return true;
      } catch (error) {
        return false;
      }
    } else {
      return false;
    }
  }

  async loginWithGoogle(): Promise<OAuthResponse | null> {
    let result: OAuthResponse | null = null;
    try {
      result = await this.supabase.supabase.auth.signInWithOAuth({
        provider: 'google',
      });

      if (result) {
        await this.handleAuthSuccess();
      }
    } catch (err) {
      console.log(err);
    }
    return result;
  }

  async signUpNewUser(data: any) {
    try {
      const result = await firstValueFrom(
        await this.request.create('/user/register', data)
      );

      if (result.token) {
        this.store.addTokenFromStore(result.token);
        await this.handleAuthSuccess();
      } else {
        return result;
      }
    } catch (error) {
      console.log(error);
    }
  }

  async signInWithEmail(data: any, devInfor: DeviceInfo | null) {
    try {
      let meta = {};
      const exist = localStorage.getItem('session_device');
      if (exist) {
        meta = {
          exist: true,
          storeDevId: exist,
        };
      } else {
        meta = {
          exist: false,
          deviceInfo: devInfor,
        };
      }

      const result = await firstValueFrom(
        await this.request.create('/user/login', {
          email: data?.email,
          password: data?.password,
          meta,
        })
      );
      if (result.token) {
        localStorage.setItem('session_device', devInfor?.deviceId!);
        this.store.addTokenFromStore(result.token);
        await this.handleAuthSuccess();
      }
      return result;
    } catch (error) {
      console.log(error);
      throw new Error((error as any).error.message);
    }
  }

  private async handleAuthSuccess() {
    const profile = await this.getProfile();
    this.userSubject.next(profile);
    this.isAuthenticatedSubject.next(true);
    this.route.navigate(['/']);
  }

  async getProfile() {
    try {
      const result = await firstValueFrom(
        await this.request.get('/user/get_my_profile')
      );
      return result;
    } catch (error) {
      return null;
    }
  }
  async getProfileObs() {
    try {
      const result = await firstValueFrom(
        await this.request.get('/user/get_my_profile')
      );
      return result;
    } catch (error) {
      console.log('Failed to get profile:', error);
      return null;
    }
  }

  async isLogin(): Promise<any> {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const profile = await this.getProfile();
        this.userSubject.next(profile);
        return profile;
      } catch (error) {
        this.isAuthenticatedSubject.next(false);
        return false;
      }
    } else {
      this.isAuthenticatedSubject.next(false);
      return false;
    }
  }

  async signOut() {
    const data = await this.supabase.supabase.auth.signOut();
    this.store.removeTokenFromStore();
    this.userSubject.next(null);
    this.isAuthenticatedSubject.next(false);
    return data;
  }
}
