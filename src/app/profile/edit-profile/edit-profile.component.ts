import { Component, OnInit } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { TUser } from 'server/src/types/User';
import { RequestService } from 'src/app/services/request.service';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css'],
})
export class EditProfileComponent implements OnInit {
  profile: TUser | null = null;
  constructor(public request: RequestService) {}

  async ngOnInit(): Promise<void> {
    try {
      await this.getProfile();
    } catch (error) {}
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
}
