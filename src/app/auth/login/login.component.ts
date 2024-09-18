import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { ReverseGeocodingService } from 'src/app/services/reverse-geocoding.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  error = '';
  address: string | null = null;
  deviceInformation: {
    address: string | null;
    deviceId: string;
    userAgent: string;
    platform: string;
  } | null = null;

  loginUserForm = new FormGroup({
    email: new FormControl<string>('', [Validators.required, Validators.email]),
    password: new FormControl<string>('', [
      Validators.required,
      Validators.minLength(6),
    ]),
  });

  constructor(
    private auth: AuthService,
    private geoService: ReverseGeocodingService
  ) {}

  async ngOnInit() {
    try {
      this.address = await this.geoService.getAddress();
      this.deviceInformation = {
        address: this.address,
        deviceId: this.geoService.getDeviceId(),
        userAgent: navigator.userAgent,
        platform: navigator.platform,
      };
    } catch (error) {
      this.error =
        'Failed to get location or address: ' + (error as any).message;
      console.error('Error:', this.error);
    }
  }

  async onSubmit() {
    try {
      const data = this.loginUserForm.getRawValue();
      if (data.email && data.password) {
        await this.auth.signInWithEmail(data, this.deviceInformation);
        this.error = '';
      } else {
        this.error = 'Email and password are required';
      }
    } catch (error) {
      this.error = 'Login failed: ' + (error as any).message;
      setTimeout(() => {
        this.error = '';
      }, 5000);
    }
  }
}
