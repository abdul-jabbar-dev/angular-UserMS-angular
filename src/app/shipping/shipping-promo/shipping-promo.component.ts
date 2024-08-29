import { Component, Input, Output, NgModule, OnInit } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { TPromocode } from 'src/app/promocode/create-promo/create-promo.component';
import { RequestService } from 'src/app/services/request.service';
import * as moment from 'moment';
import { ShippingService } from 'src/app/services/shipping.service';
interface TOrder {
  shippingSpot: { cost: string | number; time: string; spot: string };
  coupon?: { code: string; discount_type: string; discount_amount: number };
}
@Component({
  selector: 'app-shipping-promo',
  templateUrl: './shipping-promo.component.html',
  styleUrls: ['./shipping-promo.component.css'],
})
export class ShippingPromoComponent implements OnInit {
  promocode: any;
  isError = '';
  constructor(
    protected request: RequestService,
    protected shipping: ShippingService
  ) {}

  allPromocode: TPromocode[] = [];
  @Input() product: {
    price: number;
    id: string;
    user_id: string;
    title: string;
    desc: null | string;
    image: string;
    created_at: Date;
  } | null = null;

  async verify() {
    try {
      const result: TPromocode = await firstValueFrom(
        await this.request.get('/promo/verify/' + this.promocode)
      );
      if (result) {
        let old: TOrder | {} = { coupon: {}, shippingSpot: {} };
        this.shipping.shippingOrder$.subscribe((data) => (old = data));
        this.shipping.addOrder({
          ...old,
          coupon: {
            code: result.code,
            discount_amount: result.discount_amount,
            discount_type: result.discount_type,
          },
        } as TOrder);
      }
    } catch (error) {
      if ((error as any).error.message) {
        this.isError = (error as any).error.message;
        setTimeout(() => {
          this.isError = '';
        }, 4000);
      }
      console.log((error as any).error);
    }
  }

  async ngOnInit() {
    try {
      const promocode: TPromocode[] = await firstValueFrom(
        await this.request.get('/promo/for_users')
      );
      this.allPromocode = promocode;
    } catch (error) {
      console.log('shipping-promo/ 24 :', error);
    }
  }

  inExpire(expireDate: Date): string {
    const expiration = moment(expireDate);

    if (moment().isAfter(expiration)) {
      return 'Expired';
    }

    return expiration.fromNow();
  }
}
