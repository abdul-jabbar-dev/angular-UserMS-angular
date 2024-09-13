import { firstValueFrom } from 'rxjs/internal/firstValueFrom';
import { Component, OnInit } from '@angular/core';
import { RequestService } from 'src/app/services/request.service';
import { formatDistanceToNow } from 'date-fns';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DialogStaticComponent } from 'src/components/common/dialog-static/dialog-static.component';
import { MatDialog } from '@angular/material/dialog';

interface TUserResponse {
  id: number;
  username: string;
  password?: string;
  first_name: string;
  last_name: string;
  email: string;
  age: number;
  phone: string;
  status: 'active' | 'deactive';
  role: 'admin' | 'subscriber' | 'rider';
  created_at: Date;
  updated_at: Date;
}
@Component({
  selector: 'app-admin-user',
  templateUrl: './admin-user.component.html',
  styleUrls: ['./admin-user.component.css'],
})
export class AdminUserComponent implements OnInit {
  isDeleting: boolean = false;
  constructor(
    public request: RequestService,
    public _snackBar: MatSnackBar,
    public dialog: MatDialog
  ) {}

  pagination: { pageSize: number; page: number } = { page: 1, pageSize: 5 };
  currentPage: number = 1;
  users: {
    data: TUserResponse[];
    total: number;
    page: number;
    pageSize: number;
    totalPage?: number[];
    maxPage?: number;
  } | null = null;

  async ngOnInit() {
    await this.loadUsers(this.currentPage);
  }

  goToPage(pageN: number) {
    this.currentPage = pageN;
    this.loadUsers(pageN);
  }

  async loadUsers(page: number) {
    this.pagination.page = page;
    const queryParams = {
      page: this.pagination.page,
      pageSize: this.pagination.pageSize,
      role: 'admin',
    };
    try {
      (await this.request.get('/user/get_users', queryParams)).subscribe(
        (data: {
          data: TUserResponse[];
          total: any;
          page: number;
          pageSize: number;
        }) => {
          this.users = data;
          this.users.maxPage = Math.ceil(
            Number(data.total?.count) / data.pageSize
          );
          this.users.totalPage = Array.from(
            { length: Math.ceil(Number(data.total?.count) / data.pageSize) },
            (_, i) => i + 1
          );
        },
        (error) => {
          console.error('Error fetching users:', error);
        }
      );
    } catch (error) {
      console.error('Error in loadUsers:', error);
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadUsers(this.currentPage);
    }
  }

  nextPage() {
    if (this.currentPage < (this.users?.maxPage || 1)) {
      this.currentPage++;
      this.loadUsers(this.currentPage);
    }
  }

  getDay(dateString: any) {
    const result = formatDistanceToNow(new Date(dateString), {
      addSuffix: true,
      includeSeconds: true,
    });
    return result;
  }
  async toggleRole(id: string | number) {
    try {
      await firstValueFrom(
        await this.request.put('/user/role_update/' + id, {})
      );
      this._snackBar.open('Successfully role updated', '', {
        duration: 5000,
        horizontalPosition: 'end',
        verticalPosition: 'bottom',
        panelClass: ['custom-snackbar-green'],
      });
      await this.loadUsers(this.currentPage);
    } catch (error) {
      console.log(error);
    }
  }

  async toggleStatus(id: string | number, username: string, status: string) {
    try {
      const res = await firstValueFrom(
        await this.request.put('/user/status_update/' + id, {})
      );
      this._snackBar.open(
        username +
          ' successfully' +
          ' ' +
          (status === 'active' ? 'deactive' : 'active'),
        '',
        {
          duration: 5000,
          horizontalPosition: 'end',
          verticalPosition: 'bottom',
          panelClass: ['custom-snackbar-green'],
        }
      );
      await this.loadUsers(this.currentPage);
    } catch (error) {
      console.log(error);
    }
  }
  async deleteItem(id: string | number, username: string) {
    const dialogRef = this.dialog.open(DialogStaticComponent, {
      maxWidth: '500px',
      data: {
        title: 'Are you sure?',
        desc: 'Do you really want to delete ' + username,
      },
    });
    dialogRef.afterClosed().subscribe(async (result: any) => {
      try {
        if (result) {
          this.isDeleting = true;

          const res = await firstValueFrom(
            await this.request.delete('/user/delete/' + id)
          );
          await this.loadUsers(this.currentPage);

          if (res) {
            this._snackBar.open('Account Delete Successfully', '', {
              duration: 5000,
              horizontalPosition: 'end',
              verticalPosition: 'bottom',
              panelClass: ['custom-snackbar-green'],
            });
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
