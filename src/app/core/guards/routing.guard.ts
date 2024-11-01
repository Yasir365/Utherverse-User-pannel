import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { RoutingService } from 'src/app/services/routing.service';

@Injectable({
  providedIn: 'root'
})
export class RoutingGuard implements CanActivate {
  constructor(private routing: RoutingService, private router: Router, private toastr: ToastrService) { }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    console.log("inside routing gurard", this.routing.isLoggedIn());
    if (this.routing.isLoggedIn()) {
      return true;
    }
    this.toastr.error('You don\'t have permission to view this page. First Login Your Self');
    this.router.navigateByUrl('');
    return false;
  }

}
