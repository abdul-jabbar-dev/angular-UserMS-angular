 
import { Component, OnInit} from '@angular/core';
import { RequestService } from 'src/app/services/request.service';
 
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-my-products',
  templateUrl: './my-products.component.html',
  styleUrls: ['./my-products.component.css'],
})
export class MyProductsComponent implements OnInit {
  allMyProducts: Record<string,any>[] = [];
  constructor(public request: RequestService) {}
  noData = false;
  async ngOnInit() {
    try {
      const result = await firstValueFrom(
        await this.request.get('/product/my_products')
      );
      if (result.length > 0) {
        this.noData = false;
        this.allMyProducts = result;
      } else {
        this.noData = true;
      }
    } catch (error) {
      this.allMyProducts = [];
    }
  }

  handleProductUpdate(updatedProduct:any) {
    this.allMyProducts = this.allMyProducts.map((item:any) =>
      item.id === updatedProduct.id ? updatedProduct : item
    );
  }
}
