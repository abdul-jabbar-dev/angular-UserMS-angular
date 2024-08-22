import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, catchError, firstValueFrom, throwError } from 'rxjs';
import { RequestService } from './request.service';
import { FormGroup } from '@angular/forms';
import { AuthService } from './auth.service';
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

@Injectable({
  providedIn: 'root',
})
export class ShippingService {

  constructor(public request: RequestService, public auth: AuthService) {}
 
  shippingOrder: BehaviorSubject<TOrder> = new BehaviorSubject<TOrder>({
    shippingSpot: { cost: '', time: '', spot: '' },
    coupon: '',
  });
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
        this.shippingOrder.unsubscribe();
        this.shippingAddress.unsubscribe();
        this.product.unsubscribe();
        return result;
      } catch (error) {
        throw error;
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
}
