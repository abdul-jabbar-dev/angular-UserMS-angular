import { Component, Input, Output } from '@angular/core';

@Component({
  selector: 'app-shipping-promo',
  templateUrl: './shipping-promo.component.html',
  styleUrls: ['./shipping-promo.component.css'],
})
export class ShippingPromoComponent {
  
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
