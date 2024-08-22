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

@Component({
  selector: 'app-shipping-address',
  templateUrl: './shipping-address.component.html',
  styleUrls: ['./shipping-address.component.css'],
})
export class ShippingAddressComponent implements OnInit, AfterViewInit {
  @Output() orderStatus = new EventEmitter<string>();
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
    role: 'admin' | 'subscriber';
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
    public router: Router
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
    this.router.navigateByUrl('/payment');
    // try {
    //   const result = await this.shipping.orderPlaced();
    //   if (result) {
    //     this.displayErrorMessage('Product placed Successfully');
    //   }
    // } catch (error) {
    //   if ((error as any).error.message === 'Product Already Placed') {
    //     this.displayErrorMessage('Product has already been placed.');
    //   }
    // }
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
    } else {
      console.log('Form is invalid. Please fill in all required fields.');
    }
  }
}
