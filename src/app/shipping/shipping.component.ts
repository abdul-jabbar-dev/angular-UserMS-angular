import {
  Component,
  OnInit,
  OnDestroy,
  Output,
  Input,
  SimpleChanges,
  EventEmitter,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RequestService } from '../services/request.service';
import { firstValueFrom } from 'rxjs';
import { ShippingService } from '../services/shipping.service';

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
  data: any;

  @Output() product: {
    price: number;
    id: string;
    user_id: string;
    title: string;
    desc: null | string;
    image: string;
    created_at: Date;
  } | null = null;

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
  async getProducts(): Promise<void> {
    if (!this.param) {
      console.error('No product ID found');
      return;
    }

    try {
      this.product = await firstValueFrom(
        await this.request.get('/product/get_product/' + this.param)
      );
      if (this.product) {
        this.shipping.setProduct(this.product);
      }
    } catch (error) {
      console.error('Failed to fetch product:', error);
    }
  }

  async ngOnInit() {
    this.route.paramMap.subscribe(async (params) => {
      this.param = params.get('id');
      await this.getProducts();
    });

    this.updateDate();
    this.startAutoUpdate();
    this.shipping.shippingOrder$.subscribe((data) => console.log(data));
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
    return new Date().toUTCString();
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
