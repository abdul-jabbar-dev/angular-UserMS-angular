import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, catchError, firstValueFrom, throwError } from 'rxjs';
import { RequestService } from './request.service';

import { AuthService } from './auth.service';
import { Router } from '@angular/router';
interface TProduct {
  price: number;
  id: string;
  user_id: string;
  title: string;
  desc: null | string;
  image: string;
  created_at: Date;
}
interface TAddress {
  phone: string;
  email: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  country: string;
  zip: string;
}
interface TOrder {
  shippingSpot: { cost: string | number; time: string; spot: string };
  coupon?: string;
}
interface ShippingType {
  id: number;
  user_id: number;
  product_id: number;
  order_number: string;
  shipping_email: string;
  shipping_phone: string;
  shipping_zone: string;
  shipping_cost: number;
  address_line1: string;
  address_line2?: string;
  city: string;
  stat: string;
  country: string;
  zip: string;
  created_at: Date;
  order_status: 'pending' | 'expired' | 'paid';
}
@Injectable({
  providedIn: 'root',
})
export class ShippingService {
  constructor(
    public request: RequestService,
    public auth: AuthService,
    public router: Router
  ) {}

  shippingOrder: BehaviorSubject<TOrder> = new BehaviorSubject<TOrder>({
    shippingSpot: { cost: '', time: '', spot: '' },
    coupon: '',
  });
  orderDetailsDB: BehaviorSubject<ShippingType | null> =
    new BehaviorSubject<ShippingType | null>(null);

  shippingAddress: BehaviorSubject<TAddress> = new BehaviorSubject<TAddress>({
    addressLine1: '',
    city: '',
    country: '',
    email: '',
    phone: '',
    state: '',
    zip: '',
    addressLine2: '',
  });
  product: BehaviorSubject<TProduct> = new BehaviorSubject<TProduct>({
    price: 0,
    id: '',
    user_id: '',
    title: '',
    desc: null,
    image: '',
    created_at: new Date(),
  });

  product$ = this.product.asObservable();
  orderDetailsDB$ = this.orderDetailsDB.asObservable();
  shippingOrder$ = this.shippingOrder.asObservable();
  shippingAddress$ = this.shippingAddress.asObservable();

  setProduct(product: TProduct) {
    this.product.next(product);
  }
  setAddress(add: TAddress) {
    this.shippingAddress.next(add);
  }
  addOrder(product: TOrder) {
    this.shippingOrder.next(product);
  }
  setShippingDetailsFroDB(product: ShippingType) {
    this.orderDetailsDB.next(product);
  }
  async orderPlaced() {
    let user = await this.auth.getProfile();
    let address;
    let shippingSummary: Record<string, any> = {};

    this.shippingOrder$.subscribe(
      (data) => (shippingSummary = data.shippingSpot)
    );
    this.shippingAddress.subscribe((e) => (address = e));
    if (!address) {
      alert('Shiping address not included');
    } else {
      try {
        const result = await firstValueFrom(
          await this.request.create('/shipping', {
            bill: shippingSummary,
            user: user,
            address: address,
            product: this.product.value,
          })
        );
        if (result) {
          this.getOrderFromDB(result);
        }

        return result;
      } catch (error) {
        throw error;
      }
    }
  }
  getOrderFromDB(orderInfoDB: ShippingType): any {
    this.setShippingDetailsFroDB(orderInfoDB);
    if (orderInfoDB['order_number']) {
      if (orderInfoDB['order_status'] === 'pending') {
        this.router.navigateByUrl('/payment');
        this.shippingOrder.unsubscribe();
        this.shippingAddress.unsubscribe();
        this.product.unsubscribe();
      } else {
        throw new Error('Product placed Successfully');
      }
    }
  }
  async getOrderInfo() {
    let shippingSummary;
    let address;
    let product;
    let user = await this.auth.getProfile();

    this.shippingOrder$.subscribe((data) => (shippingSummary = data));
    this.product$.subscribe((data) => (product = data));
    this.shippingAddress.subscribe((e) => (address = e));
    return {
      user: user,
      product,
      address,
      shippingSummary,
    };
  }
  async getExistingOrder(data?: TProduct): Promise<Record<string, any>> {
    try {
      let product = data;

      this.product$.subscribe((p) => {
        if (p.id) {
          product = p;
        } else {
          product = data;
        }
      });
      if (product && product['id']) {
        const result: ShippingType = await firstValueFrom(
          await this.request.get('/shipping/' + (product as any).id)
        );
        
        this.setShippingDetailsFroDB(result);
        
        console.log(result);
        return result;
      } else return {};
    } catch (error) {
      throw error;
    }
  }
}
