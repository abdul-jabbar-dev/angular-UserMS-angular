import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject, filter } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RouterLinkService {
  private currentPath = new BehaviorSubject<string>(this.router.url);

  constructor(private router: Router) {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: any) => {
 
        this.currentPath.next(event.urlAfterRedirects);
      });
  }

  getCurrentPath() { 
    return this.currentPath.asObservable() ; 
  }
}
