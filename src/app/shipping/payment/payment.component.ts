import { Component } from '@angular/core';
import { ShippingService } from 'src/app/services/shipping.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css'],
})
export class PaymentComponent {
  fullName: any;
  expiryDate: any;
  cvvValue: any;
  cardNum: any;
  cardSelect = 'visa';
  isCVVShow = false;

  oderDetails: any;

  constructor(public shipping: ShippingService) {

    this.getOrderInfo();
  }
  async getOrderInfo() {
    let info = await this.shipping.getOrderInfo();
    this.oderDetails = info;
  }

  changeCard($event: any) {
    this.cardSelect = $event.target.value;
  }

  formatExpiryDate(event: any) {
    let input = event.target.value;
    if (/^\{d}\/$/.test(input)) {
      console.log(event.target.value);
      event.target.value = input;
    }
    if (/^\d{2}$/.test(input)) {
      event.target.value = input + '/';
    } else if (/^\d{2}\/\d{2}$/.test(input)) {
      event.target.value = input;
    } else {
      event.target.value = input.substring(0, 5);
    }

    this.expiryDate = event.target.value;
  }

  cvv(event: any): void {
    let input = event.target.value as string;
    input = input.replace(/\D/g, '');

    if (input.length > 3) {
      input = input.substring(0, 3);
    }

    this.cvvValue = input;
    event.target.value = this.cvvValue;
  }

  addCardNum($event: any): void {
    let input = $event.target.value as string;

    input = input.replace(/\D/g, '');
    if (input.length > 16) {
      input = input.substring(0, 16);
    }
    let formattedInput = input.replace(/(.{4})/g, '$1 ').trim();

    this.cardNum = formattedInput;
    $event.target.value = this.cardNum;
  }
  toggolBack() { 
    this.isCVVShow = !this.isCVVShow;
  }
}
