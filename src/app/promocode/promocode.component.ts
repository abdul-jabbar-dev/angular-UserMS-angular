import { Component, OnInit } from '@angular/core';
import { RequestService } from '../services/request.service';
import { firstValueFrom } from 'rxjs';
import * as moment from 'moment';
interface TPromocodeResponce {
  is_expire: boolean;
  id: number;
  code: string;
  discount_amount: number;
  discount_type: 'percentage' | 'fixed';
  valid_from: Date;
  valid_to: Date;
  usage_limit: number;
  visible: 'private' | 'public';
  times_used: number;
  is_active: boolean;
  author_id: number;
  created_at: Date;
  updated_at: Date;
}

@Component({
  selector: 'app-promocode',
  templateUrl: './promocode.component.html',
  styleUrls: ['./promocode.component.css'],
})
export class PromocodeComponent implements OnInit {
  async toggolvisibility(id: number) {
    try {
      const res = await firstValueFrom(
        await this.request.put('/promo/visibility/' + id, {})
      );
      if (res) {
        await this.loadPromo(this.currentPage);
      }
    } catch (error) {}
  }
  async toggolStatus(id: number) {
    try {
      const res = await firstValueFrom(
        await this.request.put('/promo/status/' + id, {})
      );
      if (res) {
        await this.loadPromo(this.currentPage);
      }
    } catch (error) {}
  }
  createSuccess(event: any) {
    if (event) {
      this.loadPromo(this.currentPage);
    }
  }
  constructor(protected request: RequestService) {
    this.isloading = true;
  }
  pagination: { pageSize: number; page: number } = { page: 1, pageSize: 5 };
  currentPage: number = 1;
  isloading = false;
  allPromocode!: {
    data: TPromocodeResponce[];
    total: number;
    page: number;
    pageSize: number;
    totalPage?: number[];
    maxPage?: number;
  };

  async ngOnInit() {
    await this.loadPromo(this.currentPage);
  }

  async loadPromo(page: number) {
    this.pagination.page = page;
    const queryParams = {
      page: this.pagination.page,
      pageSize: this.pagination.pageSize,
    };
    try {
      (await this.request.get('/promo', queryParams)).subscribe((result) => {
        if (result) {
          this.allPromocode = result;
          this.allPromocode.totalPage = Array.from(
            {
              length: Math.ceil(Number(result?.total.count) / result?.pageSize),
            },
            (_, i) => i + 1
          );
        }
        this.isloading = false;
      });
    } catch (error) {
      this.isloading = false;
    }
  }

  goToPage(pageN: number) {
    this.currentPage = pageN;
    this.loadPromo(pageN);
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadPromo(this.currentPage);
    }
  }

  nextPage() {
    if (this.currentPage < (this.allPromocode?.maxPage || 1)) {
      this.currentPage++;
      this.loadPromo(this.currentPage);
    }
  }

  getDay(dateString: any) {
    const date = moment(dateString);
    return date.calendar();
  }
}
