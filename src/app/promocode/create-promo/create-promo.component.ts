import { Component, EventEmitter, OnDestroy, Output } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { RequestService } from 'src/app/services/request.service';

export interface TPromocode {
  code: string;
  discount_amount: number;
  discount_type: 'percentage' | 'fixed';
  valid_from: Date;
  valid_to: Date;
  usage_limit: number;
}

@Component({
  selector: 'app-create-promo',
  templateUrl: './create-promo.component.html',
  styleUrls: ['./create-promo.component.css'],
})
export class CreatePromoComponent implements OnDestroy {
  isError: string = '';

  @Output() isSuccess = new EventEmitter<boolean>(false);
  isLoading: boolean = false;

  successEvent(emit?: boolean) {
    let prev;
    this.isSuccess.subscribe((d) => (prev = d));
    if (typeof emit === 'boolean') {
      this.isSuccess.emit(emit);
    }
    return prev;
  }

  createPromoForm: FormGroup = new FormGroup({
    code: new FormControl<string>('', [
      Validators.required,
      Validators.minLength(3),
    ]),
    discount_amount: new FormControl<number>(0, [
      Validators.required,
      Validators.min(0),
    ]),
    discount_type: new FormControl<'percentage' | 'fixed'>('percentage', [
      Validators.required,
    ]),
    valid_from: new FormControl<Date>(new Date()),
    valid_to: new FormControl<Date | null>(null, [Validators.required]),
    usage_limit: new FormControl<number>(0, [
      Validators.required,
      Validators.min(1),
    ]),
  });

  constructor(private fb: FormBuilder, protected request: RequestService) {}

  ngOnInit() {
    this.createPromoForm = this.fb.group({
      code: new FormControl<string>('', [
        Validators.required,
        Validators.minLength(3),
      ]),
      discount_amount: new FormControl<number>(0, [
        Validators.required,
        Validators.min(0),
      ]),
      discount_type: new FormControl<'percentage' | 'fixed'>('percentage', [
        Validators.required,
      ]),
      valid_from: new FormControl<Date | null>(null, [Validators.required]),
      valid_to: new FormControl<Date | null>(null, [Validators.required]),
      usage_limit: new FormControl<number>(0, [
        Validators.required,
        Validators.min(1),
      ]),
    });
  }

  async onSubmit() {
    this.isLoading = true;
    this.createPromoForm.patchValue({ valid_from: new Date() });
    try {
      if (this.createPromoForm.valid) {
        this.createPromoForm.patchValue({
          valid_to: new Date(this.createPromoForm.getRawValue()['valid_to']),
        });
        const promocode: TPromocode = this.createPromoForm.value;

        const result = await firstValueFrom(
          await this.request.create('/promo/create', promocode)
        );
        if (result) {
          this.successEvent(true);
          setTimeout(() => {
            this.successEvent(false);
          }, 3000);
        }
        this.createPromoForm.reset();
      } else {
        console.log('Form is invalid');
      }
    } catch (error) {
      if ((error as any).error.message === 'Promo code already exists') {
        this.isError = (error as any).error.message;
        setTimeout(() => {
          this.isError = '';
        }, 5000);
      }
      this.isLoading = false;
    }
    this.isLoading = false;
  }

  ngOnDestroy(): void {
    this.isError = '';
    this.successEvent(false);
    this.isLoading = false;
  }
}
