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

const routes: Routes = [
  { path: 'about', component: AboutComponent, canActivate: [AuthGuard] },
  { path: 'contact', component: ContactusComponent },
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
    path: 'edit_profile',
    component: EditProfileComponent,
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
  { path: 'my_products', component: MyProductsComponent, canActivate: [AuthGuard] },
  { path: 'users', component: UsersComponent, canActivate: [AuthGuard] },
  { path: '', component: AllProductsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
