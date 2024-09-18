import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { RequestService } from 'src/app/services/request.service';

@Component({
  selector: 'app-rider-dash',
  templateUrl: './rider-dash.component.html',
  styleUrls: ['./rider-dash.component.css'],
})
export class RiderDashComponent implements OnChanges {
  totalDone = 0;
  totalPending = 0;
  totalBenifit = 0.0;
  constructor(public request: RequestService) {}
  @Input() orders: BehaviorSubject<any> | undefined;
  allOrders: any;
  async ngOnChanges(changes: SimpleChanges) {
    await this.getMyHis();
    this.orders?.subscribe((res) => {
      this.allOrders = res;
    });
  }

  async getMyHis() {
    try {
      const res = await firstValueFrom(
        await this.request.get('/user/rider/get_history')
      );
      this.totalDone = res.totalDone;
      this.totalPending = res.totalPending;
      this.totalBenifit = res.totalBenifit;
    } catch (error) {
      console.log(error);
    }
  }
}
