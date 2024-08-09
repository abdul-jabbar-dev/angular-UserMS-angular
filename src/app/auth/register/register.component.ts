import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  constructor(public auth: AuthService) {}

  registerUserForm = new FormGroup({
    first_name: new FormControl<string>('', [
      Validators.required,
      Validators.minLength(3),
    ]),last_name: new FormControl<string>('', [
      Validators.required,
      Validators.minLength(3),
    ]),phone: new FormControl<string>('', [
      Validators.required,
      Validators.minLength(5),
    ]),
    password: new FormControl<string>('', [
      Validators.required,
      Validators.minLength(6),
    ]),
    email: new FormControl<string>('', [Validators.required, Validators.email]),
  });

  onSubmit() {
    console.log(this.registerUserForm.getRawValue());
    console.log(this.auth.signUpNewUser(this.registerUserForm.getRawValue()));
  }

  async loginByGoogle() {
    const result = await this.auth.loginWithGoogle(); 
  }
}
