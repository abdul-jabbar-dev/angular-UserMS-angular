import { Component, OnInit, Output } from '@angular/core';
import { RequestService } from '../services/request.service';
import { BehaviorSubject, firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-rider',
  templateUrl: './rider.component.html',
  styleUrls: ['./rider.component.css'],
})
export class RiderComponent implements OnInit {
  constructor(protected request: RequestService) {}
  @Output() orders = new BehaviorSubject([]);
  async ngOnInit() {
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
}
