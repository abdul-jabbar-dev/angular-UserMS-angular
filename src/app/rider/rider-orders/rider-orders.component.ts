import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { RequestService } from 'src/app/services/request.service';

@Component({
  selector: 'app-rider-orders',
  templateUrl: './rider-orders.component.html',
  styleUrls: ['./rider-orders.component.css'],
})
export class RiderOrdersComponent implements OnChanges, OnInit {
  constructor(protected request: RequestService) {}

  @Input() orders: BehaviorSubject<any> | undefined;
  allOrders: any;
  isCheckedMap: { [key: string]: boolean } = {};
  loadingMap: { [key: string]: boolean } = {};

  ngOnInit() {}

  async handleToggleChange(event: any, order: any) {
    const orderId = order.order_id;

    if (order.delivery_status === 'packaging') {
      this.loadingMap[orderId] = true;

      try {
        const confirmRider = await firstValueFrom(
          await this.request.put('/shipping/confirm_rider/' + orderId, {})
        );

        if (confirmRider) {
          event.source._disabled = true;
          this.isCheckedMap[orderId] = true;
        } else {
          this.isCheckedMap[orderId] = false;
        }
      } catch (error) {
        this.isCheckedMap[orderId] = false;
        console.error('Error confirming rider:', error);
      } finally {
        this.loadingMap[orderId] = false;
      }
    } else {
      this.isCheckedMap[orderId] = false;
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['orders']) {
      this.orders?.subscribe((res) => {
        this.allOrders = res;

        res.forEach((order: any) => {
          const orderId = order.order_id;

          if (order.delivery_status !== 'packaging') {
            this.isCheckedMap[orderId] = true;
          } else {
            this.isCheckedMap[orderId] = false;
          }
        });
      });
    }
  }

  isLoading(orderId: string) {
    return this.loadingMap[orderId];
  }
}
