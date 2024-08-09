import { Subscription } from 'rxjs';
import { RouterLinkService } from './../../app/services/router-link.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit, OnDestroy {
  isLoginRoute = false;
  currentPath: string = '';
  isLogin: boolean = false;
  role: 'subscriber' | 'admin' | null = null;

  private subscription: Subscription = new Subscription();
  private authSubscription: Subscription = new Subscription();

  constructor(
    private routerLinkService: RouterLinkService,
    public auth: AuthService
  ) {}

  async ngOnInit() {
    this.authSubscription = this.auth.isAuthenticated$.subscribe(
      (isAuthenticated: boolean) => {
        this.isLogin = isAuthenticated;
      }
    );

    this.isLogin = await this.auth.isLogin();
    this.subscription = this.routerLinkService
      .getCurrentPath()
      .subscribe((path: string) => {
        this.currentPath = path;
        this.checkRoute(path);
      });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  private checkRoute(url: string) {
    this.isLoginRoute = url === '/login' || url === '/registration';
  }
}
