import { AuthService } from 'src/app/services/auth.service';
import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class RouteService {
  showSidebar = true;

  constructor(private router: Router, protected auth: AuthService) {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.checkRoute(event.urlAfterRedirects);
      });
  }
  async checkRoute(url: string) {
    if (url.includes('/verify/')) {
      this.showSidebar = false;
    } else if (url === '/login' || url === '/registration') {
      const res = await this.auth.getProfile();
      if (res.data.user?.id) {
        this.router.navigate(['/']);
      }
      this.showSidebar = false;
    } else {
      this.showSidebar = true;
    }
  }
}
