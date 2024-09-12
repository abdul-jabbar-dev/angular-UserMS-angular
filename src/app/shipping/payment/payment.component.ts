import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ShippingService } from 'src/app/services/shipping.service';
import { RequestService } from 'src/app/services/request.service';
import { Subscription, firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css'],
})
export class PaymentComponent implements OnInit, OnDestroy {
  fullName: string = '';
  expiryDate: string = '';
  cvvValue: string = '';
  cardNum: string = '';
  cardSelect: string = 'visa';
  isCVVShow: boolean = false;
  productId: string = '';

  productDetails: any;
  isMessage: string = '';
  isLoading: boolean = false;
  private subscription: Subscription = new Subscription();
  coupon?: {
    code: string;
    discount_type: 'percentage' | 'fixed';
    discount_amount: number;
  };

  constructor(
    public shipping: ShippingService,
    private router: Router,
    private request: RequestService,
    private activeRouter: ActivatedRoute
  ) {}

  async ngOnInit() {
    try {
      const params = await firstValueFrom(this.activeRouter.queryParams);
      this.productId = params['productId'];
      const code = params['coupon'];

      if (code) {
        this.coupon = await this.verifyCoupon(code);
      }

      await this.loadProductDetails();
    } catch (error) {
      this.router.navigateByUrl('/');
    }
  }

  async verifyCoupon(code: string) {
    try {
      const resu = await firstValueFrom(
        await this.request.get(`/promo/verify/${code}`)
      );
      return {
        code: resu.code,
        discount_amount: resu.discount_amount,
        discount_type: resu.discount_type,
      };
    } catch (error) {
      console.error('Failed to verify coupon:', error);
      return undefined;
    }
  }

  async loadProductDetails() {
    try {
      this.isLoading = true;
      this.productDetails = await firstValueFrom(
        await this.request.get(`/shipping/${this.productId}`)
      );

      if (!this.productDetails) {
        this.router.navigateByUrl('/');
      }
    } catch (error) {
      this.router.navigateByUrl('/');
    } finally {
      this.isLoading = false;
    }
  }

  calculateTotal(price: number, tax: number, shippingCost: number): number {
    let total = Number(price) + Number(tax) + Number(shippingCost);

    if (this.coupon) {
      if (this.coupon.discount_type === 'fixed') {
        total -= Number(this.coupon.discount_amount);
      } else if (this.coupon.discount_type === 'percentage') {
        total -= (total * Number(this.coupon.discount_amount)) / 100;
      }
    }

    return Math.ceil(total);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  async submit() {
    if (this.isLoading) return;

    if (!this.fullName || !this.expiryDate || !this.cvvValue || !this.cardNum) {
      console.warn('Form not complete');
      return;
    }

    this.isLoading = true;

    try {
      const result = await this.shipping.confirmPayment({
        orderNumber: this.productDetails.order_number,
        coupon: this.coupon?.code || undefined,
      });

      if (result === 'Product Placed Successfully') {
        this.showSuccessMessage('Product Placed Successfully');
      }
    } catch (error) {
      this.handleSubmissionError(error);
    } finally {
      this.isLoading = false;
    }
  }
  calculateSavings(total: number): number {
    if (!this.coupon) return 0;

    if (this.coupon.discount_type === 'fixed') {
      return Math.min(Number(this.coupon.discount_amount), total);
    } else if (this.coupon.discount_type === 'percentage') {
      return (total * Number(this.coupon.discount_amount)) / 100;
    }

    return 0;
  }

  private showSuccessMessage(message: string) {
    this.isMessage = message;
    setTimeout(() => {
      this.isMessage = '';
      this.router.navigateByUrl('/');
    }, 3000);
  }

  private handleSubmissionError(error: any) {
    console.error('Submission failed', error);
    if (error?.error?.text === 'Product Placed Successfully') {
      this.showSuccessMessage('Product Placed Successfully');
    }
  }

  changeCard($event: any) {
    this.cardSelect = $event.target.value;
  }

  formatExpiryDate(event: any): void {
    let input = event.target.value;

    input = input.replace(/\D/g, '');

    if (input.length > 2) {
      input = input.substring(0, 2) + '/' + input.substring(2, 4);
    }

    input = input.substring(0, 5);

    event.target.value = input;

    this.expiryDate = input;
  }

  cvv(event: any): void {
    let input = event.target.value as string;
    input = input.replace(/\D/g, '');
    this.cvvValue = input.substring(0, 3);
    event.target.value = this.cvvValue;
  }

  addCardNum($event: any): void {
    let input = $event.target.value as string;

    input = input.replace(/\D/g, '');

    input = input.slice(0, 16);

    this.cardNum = input.replace(/(.{4})/g, '$1 ').trim();

    $event.target.value = this.cardNum;
  }

  toggolBack() {
    this.isCVVShow = !this.isCVVShow;
  }

  calculateTax(price: number): number {
    const taxRate = 0.02;
    return price * taxRate;
  }
}
