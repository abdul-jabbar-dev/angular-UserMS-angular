import {
  Component,
  AfterContentInit,
  ElementRef,
  ViewChild,
  ContentChild,
  Input,
} from '@angular/core';

@Component({
  selector: 'password-input',
  templateUrl: './password-input.component.html',
  styleUrls: ['./password-input.component.css'],
})
export class PasswordInputComponent implements AfterContentInit {
  hide: boolean = true;
  @Input() error!: string;

  @ContentChild('passwordField', { static: false }) passwordField!: ElementRef;

  toggleVisibility(): void {
    this.hide = !this.hide;
    this.passwordField.nativeElement.type = this.hide ? 'password' : 'text';
  }

  ngAfterContentInit(): void {
    if (this.passwordField) {
      this.passwordField.nativeElement.type = 'password';
    }
  }
}
