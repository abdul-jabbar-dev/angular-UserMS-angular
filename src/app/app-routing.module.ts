import { AdminOrdersComponent } from './admin-orders/admin-orders.component';
import { OrdersComponent } from './orders/orders.component';
import { PromocodeComponent } from './promocode/promocode.component';
import { StatusGuard } from './StateGuard';
import { ShippingComponent } from './shipping/shipping.component';
import { AdminProductsComponent } from './products/admin-products/admin-products.component';
import { FavouriteComponent } from './favourite/favourite.component';
import { AllUserComponent } from './users/all-user/all-user.component';
import { UsersComponent } from './users/users.component';
import { ContactusComponent } from './contactus/contactus.component';
import { AboutComponent } from './about/about.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { CreateProductsComponent } from './products/create-products/create-products.component';
import { AllProductsComponent } from './products/all-products/all-products.component';
import { EditProfileComponent } from './profile/edit-profile/edit-profile.component';
import { AdminUserComponent } from './users/admin-user/admin-user.component';
import { AuthGuard } from './AuthGuard';
import { MyProductsComponent } from './products/my-products/my-products.component';
import { SingleProductComponent } from './products/single-product/single-product.component';
import { PaymentComponent } from './shipping/payment/payment.component';
import { SingleOrderComponent } from './orders/single-order/single-order.component';
import { VerifyBillComponent } from './verify-bill/verify-bill.component';
import { RiderComponent } from './rider/rider.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
// import { WebsocketService } from './services/websocket.service';

const routes: Routes = [
  // { path: 'about', component: AboutComponent, canActivate: [AuthGuard] },
  // { path: 'contact', component: ContactusComponent },
  { path: 'login', component: LoginComponent },
  {
    path: 'registration',
    component: RegisterComponent,
  },
  {
    path: 'create_products',
    component: CreateProductsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'verify/:id',
    component: VerifyBillComponent,
  },
  {
    path: 'edit_profile',
    component: EditProfileComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'promocode',
    component: PromocodeComponent,
    canActivate: [AuthGuard],
  },  {
    path: 'forgot_password',
    component: ForgotPasswordComponent
  },
  {
    path: 'my_orders',
    component: OrdersComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'my_orders/:id',
    component: SingleOrderComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'prduct_list',
    component: AdminProductsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'users',
    component: UsersComponent,
    children: [
      {
        path: 'all_users',
        component: AllUserComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'admin_users',
        component: AdminUserComponent,
        canActivate: [AuthGuard],
      },
    ],
  },
  { path: 'users', component: UsersComponent, canActivate: [AuthGuard] },
  {
    path: 'favourite',
    component: FavouriteComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'payment',
    component: PaymentComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'product/:id',
    component: SingleProductComponent,
  },  {
    path: 'dash',
    component: RiderComponent,
  }, {
    path: 'admin_orders',
    component: AdminOrdersComponent,
  },
  {
    path: 'shipping/:id',
    component: ShippingComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'my_products',
    component: MyProductsComponent,
    canActivate: [AuthGuard],
  },
  { path: '', component: AllProductsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {
 
}
