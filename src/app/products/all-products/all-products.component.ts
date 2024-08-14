import { firstValueFrom } from 'rxjs';
import { SupabaseService } from 'src/app/services/supabase.service';
import { Component, OnInit } from '@angular/core';
import { RequestService } from 'src/app/services/request.service';

@Component({
  selector: 'app-all-products',
  templateUrl: './all-products.component.html',
  styleUrls: ['./all-products.component.css'],
})
export class AllProductsComponent implements OnInit {
  constructor(
    public supabase: SupabaseService,
    public request: RequestService
  ) {}
  productList:
    | [
        {
          created_at: string;
          desc: string;
          id: number;
          image: string;
          price: number;
          title: string;
        }
      ]
    | null = null;
  async ngOnInit() {
    try {
      let token = { token: localStorage.getItem('token') as string };
      this.productList = await firstValueFrom(
        await this.request.get('/product/get_products', token)
      );
    } catch (error) {}
  }
  switchBookmark(event: MouseEvent) {
    event.stopPropagation();
  }
}
