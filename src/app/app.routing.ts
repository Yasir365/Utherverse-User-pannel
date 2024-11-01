import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RoutingService } from './services/routing.service';
const Routes: Routes = [

  {
    path: '',
    loadComponent: () => import('./landing-page/landing-page.component').then(m => m.LandingPageComponent)
  },
  {
    path: 'stake',
    loadComponent: () => import('./staking/staking.component').then(m => m.StakingComponent)
  },
  {
    path: 'pools',
    loadComponent: () => import('./pools/pools.component').then(m => m.PoolsComponent)
  },
  {
    path: 'pools',
    loadComponent: () => import('./pagenotfound/pagenotfound.component').then(m => m.PagenotfoundComponent)
  }
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(Routes)],
  exports: [RouterModule],
  providers: [RoutingService],
})
export class AppRouting { }
