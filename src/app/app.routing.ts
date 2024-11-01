import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PagenotfoundComponent } from './frontend/pagenotfound/pagenotfound.component';
import { RoutingService } from './services/routing.service';
import { LandingPageComponent } from './frontend/landing-page/landing-page.component';
import { StakingComponent } from './frontend/staking/staking.component';
import { PoolsComponent } from './frontend/pools/pools.component';
const Routes: Routes = [
  {
    path: '',
    component: LandingPageComponent,
  },
  {
    path: 'pools',
    component: PoolsComponent,
  },
  {
    path: 'stake',
    component: StakingComponent,
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
