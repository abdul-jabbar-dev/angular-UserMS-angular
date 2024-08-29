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
  coupon?: { code: string; discount_type: string; discount_amount: number };

  totalAmount: number = 0;

  constructor(public shipping: ShippingService) {}

  ngOnInit(): void {
    this.shipping.product$.subscribe((data) => {
      this.product = data;
      this.calculateTotal(); 
    });

    this.shipping.shippingOrder$.subscribe((data) => {
      this.shippingCost = data.shippingSpot;
      this.coupon = data.coupon;
      this.calculateTotal(); 
    });
  }

  calculateTotal(): void {
    if (this.product?.price) {
      let result = (this.product.price || 0) + Number(this.shippingCost.cost);
      if (this.coupon) {
        if (this.coupon.discount_type.toUpperCase() === 'FIXED') {
          this.totalAmount = result - Number(this.coupon.discount_amount);
        } else {
          this.totalAmount =
            result - result * (Number(this.coupon.discount_amount) / 100);
        }
      } else {
        this.totalAmount = result;
      }
    } else {
      this.totalAmount = 0;
    }
  }
}
