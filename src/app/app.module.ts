import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatStepperModule } from '@angular/material/stepper';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { QRCodeModule } from 'angularx-qrcode';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ProfileComponent } from './profile/profile.component';
import { WebsocketService } from './services/websocket.service';
import { PasswordInputComponent } from './../components/common/password-input/password-input.component';
import { GlobalGuard } from './GlocalGuard';
import { SingleOrderComponent } from './orders/single-order/single-order.component';

import { StatusGuard } from './StateGuard';
import { FilterSelectButtonComponent } from './../components/common/filter-select-button/filter-select-button.component';
import { StaticModalComponent } from './../components/common/static-modal/static-modal.component';
import { ShippingService } from './services/shipping.service';
import { ShippingSummaryComponent } from './shipping/shipping-summary/shipping-summary.component';
import { SharedModule } from './services/shared/shared.module';
import { AuthGuard } from './AuthGuard';
import { RequestService } from './services/request.service';
import { StoreService } from './services/store.service';
import { AuthService } from './services/auth.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { SupabaseService } from './services/supabase.service';

import { RouterLinkService } from './services/router-link.service';
import { RouteService } from './services/app.service';
import { SidebarComponent } from './../components/sidebar/sidebar.component';
import { NavbarComponent } from './../components/navbar/navbar.component';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AboutComponent } from './about/about.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { ChildComponentComponent } from './child-component/child-component.component';
import { ContactusComponent } from './contactus/contactus.component';
import { CreateProductsComponent } from './products/create-products/create-products.component';
import { EditProfileComponent } from './profile/edit-profile/edit-profile.component';
import { UsersComponent } from './users/users.component';
import { AdminUserComponent } from './users/admin-user/admin-user.component';
import { AllUserComponent } from './users/all-user/all-user.component';
import { MyProductsComponent } from './products/my-products/my-products.component';
import { EditMyProductsComponent } from './products/edit-my-products/edit-my-products.component';
import { FavouriteComponent } from './favourite/favourite.component';
import { AllProductsComponent } from './products/all-products/all-products.component';
import { SingleProductComponent } from './products/single-product/single-product.component';
import { AdminProductsComponent } from './products/admin-products/admin-products.component';
import { ShippingComponent } from './shipping/shipping.component';
import { ShippingAddressComponent } from './shipping/shipping-address/shipping-address.component';
import { ShippingProductComponent } from './shipping/shipping-product/shipping-product.component';
import { ShippingPromoComponent } from './shipping/shipping-promo/shipping-promo.component';
import { ShippingDeliveryComponent } from './shipping/shipping-delivery/shipping-delivery.component';

import { PaymentComponent } from './shipping/payment/payment.component';
import { PromocodeComponent } from './promocode/promocode.component';
import { CreatePromoComponent } from './promocode/create-promo/create-promo.component';
import { OrdersComponent } from './orders/orders.component';

import { VerifyBillComponent } from './verify-bill/verify-bill.component';
import { RiderComponent } from './rider/rider.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { AdminOrdersComponent } from './admin-orders/admin-orders.component';
import { RiderDashComponent } from './rider/rider-dash/rider-dash.component';
import { SplitPipe } from './split.pipe';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RiderOrdersComponent } from './rider/rider-orders/rider-orders.component';
import { OrderStatusStepperComponent } from './orders/order-status-stepper/order-status-stepper.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatChipsModule } from '@angular/material/chips';
import { ChatRiderComponent } from './orders/chat-rider/chat-rider.component';
import { MatRippleModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ProfileSidebarComponent } from './profile/profile-sidebar/profile-sidebar.component';
import { ProfileAccountComponent } from './profile/profile-account/profile-account.component';
import { ProfilePasswordComponent } from './profile/profile-password/profile-password.component';

// export function initializeWebSocket(
//   authService: AuthService,
//   websocketService: WebsocketService
// ) {
//   return async () => {
//     try {
//       const user: any = await authService.getProfile();
//       console.log(user);
//       if (user && user.id) {
//         await websocketService.initializeSocket(user.id);
//       } else {
//         throw new Error('User not authenticated');
//       }
//     } catch (error) {
//       console.error('Error during WebSocket initialization:', error);
//     }
//   };
// }

@NgModule({
  declarations: [
    AppComponent,
    ChildComponentComponent,
    AboutComponent,
    ContactusComponent,
    NavbarComponent,
    AdminOrdersComponent,
    AllProductsComponent,
    SidebarComponent,
    LoginComponent,
    RegisterComponent,
    CreateProductsComponent,
    EditProfileComponent,
    UsersComponent,
    AdminUserComponent,
    AllUserComponent,
    MyProductsComponent,
    EditMyProductsComponent,
    FavouriteComponent,
    SingleProductComponent,
    AdminProductsComponent,
    ShippingComponent,
    ShippingAddressComponent,
    ShippingProductComponent,
    ShippingPromoComponent,
    ShippingSummaryComponent,
    ShippingDeliveryComponent,
    StaticModalComponent,
    FilterSelectButtonComponent,
    PaymentComponent,
    PromocodeComponent,
    CreatePromoComponent,
    OrdersComponent,
    SingleOrderComponent,
    VerifyBillComponent,
    RiderComponent,
    NotFoundComponent,
    RiderOrdersComponent,
    RiderDashComponent,
    SplitPipe,
    OrderStatusStepperComponent,
    ForgotPasswordComponent,
    PasswordInputComponent,
    ChatRiderComponent,
    ProfileComponent,
    ProfileSidebarComponent,
    ProfileAccountComponent,
    ProfilePasswordComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    MatSlideToggleModule,
    ReactiveFormsModule,
    QRCodeModule,
    HttpClientModule,
    CKEditorModule,
    BrowserAnimationsModule,
    MatSlideToggleModule,
    MatProgressSpinnerModule,
    MatRippleModule,
    MatStepperModule,
    MatIconModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MatSnackBarModule,
    MatChipsModule,
  ],
  providers: [
    AuthService,
    RouteService,
    RouterLinkService,
    SupabaseService,
    // WebsocketService,
    StoreService,
    ShippingService,
    RequestService,
    AuthGuard,
    StatusGuard,
    SharedModule,
    GlobalGuard,
    // {
    //   provide: APP_INITIALIZER,
    //   useFactory: initializeWebSocket,
    //   deps: [AuthService, WebsocketService],
    //   multi: true,
    // },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
