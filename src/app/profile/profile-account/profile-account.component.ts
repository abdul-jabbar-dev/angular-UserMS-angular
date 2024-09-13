import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { firstValueFrom } from 'rxjs';
import { RequestService } from 'src/app/services/request.service';
import { DialogStaticComponent } from 'src/components/common/dialog-static/dialog-static.component';
@Component({
  selector: 'app-profile-account',
  templateUrl: './profile-account.component.html',
  styleUrls: ['./profile-account.component.css'],
})
export class ProfileAccountComponent {
  constructor(
    public dialog: MatDialog,
    public request: RequestService,
    public _snackBar: MatSnackBar
  ) {}
  isDeleting = false;
  isError = '';
  async openDialog() {
    const dialogRef = this.dialog.open(DialogStaticComponent, {
      maxWidth: '500px',
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      try {
        if (result) {
          this.isDeleting = true;
          const res = await firstValueFrom(
            await this.request.delete('/user/delete')
          );
          if (res) {
            this._snackBar.open('Account Delete Successfully', '', {
              duration: 5000,
              horizontalPosition: 'end',
              verticalPosition: 'bottom',
              panelClass: ['custom-snackbar-green'],
            });
            setTimeout(() => {
              window.location.reload();
            }, 3000);
          }
        }
        this.isDeleting;
      } catch (error: any) {
        if (error.error.message) {
          this._snackBar.open(error.error.message, '', {
            duration: 5000,
            horizontalPosition: 'end',
            verticalPosition: 'bottom',
            panelClass: ['custom-snackbar-red'],
          });
        } else {
          console.log(error);
          this._snackBar.open('Failed to delete account try next time', '', {
            duration: 5000,
            horizontalPosition: 'end',
            verticalPosition: 'bottom',
            panelClass: ['custom-snackbar-red'],
          });
        }
      }
    });
  }
}
