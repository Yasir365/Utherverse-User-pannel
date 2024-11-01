import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PagenotfoundComponent } from './pagenotfound/pagenotfound.component';
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgApexchartsModule } from 'ng-apexcharts';
import { AngularSignaturePadModule } from '@almothafar/angular-signature-pad';
import { NguCarouselModule } from '@ngu/carousel';
import { StringformationPipe } from '../core/pipes/stringformation.pipe';
import { NoLeadingZeroPipe } from '../core/pipes/no-leading-zero.pipe';
import { ModifyAddressPipe } from '../core/pipes/modify-address.pipe';
import { NumberCommaDirective } from '../number-comma.directive';
import { ConvertToIntPipe } from '../core/pipes/convert-to-int.pipe';
import { NgImageSliderModule } from 'ng-image-slider';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { DecryptCryptoPipe } from '../services/decrypt-crypto.pipe';
import { TruncatePipe } from '../services/truncate.pipe';
import { StakingPoolComponent } from './staking-pool/staking-pool.component';
import { NgxPaginationModule } from 'ngx-pagination';

@NgModule({
  declarations: [
    PagenotfoundComponent,
    NavbarComponent,
    FooterComponent,
    StringformationPipe,
    NoLeadingZeroPipe,
    ModifyAddressPipe,
    NumberCommaDirective,
    ConvertToIntPipe,
    LandingPageComponent,
    DecryptCryptoPipe,
    TruncatePipe,
    StakingPoolComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgApexchartsModule,
    AngularSignaturePadModule,
    NguCarouselModule,
    NgImageSliderModule,
    NgxPaginationModule
  ],
  exports: [NumberCommaDirective],
  providers: [DecryptCryptoPipe],
})
export class FrontendModule { }
