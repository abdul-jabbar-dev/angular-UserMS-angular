import { firstValueFrom } from 'rxjs';
import { Component } from '@angular/core';
import { RequestService } from 'src/app/services/request.service';
import { EditMyProductsComponent } from '../edit-my-products/edit-my-products.component';

@Component({
  selector: 'app-my-products',
  templateUrl: './my-products.component.html',
  styleUrls: ['./my-products.component.css'],
})
export class MyProductsComponent {
  allMyProducts:any|[] = [];
  constructor(public request: RequestService) {}
  async ngOnInit() {
    try {
      const result = await firstValueFrom(
        await this.request.get('/product/my_products')
      );
      this.allMyProducts = result; 
    } catch (error) {
      this.allMyProducts = [];
      console.log(error);
    }
  }
}
