import { firstValueFrom } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { TProduct } from 'server/src/types/Product';
import { RequestService } from 'src/app/services/request.service';

@Component({
  selector: 'app-my-products',
  templateUrl: './my-products.component.html',
})
export class MyProductsComponent implements OnInit {
  constructor(public request: RequestService) {}
  products: TProduct | null = null;
  async ngOnInit() {
    const productList = await firstValueFrom(
      await this.request.get('/product/my_products')
    );
    console.log(productList);
  }
}
