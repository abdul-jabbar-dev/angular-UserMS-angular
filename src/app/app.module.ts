import { MatNativeDateModule } from '@angular/material/core';
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
import { NgModule } from '@angular/core';
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
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { PaymentComponent } from './shipping/payment/payment.component';
import { PromocodeComponent } from './promocode/promocode.component';
import { CreatePromoComponent } from './promocode/create-promo/create-promo.component';
 

@NgModule({
  declarations: [
    AppComponent,
    ChildComponentComponent,
    AboutComponent,
    ContactusComponent,
    NavbarComponent,
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
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    CKEditorModule,   
  ],
  providers: [
    RouteService,
    RouterLinkService,
    SupabaseService,
    AuthService,
    StoreService,
    ShippingService,
    RequestService,
    AuthGuard,
    StatusGuard,
    SharedModule,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
