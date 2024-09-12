import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { TUserResponse } from 'src/app/admin-orders/admin-orders.component';
import { AuthService } from 'src/app/services/auth.service';
import { RequestService } from 'src/app/services/request.service';
// import { WebsocketService } from 'src/app/services/websocket.service';

@Component({
  selector: 'app-chat-rider',
  templateUrl: './chat-rider.component.html',
  styleUrls: ['./chat-rider.component.css'],
})
export class ChatRiderComponent  {
  inputMSG: string = '';
  isActive: boolean = false;

  sendMSG() {
    console.log(this.inputMSG);
  }
  constructor(
    public request: RequestService,
    // private webSocketService: WebsocketService,
    public auth: AuthService
  ) {}

  // ngOnInit() {
  //    this.webSocketService.socket.on('activeUsers', (d) => console.log(d));
  //   if (this.riderID) {
  //     this.webSocketService.listen('activeUsers').subscribe((res: any) => {
         
  //       this.isActive = res;
  //     });
  //   }
  // }
  // async ngOnChanges(changes: SimpleChanges) {
  //   await this.getRider();
  //   if (this.riderID) {
  //     this.webSocketService.socket.on('activeUsers', (d) => console.log(d));
  //     // .getActiveUsers(this.riderID as string)
  //   }
  // }
  @Input() riderID!: string | number;
  rider!: TUserResponse;

  async getRider() {
    const resu = await firstValueFrom(
      await this.request.get('/user/get_user/' + this.riderID)
    );
    this.rider = resu;
  }
}
