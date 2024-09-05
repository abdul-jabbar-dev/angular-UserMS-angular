import { Component, OnInit } from '@angular/core';
import { RequestService } from '../services/request.service';
import { firstValueFrom } from 'rxjs';

export interface TUserResponse {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  age: number;
  phone: string;
  status: 'active' | 'deactive';
  role: 'admin' | 'subscriber' | 'rider';
  created_at: Date;
  updated_at: Date;
}

@Component({
  selector: 'app-admin-orders',
  templateUrl: './admin-orders.component.html',
  styleUrls: ['./admin-orders.component.css'],
})
export class AdminOrdersComponent implements OnInit {
  selected_rider: string | null = null;
  allOrders: any;
  isLoading: boolean = false;
  riders: any;

  constructor(public request: RequestService) {}

  async submitRider(_t21: any) {
    this.isLoading = true;
    if (!_t21.selected_rider) {
      return;
    }
    try {
      const resu = await firstValueFrom(
        await this.request.create('/shipping/add_rider', _t21)
      );
      console.log(resu);
      if (resu) {
        this.allOrders.data = this.allOrders?.data?.map((pre: any) => {
          if (pre.order_id === resu.order_id) {
            return {
              ...pre,
              delivery_boy_name: resu.delivery_boy_name,
              delivery_status: resu.delivery_status,
            };
          } else return pre;
        });
        console.log(this.allOrders);
      }
    } catch (error) {
      console.log(error);
    } finally {
      this.isLoading = false;
    }
  }
  reset(order: any) {
    this.selected_rider = null;
    order.selected_rider = null;
  }
  addRider(order: any, event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    if (selectElement.value === 'Select Rider') {
      (event as any).target.value = undefined;
      order.selected_rider = undefined;
    } else {
      order.selected_rider = Number(selectElement.value);
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
  async setRiders() {
    try {
      const resu: TUserResponse[] = await firstValueFrom(
        await this.request.get('/user/get_rider')
      );
      this.riders = resu.map((it) => ({ id: it.id, userName: it.username }));
    } catch (error) {
      console.log(error);
    }
  }
  async ngOnInit() {
    this.isLoading = true;

    try {
      this.setRiders();
      const resu = await firstValueFrom(
        await this.request.get('/shipping/all')
      );
      console.log(resu.data);
      if (resu) {
        this.allOrders = resu;
      }
    } catch (error) {
      console.log(error);
    } finally {
      this.isLoading = false;
    }
  }
}
