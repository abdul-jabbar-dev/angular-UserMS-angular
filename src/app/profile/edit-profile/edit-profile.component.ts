import { Component, OnInit } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { RequestService } from 'src/app/services/request.service';
import {
  MatSnackBar
} from '@angular/material/snack-bar';
interface TUser {
  new_password?: string;
  role?: 'admin' | 'subscriber' | 'rider';
  first_name: string;
  email: string;
  username?: string;
  last_name: string;
  age: number;
  phone: string;
}

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css'],
})
export class EditProfileComponent implements OnInit {
  isUpdating = false;
  toggoleShow() {
    this.isVisible = !this.isVisible;
  }
  profile: TUser = {
    new_password: '',
    role: 'subscriber',
    first_name: '',
    email: '',
    username: '',
    last_name: '',
    age: 0,
    phone: '',
  };
  isVisible = false;

  constructor(public request: RequestService, private _snackBar: MatSnackBar) {}

  async ngOnInit(): Promise<void> {
    try {
      await this.getProfile();
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  }

  async getProfile() {
    try {
      this.profile = await firstValueFrom(
        await this.request.get('/user/get_my_profile')
      );
    } catch (error) {
      console.log(error);
    }
  }

  async saveProfile() {
    this.isUpdating = true;
    try {
      console.log(this.profile);
      const response = await firstValueFrom(
        await this.request.put('/user/update_profile', this.profile)
      );
      if (response) {
        this._snackBar.open('Profile successfully updated', 'Close', {
          duration: 3000,
          horizontalPosition: 'end',
          verticalPosition: 'bottom',
          panelClass: ['custom-snackbar'],
        });
        this.isUpdating = false;
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
    this.isUpdating = false;
  }
}
