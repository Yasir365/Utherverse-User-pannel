import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import constants from 'src/app/constants/constants';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { ThisReceiver } from '@angular/compiler';

@Injectable({
  providedIn: 'root'
})
export class CheckuseripGuard implements CanActivate {

  public cntry_code: string;
  constructor(private router: Router) {
    (
      () => {
        fetch(this.ipfi_url, {
          method: 'GET',
        })
          .then((res) => res.json())
          .then((data) => {
            let ip_addres = data.ip;
            // ip_addres = '188.241.176.133';
            let ip_info_url = `https://ipinfo.io/${ip_addres}?token=${constants.ipinfo_token}`
            fetch(ip_info_url, {
              method: 'GET'

            }).then((res) => res.json())
              .then(
                (
                  (user: any) => {
                    let c_code = user.country;
                    this.cntry_code = c_code;


                  }
                )
              )

          });
      }
    )
    // ()

  }
  public urlGetStatus = `${constants.DOMAIN_URL}getStatus`;
  private package_purchase_users: Array<any> = [
    { countryName: 'United States', countryCode: 'US' },
    { countryName: 'China', countryCode: 'CN' },
    { countryName: 'Nepal', countryCode: 'NP' },
    { countryName: 'Afghanistan', countryCode: 'AF' },
    { countryName: 'Bangladesh', countryCode: 'BD' },
    { countryName: 'Morocco', countryCode: 'MA' },
    { countryName: 'Algeria', countryCode: 'DZ' },
    { countryName: 'Egypt', countryCode: 'EG' },
    { countryName: 'Bolivia', countryCode: 'BO' },
    { countryName: 'Canada', countryCode: 'CA' }
  ];
  public ipfi_url = 'https://api.ipify.org?format=json';
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot):
    Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    let is_restricted = (sessionStorage.getItem('is_restricted')) ? sessionStorage.getItem('is_restricted') : null
    console.log('is_restricted', is_restricted);
    console.log('inseide the routing guard')
    if (is_restricted == 'true') {
      this.router.navigateByUrl('');
      return false;
    }
    else {
      return true;
    }

  }

}
