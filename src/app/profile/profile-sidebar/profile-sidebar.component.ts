import { Component } from '@angular/core';
import { MatChipOption } from '@angular/material/chips';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile-sidebar',
  templateUrl: './profile-sidebar.component.html',
  styleUrls: ['./profile-sidebar.component.css'],
})
export class ProfileSidebarComponent {
  constructor(protected router: Router) {}
  navigateTo(url: string) {
    this.router.navigate([url]);
  }
 
  availableColors = [
    { name: 'Profile', src: '/profile', isActive: true },
    { name: 'Password', src: '/profile/password', isActive: false },
    { name: 'Account', src: '/profile/account', isActive: false },
  ];
}
