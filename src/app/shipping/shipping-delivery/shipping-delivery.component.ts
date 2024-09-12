import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { ShippingService } from 'src/app/services/shipping.service';

@Component({
  selector: 'app-shipping-delivery',
  templateUrl: './shipping-delivery.component.html',
  styleUrls: ['./shipping-delivery.component.css'],
})
export class ShippingDeliveryComponent implements OnInit {
  value: any;
  availibleSpot:
    | {
        cost: number;
        key: string;
        title: string;
        deliveryTime: string;
        img: string;
        selected: boolean;
      }[]
    | null = null;
  product: {
    price: number;
    id: string;
    user_id: string;
    title: string;
    desc: null | string;
    image: string;
    created_at: Date;
  } | null = null;
  constructor(public shipping: ShippingService) {
    this.availibleSpot = [
      {
        key: 'In_Dhaka/80/12 Hours',
        title: 'In Dhaka',
        cost: 80,
        deliveryTime: '12 Hours',
        img: 'https://img.icons8.com/?size=100&id=BT0JtUVqoVpQ&format=png&color=000000',
        selected: true,
      },
      {
        key: 'Outside_Dhaka/160/28 Hours',
        title: 'Outside Dhaka',
        cost: 160,
        deliveryTime: '28 Hours',
        img: 'https://img.icons8.com/?size=100&id=LOP7shBR2nLh&format=png&color=000000',
        selected: false,
      },
      {
        key: 'In_Asia/600/7 Working Days',
        title: 'In Asia',
        cost: 600,
        deliveryTime: '7 Working Days',
        img: 'https://img.icons8.com/?size=80&id=Hpu4wppBX1Wq&format=png',
        selected: false,
      },
    ]; 
  }

  ngOnInit(): void {
    this.value = this.availibleSpot?.find((data) => data.selected)?.key;
    this.shipping.addOrder({
      shippingSpot: {
        spot: this.value.split('/')[0],
        cost: this.value.split('/')[1],
        time: this.value.split('/')[2],
      },
    });
  }

  onChange(event: any) {
    this.value = event.target.value;
    this.shipping.addOrder({
      shippingSpot: {
        spot: event.target.value.split('/')[0],
        cost: event.target.value.split('/')[1],
        time: event.target.value.split('/')[2],
      },
    });
    if (this.availibleSpot) {
      this.availibleSpot = this.availibleSpot.map((deli) => {
        if (deli.key === event.target.value) {
          deli.selected = true;
        } else {
          deli.selected = false;
        }

        return deli;
      });
    }
  }
}
