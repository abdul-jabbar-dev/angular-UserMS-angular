import { Component, OnInit, Output } from '@angular/core';
import { RequestService } from 'src/app/services/request.service';

import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-my-products',
  templateUrl: './my-products.component.html',
  styleUrls: ['./my-products.component.css'],
})
export class MyProductsComponent implements OnInit {
  constructor(public request: RequestService) {}

  noData = false;
  allMyProducts: Record<string, any>[] = [];
  group: { available?: number; hide?: number; sold?: number } = {
    available: 0,
    hide: 0,
    sold: 0,
  };
  filterList: string[] = [];

  async onFilterChange(list: any) {
    this.filterList = list;
    await this.addProducts(list);
  }

  async addProducts(list: string[]) {
    try {
      const { data, group }: { data: Record<string, any>[]; group: any } =
        await firstValueFrom(
          await this.request.get(
            '/product/my_products?filter=' + JSON.stringify(list)
          )
        );
      if (group) {
        this.group = group;
      }
      if (data.length > 0) {
        this.noData = false;
        this.allMyProducts = data;
      } else {
        this.allMyProducts = data;
        this.noData = true;
      }
    } catch (error) {
      this.allMyProducts = [];
    }
  }

  async ngOnInit() {
    await this.addProducts([]);
  }

  async handleProductUpdate(updatedProduct: any) {
    this.allMyProducts = this.allMyProducts.map((item: any) =>
      item.id === updatedProduct.id ? updatedProduct : item
    );
    await this.addProducts(this.filterList);
  }
}
