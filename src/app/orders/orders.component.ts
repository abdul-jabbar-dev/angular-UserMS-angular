import { Component, OnInit } from '@angular/core';
import { RequestService } from '../services/request.service';
import { firstValueFrom } from 'rxjs';
import { formatDistanceToNow } from 'date-fns';
@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css'],
})
export class OrdersComponent implements OnInit {
   constructor(public request: RequestService) {}
  allOrders: any;
  currentPage: any;
  isLoading = false;

  async ngOnInit() {
    this.isLoading = true;

    try {
      const resu = await firstValueFrom(await this.request.get('/shipping'));
  
      if (resu) {
        this.allOrders = resu;
      }
    } catch (error) {
      console.log(error);
    } finally {
      this.isLoading = false;
    }
  }

  calculateTax(price: number): number {
    const taxRate = 0.02;
    return price * taxRate;
  }
  calculateTotal(
    price: number,
    tax: number,
    shippingCost: number,
    coupon: { discount_type: string; discount_amount: number }
  ): number {
    let total = Number(price) + Number(tax) + Number(shippingCost);

    if (coupon && coupon.discount_type && coupon.discount_amount) {
      if (coupon.discount_type === 'fixed') {
        total -= Number(coupon.discount_amount);
      } else if (coupon.discount_type === 'percentage') {
        total -= (total * Number(coupon.discount_amount)) / 100;
      }
    }

    return Math.ceil(total);
  }
  getDay(dateString: any) {
    const result = formatDistanceToNow(new Date(dateString), {
      addSuffix: true,
      includeSeconds: true,
    });
    return result;
  }
}
