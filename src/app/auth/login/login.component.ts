import { AuthService } from 'src/app/services/auth.service';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  error = '';

  constructor(public auth: AuthService) {}

  loginUserForm = new FormGroup({
    email: new FormControl<string>('', [Validators.required, Validators.email]),
    password: new FormControl<string>('', [
      Validators.required,
      Validators.minLength(6),
    ]),
  });

  async onSubmit() {
    try {
      const data = this.loginUserForm.getRawValue();
      if (data.email&&data.password) {
        const result = await this.auth.signInWithEmail(data);
        this.error = ''; 
      }else{

      }
    } catch (error) {
      this.error = error as string;
      setTimeout(() => {
        this.error = '';
      }, 5000);0
    }
  }
}
