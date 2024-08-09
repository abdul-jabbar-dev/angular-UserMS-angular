import { AuthGuard } from './AuthGuard';
import { RequestService } from './services/request.service';
import { StoreService } from './services/store.service';
import { AuthService } from './services/auth.service';
import { AllProductsComponent } from './products/all-products/all-products.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
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
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
  ],
  providers: [RouteService, RouterLinkService, SupabaseService,AuthService,StoreService, RequestService,AuthGuard],
  bootstrap: [AppComponent],
})
export class AppModule {}
