import { Component, OnDestroy } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { firstValueFrom } from 'rxjs';
import { RequestService } from 'src/app/services/request.service';

@Component({
  selector: 'app-profile-password',
  templateUrl: './profile-password.component.html',
  styleUrls: ['./profile-password.component.css'],
})
export class ProfilePasswordComponent implements OnDestroy {
  constructor(public request: RequestService, private _snackBar: MatSnackBar) {}
  ngOnDestroy(): void {
    this.isDisMatchPassword = false;
    this.newPassword = '';
    this.oldPassword = '';
  }
  newPassword: string = '';
  oldPassword: string = '';
  isDisMatchPassword: boolean = false;
  isUpdating: boolean = false;
  error: string | null = null;

  confirm_old_password(event: any) {
    if (this.newPassword === event.target.value) {
      this.isDisMatchPassword = false;
    } else {
      this.isDisMatchPassword = true;
    }
  }

  async saveProfile() { 
    if (this.isDisMatchPassword || !this.oldPassword || !this.newPassword) {
      return;
    }
    this.isUpdating = true;
    try {
      const updatePassword = await firstValueFrom(
        await this.request.put('/user/update_password', {
          oldPassword: this.oldPassword,
          newPassword: this.newPassword,
        })
      );
      if (updatePassword) {
        this.isUpdating = false;
        this._snackBar.open('Password Update Successfully', '', {
          duration: 3000,
          horizontalPosition: 'end',
          verticalPosition: 'bottom',
          panelClass: ['custom-snackbar-green'],
        });
      }
    } catch (error: any) {
      if (error.error.message === "Password didn't match") {
        this._snackBar.open(error.error.message, '', {
          duration: 3000,
          horizontalPosition: 'end',
          verticalPosition: 'bottom',
          panelClass: ['custom-snackbar-red'],
        });
      }
    } finally {
      this.isUpdating = false;
    }
  }
}
