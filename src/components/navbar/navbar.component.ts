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
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit, OnDestroy {
  @Input() searchValue: string = '';
  searchedResult: {
    id: number;
    name: string;
    nationality: string;
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
    private elementRef: ElementRef,
    private routerLinkService: RouterLinkService,
    public auth: AuthService,
    public router: Router
  ) {}

  async handleSearchValueChange(newValue: string) {
    this.selectedIndex = -1;
    if (newValue.length < 1) {
      this.isDropdownOpen = false;
      return;
    }

    try {
      const data = [
        {
          id: 1,
          name: 'Amit Roy',
          nationality: 'India',
        },
        {
          id: 2,
          name: 'Sarah Khan',
          nationality: 'Pakistan',
        },
        {
          id: 3,
          name: 'Liam Smith',
          nationality: 'Canada',
        },
        {
          id: 4,
          name: 'Emily Johnson',
          nationality: 'America',
        },
        {
          id: 5,
          name: 'Arif Rahman',
          nationality: 'Bangladesh',
        },
        {
          id: 6,
          name: 'Priya Patel',
          nationality: 'India',
        },
        {
          id: 7,
          name: 'Mohammad Ali',
          nationality: 'Pakistan',
        },
        {
          id: 8,
          name: 'Olivia Brown',
          nationality: 'Canada',
        },
        {
          id: 9,
          name: 'James Miller',
          nationality: 'America',
        },
        {
          id: 10,
          name: 'Nusrat Jahan',
          nationality: 'Bangladesh',
        },
        {
          id: 11,
          name: 'Ravi Sharma',
          nationality: 'India',
        },
        {
          id: 12,
          name: 'Sadia Malik',
          nationality: 'Pakistan',
        },
        {
          id: 13,
          name: 'Noah Wilson',
          nationality: 'Canada',
        },
        {
          id: 14,
          name: 'Sophia Davis',
          nationality: 'America',
        },
        {
          id: 15,
          name: 'Farhan Ahmed',
          nationality: 'Bangladesh',
        },
        {
          id: 16,
          name: 'Neha Kapoor',
          nationality: 'India',
        },
        {
          id: 17,
          name: 'Hassan Raza',
          nationality: 'Pakistan',
        },
        {
          id: 18,
          name: 'Charlotte Taylor',
          nationality: 'Canada',
        },
        {
          id: 19,
          name: 'Benjamin Harris',
          nationality: 'America',
        },
        {
          id: 20,
          name: 'Shakib Al Hasan',
          nationality: 'Bangladesh',
        },
        {
          id: 21,
          name: 'Anjali Mehta',
          nationality: 'India',
        },
        {
          id: 22,
          name: 'Zainab Qureshi',
          nationality: 'Pakistan',
        },
        {
          id: 23,
          name: 'Jackson Moore',
          nationality: 'Canada',
        },
        {
          id: 24,
          name: 'Mia Martin',
          nationality: 'America',
        },
        {
          id: 25,
          name: 'Rashed Khan',
          nationality: 'Bangladesh',
        },
        {
          id: 26,
          name: 'Vikram Singh',
          nationality: 'India',
        },
        {
          id: 27,
          name: 'Fatima Siddiqui',
          nationality: 'Pakistan',
        },
        {
          id: 28,
          name: 'Ella Anderson',
          nationality: 'Canada',
        },
        {
          id: 29,
          name: 'Henry Thomas',
          nationality: 'America',
        },
        {
          id: 30,
          name: 'Tahmina Begum',
          nationality: 'Bangladesh',
        },
      ];

      const searchData = data.filter((item) =>
        item.name.toUpperCase().startsWith(newValue.toUpperCase())
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
      this.router.navigateByUrl('/product/' + selectedItem.id);
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
