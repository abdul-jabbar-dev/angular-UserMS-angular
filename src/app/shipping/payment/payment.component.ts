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

      await this.loadProductDetails();
    } catch (error) {
      this.router.navigateByUrl('/');
    }
  }

  async loadProductDetails() {
    try {
      this.isLoading = true;
      this.productDetails = await firstValueFrom(
        await this.request.get('/shipping/' + this.productId)
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

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  async submit() {
    if (this.isLoading) return;

    try {
      if (this.fullName && this.expiryDate && this.cvvValue && this.cardNum) {
        this.isLoading = true;
        const result = await this.shipping.confirmPayment({
          orderNumber: this.productDetails.order_number,
        });

        if (result === 'Product Placed Successfully') {
          this.isMessage = 'Product Placed Successfully';
          setTimeout(() => {
            this.isMessage = '';
            this.router.navigateByUrl('/');
          }, 3000);
        }
      } else {
        console.warn('Form not complete');
      }
    } catch (error) {
      console.error('Submission failed', error);
      if ((error as any).error?.text === 'Product Placed Successfully') {
        this.isMessage = 'Product Placed Successfully';
        setTimeout(() => {
          this.isMessage = '';
          this.router.navigateByUrl('/');
        }, 3000);
      }
    } finally {
      this.isLoading = false;
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

  calculateTotal(price: number, tax: number, shippingCost: number): number {
    return Number(price) + Number(tax) + Number(shippingCost);
  }
}
