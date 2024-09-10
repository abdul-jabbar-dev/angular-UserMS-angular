import {
  Component,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { RequestService } from '../services/request.service';
import { BehaviorSubject, firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-rider',
  templateUrl: './rider.component.html',
  styleUrls: ['./rider.component.css'],
})
export class RiderComponent implements OnInit, OnChanges {
  @Output() orders = new BehaviorSubject<any[]>([]);
  constructor(protected request: RequestService) {}
  async ngOnChanges(changes: SimpleChanges) {
    await this.handleOrders();
  }

  async handleOrders() {
    try {
      const result = await firstValueFrom(
        await this.request.get('/shipping/get_rider_order')
      );
      if (result) {
        this.orders.next(result);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async ngOnInit() {
    await this.handleOrders();
  }
}
