import { ChangeDetectorRef, Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';

import { AuthService } from 'src/app/services/auth.service';
import { StoreService } from 'src/app/services/store.service';
interface TUser {
  password?: string;
  role?: 'admin' | 'subscriber' | 'rider';
  first_name: string;
  email: string;
  username?: string;
  last_name: string;
  age: number;
  phone: string;
  id: number;
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
    forRider?: boolean;
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
    private cdr: ChangeDetectorRef,
    protected store: StoreService
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
        title: 'My Orders',
        id: 'my_orders',
        link: '/my_orders',
        isActive: false,
        isAuthorization: true,
        icon: '/assets/icon/nav/Orders.svg',
      },
      // {
      //   title: 'Favourite',
      //   id: 'favourite',
      //   link: '/favourite',
      //   isActive: false,
      //   icon: '/assets/icon/nav/Love.svg',
      //   isAuthorization: true,
      // },
    ];
    this.userMenus = [
      {
        title: 'Edit Profile',
        id: 'profile',
        link: '/profile',
        isActive: false,
        icon: '/assets/icon/nav/User.svg',
        forAdmin: false,
      },
      {
        title: 'Rider Mode',
        id: 'rider_dash',
        link: '/dash',
        isActive: false,
        icon: '/assets/icon/nav/Rider.svg',
        forAdmin: false,
        forRider: true,
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
      {
        title: 'Promocode',
        id: 'promocode',
        isActive: false,
        icon: '/assets/icon/nav/Promocode.svg',
        link: '/promocode',
        forAdmin: true,
      },
      {
        title: 'All Orders',
        id: 'all_orders',
        isActive: false,
        icon: '/assets/icon/nav/AllOrders.svg',
        link: '/admin_orders',
        forAdmin: true,
      },
      {
        title: 'Products',
        id: 'products',
        isActive: false,
        icon: '/assets/icon/nav/ListProducts.svg',
        link: '/prduct_list',
        forAdmin: true,
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

  switchRider() {
    if (this?.user?.id) {
      this.store.setView(this.user.id);
      this.router.navigateByUrl('/dash');
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
      if (url.includes(link.link + '/')) {
        console.log(link.link + '/', url);
        link.isActive = true;
      } else {
        link.isActive = link.link === url;
      }
    });

    this.cdr.detectChanges();
  }

  shouldShowTab(tabs: any): boolean {
    const isRiderTab =
      !tabs.forAdmin && tabs.forRider && this.user?.role === 'rider';
    const isAdminTab = tabs.forAdmin && this.user?.role === 'admin';

    return (!tabs.forAdmin && !tabs.forRider) || isRiderTab || isAdminTab;
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
    try {
      await this.auth.signOut();
      this.isAuthenticate = false;
      this.updateMenuAuthorization();
      this.cdr.detectChanges();

      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Logout failed', error);
    }
  }
}
