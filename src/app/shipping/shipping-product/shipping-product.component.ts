import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-shipping-product',
  templateUrl: './shipping-product.component.html',
  styleUrls: ['./shipping-product.component.css'],
})
export class ShippingProductComponent {
  @Input() product: {
    price: number;
    id: string;
    user_id: string;
    title: string;
    desc: null | string;
    image: string;
    created_at: Date;
  } | null = null;
}
