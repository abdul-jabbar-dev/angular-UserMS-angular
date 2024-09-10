import { Component, OnInit } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { RequestService } from 'src/app/services/request.service';

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
  toggoleShow() {
    this.isVisible = !this.isVisible;
  }
  profile: TUser | null = null;
  isVisible = false;

  constructor(public request: RequestService) {}

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
    try {
      console.log(this.profile);
      // Make a PUT request to save the profile
      const response = await firstValueFrom(
        await this.request.put('/user/update_profile', this.profile)
      );
      console.log('Profile updated successfully:', response);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  }
}
