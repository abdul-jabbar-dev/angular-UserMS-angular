import { firstValueFrom } from 'rxjs/internal/firstValueFrom';
import { Component, OnInit } from '@angular/core'; 
import { RequestService } from 'src/app/services/request.service';
import { formatDistanceToNow } from 'date-fns';
 

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
  role: 'admin' | 'subscriber';
  created_at: Date;
  updated_at: Date;
}
@Component({
  selector: 'app-all-user',
  templateUrl: './all-user.component.html',
  styleUrls: ['./all-user.component.css'],
})
export class AllUserComponent implements OnInit {
  constructor(public request: RequestService) {}

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
    };
    try {
      console.log(queryParams);
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
      await this.loadUsers(this.currentPage);
    } catch (error) {
      console.log(error);
    }
  }

  async toggleStatus(id: string | number) {
    try {
      await firstValueFrom(
        await this.request.put('/user/status_update/' + id, {})
      );
      await this.loadUsers(this.currentPage);
    } catch (error) {
      console.log(error);
    }
  }
  async deleteItem(id: string | number) {
    try {
      await firstValueFrom(await this.request.delete('/user/delete/' + id));
      await this.loadUsers(this.currentPage);
    } catch (error) {
      console.log(error);
    }
  }
} 

