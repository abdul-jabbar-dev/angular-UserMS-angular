import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { RouteService } from './services/app.service';
import { Component } from '@angular/core';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [
    trigger('slideInOut', [
      state('true', style({ transform: 'translateX(0)' })),
      state(
        'false',
        style({ transform: 'translateX(-100%)', display: 'none' })
      ),
      transition('false<=>true', [animate('300ms ease-in-out')]),
    ]),
  ],
})
export class AppComponent {
  isVisible = true;
  toggleSideBar() {
    this.isVisible = !this.isVisible;
  }
  constructor(public routeService: RouteService) {}
}
