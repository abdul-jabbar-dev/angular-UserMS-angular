import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { StoreService } from './services/store.service';
@Injectable({
  providedIn: 'root',
})
export class StatusGuard implements CanActivate {
  orderInfo: { address: any; bill: any; product: any; user: any } | null = null;
  constructor(private store: StoreService, private router: Router) {
    store.getDataFromStore('order');
  }

  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<any> {
    if (
      this.orderInfo?.address &&
      this.orderInfo.bill &&
      this.orderInfo &&
      this.orderInfo.user
    ) {
      return true;
    } else {
      this.router.navigate(['/']);
    }
  }
}
