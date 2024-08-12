import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { SupabaseService } from 'src/app/services/supabase.service';
import { OAuthResponse } from '@supabase/supabase-js';
import { StoreService } from './store.service';
import { Router } from '@angular/router';
import { RequestService } from './request.service';
import { firstValueFrom } from 'rxjs/internal/firstValueFrom';

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
    // Immediately check if the user is already logged in
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
        this.store.addToken(result.token);
        await this.handleAuthSuccess();
      } else {
        return result;
      }
    } catch (error) {
      console.error(error);
    }
  }

  async signInWithEmail(data: any) {
    try {
      const result = await firstValueFrom(
        await this.request.create('/user/login', {
          email: data?.email,
          password: data?.password,
        })
      );

      if (result.token) {
        this.store.addToken(result.token);
        await this.handleAuthSuccess();
      }
      return result;
    } catch (error) {
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
      console.error('Failed to get profile:', error);
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
    this.store.removeToken();
    this.userSubject.next(null);
    this.isAuthenticatedSubject.next(false);
    return data;
  }
}
