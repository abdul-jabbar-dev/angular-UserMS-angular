import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-rider-dash',
  templateUrl: './rider-dash.component.html',
  styleUrls: ['./rider-dash.component.css'],
})
export class RiderDashComponent implements OnChanges {
  @Input() orders: BehaviorSubject<any> | undefined;
  allOrders: any;
  ngOnChanges(changes: SimpleChanges): void {
    this.orders?.subscribe((res) => (this.allOrders = res));
  }
}
