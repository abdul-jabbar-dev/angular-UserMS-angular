import {
  Component,
  OnInit,
  OnDestroy,
  Input,
  HostListener,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { RouterLinkService } from 'src/app/services/router-link.service';
import { Subscription, firstValueFrom } from 'rxjs';
import { Router } from '@angular/router';
import { RequestService } from 'src/app/services/request.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit, OnDestroy {
  @Input() searchValue: string = '';
  searchedResult: {
    id: number;
    title: string
  }[] = [];
  isSearchBarShow: boolean = false;
  isLoginRoute = false;
  currentPath: string = '';
  isLogin: boolean = false;
  role: 'subscriber' | 'admin' | null = null;
  @ViewChild('searchContainer ') searchContainer: ElementRef | null = null;
  selectedIndex: number = -1;
  isDropdownOpen: boolean = false;

  private subscriptions: Subscription[] = [];

  constructor(
    private routerLinkService: RouterLinkService,
    public auth: AuthService,
    public request: RequestService,
    public router: Router
  ) {}

  async handleSearchValueChange(newValue: string) {
    this.selectedIndex = -1;
    if (newValue.length < 1) {
      this.isDropdownOpen = false;
      return;
    }

    try {
      let searchData = await firstValueFrom(
        await this.request.get(
          `/product/get_products?searchQuery=title:${newValue}`,{token:localStorage.getItem('token')}
        )
      );
      this.searchedResult = searchData;
      this.isDropdownOpen = searchData.length > 0;
    } catch (error) {
      console.error(error);
    }
  }

  @HostListener('document:keydown.arrowDown', ['$event'])
  onArrowDown(event: KeyboardEvent) {
    if (
      this.isDropdownOpen &&
      this.selectedIndex < this.searchedResult.length - 1
    ) {
      this.selectedIndex++;
    }
  }

  @HostListener('document:keydown.arrowUp', ['$event'])
  onArrowUp(event: KeyboardEvent) {
    if (this.isDropdownOpen && this.selectedIndex > 0) {
      this.selectedIndex--;
    }
  }

  @HostListener('document:keydown.enter', ['$event'])
  onEnter(event: any) {
    if (
      this.isDropdownOpen &&
      this.selectedIndex >= 0 &&
      this.selectedIndex < this.searchedResult.length
    ) {
      const selectedItem = this.searchedResult[this.selectedIndex];
      this.router.navigateByUrl('/product/' + selectedItem.id,);
    }
  }

  @HostListener('document:click', ['$event'])
  onClick(event: any) {
    if (!this.searchContainer?.nativeElement.contains(event.target)) {
      this.searchValue = '';
    }
  }

  async ngOnInit() {
    this.subscriptions.push(
      this.auth.isAuthenticated$.subscribe((isAuthenticated: boolean) => {
        this.isLogin = isAuthenticated;
      })
    );

    this.isLogin = await this.auth.isLogin();

    this.subscriptions.push(
      this.routerLinkService.getCurrentPath().subscribe((path: string) => {
        this.searchValue = '';
        this.currentPath = path;
        this.showSearchBar(path);
        this.checkRoute(path);
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
    this.isSearchBarShow = false;
    this.searchValue = '';
    this.handleSearchValueChange('');
  }

  private checkRoute(url: string) {
    this.isLoginRoute = url === '/login' || url === '/registration';
  }

  showSearchBar(path: string) {
    const showingRoute = ['/'];
    this.isSearchBarShow = showingRoute.includes(path);
  }
}
