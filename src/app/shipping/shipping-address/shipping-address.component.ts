import { Router } from '@angular/router';
import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { HttpClient } from '@angular/common/http';
import { ShippingService } from 'src/app/services/shipping.service';
import { RequestService } from 'src/app/services/request.service';
import { firstValueFrom } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-shipping-address',
  templateUrl: './shipping-address.component.html',
  styleUrls: ['./shipping-address.component.css'],
})
export class ShippingAddressComponent
  implements OnInit, AfterViewInit, OnChanges
{
  @Output() confirmOrderEvent = new EventEmitter<void>();
  @Output() orderStatus = new EventEmitter<string>();
  @Input() exist: any;
  @Input() product: {
    price: number;
    id: string;
    user_id: string;
    title: string;
    desc: null | string;
    image: string;
    created_at: Date;
  } | null = null;

  user: {
    id: number;
    first_name: string;
    last_name: string;
    username: string;
    email: string;
    phone: string;
    role: 'admin' | 'subscriber' | 'rider';
    status: 'active' | 'deactive';
    age: number | null;
    created_at: string;
    updated_at: string;
  } | null = null;

  billingForm: FormGroup;
  listCountry: Record<string, any>[] = [];
  isSubmit: boolean = false;

  constructor(
    public auth: AuthService,
    private http: HttpClient,
    public shipping: ShippingService,
    public request: RequestService,
    public router: Router,
    public _snackBar: MatSnackBar
  ) {
    this.billingForm = new FormGroup({
      phone: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      addressLine1: new FormControl('', Validators.required),
      addressLine2: new FormControl(''),
      city: new FormControl('', Validators.required),
      state: new FormControl('', Validators.required),
      country: new FormControl('', Validators.required),
      zip: new FormControl('', [
        Validators.required,
        Validators.pattern('^[0-9]{4}(?:-[0-9]{4})?$'),
      ]),
    });
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['exist']?.currentValue?.id) {
      this.billingForm.patchValue({
        phone: this.exist.shipping_phone,
        email: this.exist.shipping_email,
        addressLine1: this.exist.address_line1,
        addressLine2: this.exist.address_line2,
        city: this.exist.city,
        state: this.exist.state,
        country: this.exist.country,
        zip: this.exist.zip,
      });
      this.isSubmit = true;
    }
  }

  async ngOnInit() {
    try {
      this.user = await this.auth.getProfile();
      this.billingForm.patchValue({
        email: this.user?.email,
        phone: this.user?.phone,
      });

      this.billingForm.valueChanges.subscribe((value) => {
        if (!this.billingForm.valid) {
          this.isSubmit = false;
        }
      });
    } catch (error) {
      console.log(error);
    }
  }
  async ngAfterViewInit() {
    try {
      const result = await this.http
        .get('https://restcountries.com/v3.1/all?fields=name')
        .toPromise();
      this.listCountry = (result as Record<string, any>[]).sort((a, b) =>
        a['name'].common.localeCompare(b['name'].common)
      );
    } catch (error) {
      console.error('Failed to fetch countries:', error);
    }
  }
  async makeOrder() {
    try {
      const result = await this.shipping.orderPlaced();

      this._snackBar.open('Order create successfully', 'Close', {
        duration: 3000,
        horizontalPosition: 'end',
        verticalPosition: 'bottom',
        panelClass: ['custom-snackbar'],
      });
    } catch (error) {
      console.log(error);
      if ((error as any)?.error?.message === 'Product Already Placed') {
        this.displayErrorMessage('Product has already been placed.');
      } else if (
        (error as any)?.error?.message === 'Product placed successfully'
      ) {
        this.onSubmit();
      }
    }
  }
  displayErrorMessage(message: string) {
    this.orderStatus.emit(message);
    setTimeout(() => {
      this.orderStatus.unsubscribe();
      this.router.navigateByUrl('/');
    }, 3000);
  }
  async onSubmit() {
    if (this.billingForm.valid) {
      this.shipping.setAddress(this.billingForm.value);
      this.isSubmit = true;
      await this.makeOrder();
      this.confirmOrderEvent.emit();
    } else {
      console.log('Form is invalid. Please fill in all required fields.');
    }
  }

  confirmOrder() { 
    if (this.billingForm.valid) {
      this.shipping.setAddress(this.billingForm.value);
      this.isSubmit = true;
      if (this.exist) {
        let coupon;
        this.shipping.shippingOrder$.subscribe((res) => (coupon = res));

        this.router.navigate(['/payment'], {
          queryParams: {
            productId: this.product?.id,
            coupon: (coupon as any)?.coupon?.code || undefined,
          },
        });
      }
    } else {
      console.log('Form is invalid. Please fill in all required fields.');
    }
  }
}
