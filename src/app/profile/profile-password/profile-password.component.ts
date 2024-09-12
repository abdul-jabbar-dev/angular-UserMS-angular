import { Component, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-profile-password',
  templateUrl: './profile-password.component.html',
  styleUrls: ['./profile-password.component.css'],
})
export class ProfilePasswordComponent implements OnDestroy {
  ngOnDestroy(): void {
    this.isDisMatchPassword = false;
    this.new_password = '';
    this.old_password = '';
  }
  new_password: string = '';
  old_password: string = '';
  isDisMatchPassword: boolean = false;

  confirm_old_password(event: any) {
    if (this.new_password === event.target.value) {
      this.isDisMatchPassword = false;
    } else if (this.new_password.startsWith(event.target.value)) {
      this.isDisMatchPassword = false;
    } else {
      this.isDisMatchPassword = true;
    }
  }

  saveProfile() {
    throw new Error('Method not implemented.');
  }
  isUpdating: any;
}
