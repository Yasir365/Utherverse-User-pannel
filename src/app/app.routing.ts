import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RoutingService } from './services/routing.service';
const Routes: Routes = [

  {
    path: '',
    loadComponent: () => import('./home/home.component').then(m => m.HomeComponent)
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
    path: '**',
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
