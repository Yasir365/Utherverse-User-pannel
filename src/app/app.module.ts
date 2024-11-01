import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { FrontendModule } from './frontend/frontend.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TokenInterceptor } from './core/interceptors/token.interceptor';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgApexchartsModule } from 'ng-apexcharts';
import { AngularSignaturePadModule } from '@almothafar/angular-signature-pad';
import { BnNgIdleService } from 'bn-ng-idle';

import { NguCarouselModule } from '@ngu/carousel';
import { AddCommasDirective } from './add-commas.directive';
import { CountdownService } from './services/countdown.service';
import { CookieService } from 'ngx-cookie-service';
import { AuthInterceptor } from './services/interceptor.service';
import { AppRouting } from './app.routing';

@NgModule({
  declarations: [AppComponent, AddCommasDirective],
  imports: [
    BrowserModule,
    FrontendModule,
    AppRouting,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      positionClass: 'toast-top-right',
      timeOut: 5000,
      progressBar: true,
      preventDuplicates: true,
    }),
    NgApexchartsModule,
    AngularSignaturePadModule,
    NguCarouselModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    BnNgIdleService,
    CountdownService,
    CookieService,
  ],

  bootstrap: [AppComponent],
})
export class AppModule { }
