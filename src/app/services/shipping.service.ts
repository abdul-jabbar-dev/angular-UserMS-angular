import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject, combineLatest, firstValueFrom } from 'rxjs';
import { RequestService } from './request.service';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { StoreService } from './store.service';

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
  coupon?: { code: string; discount_type: string; discount_amount: number };
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
  product_price: number;
  stat: string;
  country: string;
  promocode_id?: number;
  zip: string;
  created_at: Date;
  order_status: 'pending' | 'expired' | 'paid';
}

@Injectable({
  providedIn: 'root',
})
export class ShippingService implements OnInit {
  private shippingOrder = new BehaviorSubject<TOrder>({
    shippingSpot: { cost: '', time: '', spot: '' },
    coupon: { code: '', discount_type: 'string', discount_amount: 0 },
  });

  private orderDetailsDB = new BehaviorSubject<ShippingType | null>(null);
  private shippingAddress = new BehaviorSubject<TAddress>({
    addressLine1: '',
    city: '',
    country: '',
    email: '',
    phone: '',
    state: '',
    zip: '',
    addressLine2: '',
  });

  private product = new BehaviorSubject<TProduct>({
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

  constructor(
    private request: RequestService,
    private auth: AuthService,
    private router: Router,
    private store: StoreService
  ) {}

  ngOnInit(): void {
    console.log(this.getOrderInfo());
  }

  setProduct(product: TProduct) {
    this.store.setDataFromStore('order', {
      property: 'product',
      value: product,
    });
    this.product.next(product);
  }

  setAddress(add: TAddress) {
    this.shippingAddress.next(add);
  }

  async addOrder(product: TOrder) {
    if (product.coupon) {
      const existingOrder = await this.getExistingOrder();
      if (existingOrder && (existingOrder as any).id) {
        const res = await firstValueFrom(
          await this.request.put(
            `/shipping/addpromo/${(existingOrder as any).id}`,
            {
              promocode_id: product.coupon.code,
            }
          )
        );
        if (res) {
          this.setShippingDetailsFroDB(res);
        }
      }
    }
    this.shippingOrder.next(product);
  }

  setShippingDetailsFroDB(orderDetails: ShippingType) {
    this.orderDetailsDB.next(orderDetails);
  }

  async orderPlaced() {
    const [user, address, shippingSummary] = await firstValueFrom(
      combineLatest([
        this.auth.getProfile(),
        this.shippingAddress$,
        this.shippingOrder$,
      ])
    );

    if (!address) {
      alert('Shipping address not included');
      return;
    }

    let orderInfo:any = {
      bill: shippingSummary.shippingSpot,
      user: user,
      address: address,
      product: this.product.value,
    };

    if (shippingSummary.coupon?.code) {
      orderInfo['promocode_id'] = shippingSummary.coupon.code;
    }

    try {
      const result = await firstValueFrom(
        await this.request.create('/shipping', orderInfo)
      );
      if (result) {
        this.getOrderFromDB(result);
      }
      return result;
    } catch (error) {
      console.error('Order placement failed', error);
      throw error;
    }
  }

  getOrderFromDB(orderInfoDB: ShippingType) {
    this.setShippingDetailsFroDB(orderInfoDB);
    if (orderInfoDB.order_number && orderInfoDB.order_status === 'pending') {
      this.router.navigateByUrl('/payment');
      this.clearSubjects();
    } else {
      throw new Error('Product placed successfully');
    }
  }

  async getOrderInfo() {
    const [shippingSummary, product, address] = await firstValueFrom(
      combineLatest([this.shippingOrder$, this.product$, this.shippingAddress$])
    );
    const user = await this.auth.getProfile();
    return {
      user,
      product,
      address,
      shippingSummary,
    };
  }

  async getExistingOrder(data?: TProduct): Promise<ShippingType | {}> {
    const product = data || (await firstValueFrom(this.product$));
    if (product?.id) {
      const result: ShippingType = await firstValueFrom(
        await this.request.get(`/shipping/${product.id}`)
      );
      this.setShippingDetailsFroDB(result);
      return result;
    }
    return {};
  }

  async confirmPayment(orderNumber: { orderNumber: string; coupon?: string }) {
    try {
      return await firstValueFrom(
        await this.request.create('/shipping/confirm', orderNumber)
      );
    } catch (error) {
      console.error('Payment confirmation failed', error);
      throw error;
    }
  }

  private clearSubjects() {
    this.shippingOrder.complete();
    this.shippingAddress.complete();
    this.product.complete();
  }
}
