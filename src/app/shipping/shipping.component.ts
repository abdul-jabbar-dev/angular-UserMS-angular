import {
  Component,
  OnInit,
  OnDestroy,
  Output,
  Input,
  SimpleChanges,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RequestService } from '../services/request.service';
import { firstValueFrom } from 'rxjs';
import { ShippingService } from '../services/shipping.service';

import { format } from 'date-fns';

@Component({
  selector: 'app-shipping',
  templateUrl: './shipping.component.html',
  styleUrls: ['./shipping.component.css'],
})
export class ShippingComponent implements OnInit, OnDestroy {
  @Input() isMessage: string = '';

  time: string;
  param: string | null = null;
  private intervalId: any;

  @Output() product: {
    price: number;
    id: string;
    user_id: string;
    title: string;
    desc: null | string;
    image: string;
    created_at: Date;
  } | null = null;

  @Output() exist: any;

  constructor(
    protected route: ActivatedRoute,
    public request: RequestService,
    public shipping: ShippingService
  ) {
    this.time = this.getDate();
  }
  handleOrderStatus(message: string): void {
    this.isMessage = message;
  }

  onConfirmOrder() {
    if (this.param) {
      this.getProducts(this.param);
    }
  }

  async getProducts(params: any): Promise<void> {
    if (!params) {
      console.error('No product ID found');
      return;
    }

    try {
      this.product = await firstValueFrom(
        await this.request.get('/product/get_product/' + params)
      );
      if (this.product) {
        this.shipping.setProduct(this.product);
      }
      const result = await firstValueFrom(
        await this.request.get('/shipping/' + (this.product as any).id)
      );
      this.exist = result;
    } catch (error) {
      console.error('Failed to fetch product:', error);
    }
  }

  async ngOnInit() {
    this.route.paramMap.subscribe(async (params) => {
      this.param = params.get('id');

      await this.getProducts(this.param);

      const res = await this.shipping.getExistingOrder(this.product as any);
    });

    this.updateDate();
    this.startAutoUpdate();
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes) {
      console.log('Product changed:', changes);
    }
  }
  getDate(): string {
    return format(Date.now(), 'yyyy-MM-dd HH:mm:ss');
  }

  updateDate(): void {
    this.time = this.getDate();
  }

  startAutoUpdate(): void {
    this.intervalId = setInterval(() => {
      this.updateDate();
    }, 1000);
  }
}
