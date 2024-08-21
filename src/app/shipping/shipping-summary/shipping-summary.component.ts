import { Component, OnInit } from '@angular/core';
import { ShippingService } from 'src/app/services/shipping.service';

@Component({
  selector: 'app-shipping-summary',
  templateUrl: './shipping-summary.component.html',
  styleUrls: ['./shipping-summary.component.css'],
})
export class ShippingSummaryComponent implements OnInit {
  product: {
    price: number;
    id: string;
    user_id: string;
    title: string;
    desc: null | string;
    image: string;
    created_at: Date;
  } | null = null;
  shippingCost: { cost: string | number; time: string; spot: string } = {
    cost: '',
    time: '',
    spot: '',
  };
  constructor(public shipping: ShippingService) {}
  ngOnInit(): void {
    this.shipping.product$.subscribe((data) => (this.product = data));
    this.shipping.shippingOrder$.subscribe(
      (data) => (this.shippingCost = data.shippingSpot)
    );
  }

  getTotal() {
    if (this.product?.price) { 
      let result = (this.product.price | 0) + Number(this.shippingCost.cost);
      return result;
    } else return 0;
  }
}
