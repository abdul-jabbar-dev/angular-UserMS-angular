import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { RequestService } from '../services/request.service';

import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css'],
})
export class ForgotPasswordComponent {
  new_password: any;
  match_password: any;

  constructor(
    public request: RequestService,
    private router: Router
  ) {}

  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);
  sendedCode = false;
  error: string = '';
  otp: any;
  isUpdating = false;
  codeInfo: any;

  async makeForgot() {
    this.error = '';
    this.isUpdating = true;
    try {
      if (!this.sendedCode && !this.match_password && !this.otp) {
        const [res] = await firstValueFrom(
          await this.request.create('/user/send_code', {
            email: this.emailFormControl.getRawValue(),
          })
        );
        if (res?.reset_code && !this.match_password) {
          this.codeInfo = res;
          console.log(res);
          this.sendedCode = true;
        }
      } else if (this.match_password) {
        const res = await firstValueFrom(
          await this.request.create(
            '/user/send_new_password/' + this.codeInfo.id,
            {
              password: this.new_password,
            }
          )
        );
        if (res) {
          this.router.navigate(['/login']);
          console.log(res);
        }
      }
    } catch (error: any) {
      this.error = error.error.message;
    }
    this.isUpdating = false;
  }
  checkOTP() {
    this.error = '';

    if (this.sendedCode) {
      if (!this.codeInfo.reset_code) {
        this.error = 'OTP not found try again generate code';
        return;
      } else if (!this.otp) {
        this.error = 'OTP Required';
        return;
      }
      if (this.codeInfo.reset_code + '' === this.otp + '') {
        this.match_password = true;
      } else {
        this.error = 'Invalid OPT';
        return;
      }
    }
  }
}
