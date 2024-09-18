 
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
 
@Component({
  selector: 'app-chat-rider',
  templateUrl: './chat-rider.component.html',
  styleUrls: ['./chat-rider.component.css'],
})
export class ChatRiderComponent implements OnInit, OnChanges {
  inputMSG: string = '';
  isActive: boolean = false;
  @Input() riderID!: string | number;
  rider!: TUserResponse;
  
  constructor(
    public request: RequestService,
    public auth: AuthService, 
  ) {}

  async ngOnInit() {
    console.log('ngOnInit called');
    await this.getRider();
  }

  async ngOnChanges(changes: SimpleChanges) {
    if (changes['riderID'] && this.riderID) {
      console.log('ngOnChanges called');
      await this.getRider();
    }
  }

  async getRider() {
    try {
      const result = await firstValueFrom(
        await this.request.get('/user/get_user/' + this.riderID)
      );
      this.rider = result;
    } catch (error) {
      console.error('Error fetching rider data:', error);
    }
  }

  sendMSG() {
    console.log(this.inputMSG);
  }
}
