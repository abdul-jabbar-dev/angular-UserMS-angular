import { Injectable } from '@angular/core';
import {
  CanActivate,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './services/auth.service';
import { StoreService } from './services/store.service';

@Injectable({
  providedIn: 'root',
})
export class GlobalGuard implements CanActivate {
  protected user: any;

  constructor(
    private auth: AuthService,
    private router: Router,
    protected store: StoreService
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    if (! this.store.isView(this.user.id)) {
      return true;
    }
    return this.auth
      .getProfile()
      .then((res) => {
        this.user = res;

        if (this.user.role === 'rider' && this.store.isView(this.user.id)) {
          this.router.navigateByUrl('/dash');
          return false;
        }

        return true;
      })
      .catch(() => {
        return true;
      });
  }
}
