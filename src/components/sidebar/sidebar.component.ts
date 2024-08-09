import { ChangeDetectorRef, Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
 
import { AuthService } from 'src/app/services/auth.service';
interface TUser {
  password?: string;
  role?: 'admin' | 'subscriber';
  first_name: string;
  email: string;
  username?: string;
  last_name: string;
  age: number;
  phone: string;
}
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent implements OnInit, OnDestroy {
  isAuthenticate: boolean = false;
  user: TUser | null = null;
  private authSubscription: Subscription = new Subscription();

  menus: {
    title: string;
    id: string;
    link: string;
    isActive: boolean;
    icon: string;
    isAuthorization: boolean;
  }[];
  userMenus: {
    title: string;
    id: string;
    link?: string;
    isActive: boolean;
    icon: string;
    forAdmin: boolean;
    chield?: {
      title: string;
      id: string;
      link?: string;
      isActive: boolean;
      icon: string;
      forAdmin: boolean;
    }[];
  }[];
  constructor(
    public router: Router,
    protected auth: AuthService,
    private cdr: ChangeDetectorRef
  ) {
    this.menus = [
      {
        title: 'Home',
        id: 'home',
        link: '/',
        isActive: false,
        isAuthorization: false,
        icon: '/assets/icon/nav/Home.svg',
      },
      {
        title: 'Add Product',
        id: 'add_product',
        link: '/create_products',
        isActive: false,
        icon: '/assets/icon/nav/Add.svg',
        isAuthorization: true,
      },
      {
        title: 'My Product',
        id: 'my_product',
        link: '/my_products',
        isActive: false,
        isAuthorization: true,
        icon: '/assets/icon/nav/All.svg',
      },
      {
        title: 'Bookmarks',
        id: 'bookmarks',
        link: '/bookmarks',
        isActive: false,
        icon: '/assets/icon/nav/Love.svg',
        isAuthorization: true,
      },
    ];
    this.userMenus = [
      {
        title: 'Edit Profile',
        id: 'edit_profile',
        link: '/edit_profile',
        isActive: false,
        icon: '/assets/icon/nav/User.svg',
        forAdmin: false,
      },
      {
        title: 'User Management',
        id: 'usermanagment',
        isActive: false,
        icon: '/assets/icon/nav/Admin.svg',
        forAdmin: true,
        chield: [
          {
            title: 'User Management',
            id: 'usermanagment',
            link: '/users/all_users',
            isActive: false,
            icon: '/assets/icon/nav/Allusers.svg',
            forAdmin: false,
          },
          {
            title: 'Admin Managment',
            id: 'adminmanagment',
            link: '/users/admin_users',
            isActive: false,
            icon: '/assets/icon/nav/Allusers.svg',
            forAdmin: false,
          },
        ],
      },
    ];
  }

  ngOnInit(): void {
    this.router.events.subscribe((e) => {
      if (e instanceof NavigationEnd) {
        this.updateUrl(e.url);
      }
    });

    this.authSubscription = this.auth.isAuthenticated$.subscribe(
      (isAuthenticated: boolean) => {
        this.isAuthenticate = isAuthenticated;
        this.updateMenuAuthorization();
      }
    );

    this.authSubscription.add(
      this.auth.user$.subscribe((user) => {
        this.user = user;
        this.updateMenuAuthorization();
      })
    );

    this.checkLogin();
  }
  ngOnDestroy() {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  async checkLogin() {
    let result = await this.auth.isLogin();
    this.isAuthenticate = !!result;
    this.user = result;
    this.updateMenuAuthorization();
    this.cdr.detectChanges();
  }

  updateUrl(url: string) {
    this.userMenus.forEach((link) => {
      if (link?.chield && link?.chield?.length > 0) {
        link?.chield.forEach((c) => {
          c.isActive = c.link === url;
        });
      }
      link.isActive = link.link === url;
    });
    this.menus.forEach((link) => {
      link.isActive = link.link === url;
    });

    this.cdr.detectChanges();
  }

  updateMenuAuthorization() {
    this.menus.forEach((menu) => {
      if (menu.isAuthorization) {
        menu.isActive = this.isAuthenticate && menu.isActive;
      }
    });
    this.cdr.detectChanges();
  }

  async logout() {
    await this.auth.signOut();
    this.isAuthenticate = false;
    this.updateMenuAuthorization();
    this.cdr.detectChanges();
  }
}
