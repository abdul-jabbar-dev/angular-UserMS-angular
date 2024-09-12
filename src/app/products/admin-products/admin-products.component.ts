import { firstValueFrom } from 'rxjs/internal/firstValueFrom';
import { Component, OnInit } from '@angular/core';
import { RequestService } from 'src/app/services/request.service';
 import { formatDistanceToNow } from 'date-fns';

interface TProduct {
  id: string | number;
  title: string;
  user_id: string | number;
  desc?: string;
  created_at: Date;
  status: 'available' | 'sold' | 'hide';
  price: number;
}

@Component({
  selector: 'app-admin-products',
  templateUrl: './admin-products.component.html',
  styleUrls: ['./admin-products.component.css'],
})
export class AdminProductsComponent implements OnInit {
  constructor(public request: RequestService) {}

  pagination: { pageSize: number; page: number } = { page: 1, pageSize: 5 };
  currentPage: number = 1;
  products: {
    data: TProduct[];
    total: number;
    page: number;
    pageSize: number;
    totalPage?: number[];
    maxPage?: number;
  } | null = null;

  async ngOnInit() {
    await this.loadProducts(this.currentPage);
  }

  goToPage(pageN: number) {
    this.currentPage = pageN;
    this.loadProducts(pageN);
  }

  async loadProducts(page: number) {
    this.pagination.page = page;
    const queryParams = {
      page: this.pagination.page,
      pageSize: this.pagination.pageSize,
      admin: true,
    };
    try {
      (
        await this.request.get('/product/get_all_products', queryParams)
      ).subscribe(
        (data: {
          data: TProduct[];
          total: any;
          page: number;
          pageSize: number;
        }) => {
          this.products = data;
          this.products.maxPage = Math.ceil(
            Number(data.total?.count) / data.pageSize
          );
          this.products.totalPage = Array.from(
            { length: Math.ceil(Number(data.total?.count) / data.pageSize) },
            (_, i) => i + 1
          );
        },
        (error) => {
          console.error('Error fetching Products:', error);
        }
      );
    } catch (error) {
      console.error('Error in load Products:', error);
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadProducts(this.currentPage);
    }
  }

  nextPage() {
    if (this.currentPage < (this.products?.maxPage || 1)) {
      this.currentPage++;
      this.loadProducts(this.currentPage);
    }
  }

  getDay(dateString: any) {
    const result = formatDistanceToNow(new Date(dateString), {
      addSuffix: true,
      includeSeconds: true,
    });
    return result;
  }

  async toggleStatus(id: string | number) {
    try {
      await firstValueFrom(
        await this.request.put('/product/status_update/' + id, {})
      );
      await this.loadProducts(this.currentPage);
    } catch (error) {
      console.log(error);
    }
  }
  async deleteItem(id: string | number) {
    try {
      await firstValueFrom(await this.request.delete('/product/delete/' + id));
      await this.loadProducts(this.currentPage);
    } catch (error) {
      console.log(error);
    }
  }
}
