import { SupabaseService } from 'src/app/services/supabase.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-all-products',
  templateUrl: './all-products.component.html',
  styleUrls: ['./all-products.component.css'],
})
export class AllProductsComponent implements OnInit {
  constructor(public supabase: SupabaseService) {}
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
  ngOnInit() { 
    try {
      this.supabase
        .getData('Products')
        .then((res) => (this.productList = res as any));
    } catch (error) {}
  }
  switchBookmark(event: MouseEvent) {
    event.stopPropagation();
  }
  cliccc() {
    console.log('click parent');
  }
}
