import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http'
import {TokenInterceptor} from './shared/classes/token.interceptor'

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { AuthLayoutComponent } from './shared/layouts/auth-layout/auth-layout.component';
import { SiteLayoutComponent } from './shared/layouts/site-layout/site-layout.component';
import { RegistrationPageComponent } from './registration-page/registration-page.component';
import {AuthService} from './shared/services/auth.service';
import { OverviewPageComponent } from './overview-page/overview-page.component';
import { AnalyticsPageComponent } from './analytics-page/analytics-page.component';
import { HistoryPageComponent } from './history-page/history-page.component';
import { NewOrderPageComponent } from './new-order-page/new-order-page.component';
import { ProductsPageComponent } from './products-page/products-page.component';
import { LoaderComponent } from './shared/components/loader/loader.component';
import { ProductFormPageComponent } from './products-page/product-form-page/product-form-page.component';
import { PositionsFormComponent } from './products-page/product-form-page/positions-form/positions-form.component';



@NgModule({
  declarations: [
    AppComponent,
    LoginPageComponent,
    AuthLayoutComponent,
    SiteLayoutComponent,
    RegistrationPageComponent,
    OverviewPageComponent,
    AnalyticsPageComponent,
    HistoryPageComponent,
    NewOrderPageComponent,
    ProductsPageComponent,
    LoaderComponent,
    ProductFormPageComponent,
    PositionsFormComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [
    AuthService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    }
  ],


  bootstrap: [AppComponent]
})
export class AppModule { }
