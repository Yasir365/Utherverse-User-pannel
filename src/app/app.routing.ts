import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RoutingService } from './services/routing.service';
const Routes: Routes = [

  {
    path: '',
    loadComponent: () => import('./home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'claim',
    loadComponent: () => import('./claim/claim.component').then(m => m.claimComponent)
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
