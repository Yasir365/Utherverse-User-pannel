import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PagenotfoundComponent } from './frontend/pagenotfound/pagenotfound.component';
import { RoutingService } from './services/routing.service';
import { LandingPageComponent } from './frontend/landing-page/landing-page.component';
import { StakingPoolComponent } from './frontend/staking-pool/staking-pool.component';
const Routes: Routes = [
  {
    path: '',
    component: LandingPageComponent,
  },
  {
    path: 'stake',
    component: StakingPoolComponent,
  },
  {
    path: '**',
    component: PagenotfoundComponent,
  },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(Routes)],
  exports: [RouterModule],
  providers: [RoutingService],
})
export class AppRouting { }
