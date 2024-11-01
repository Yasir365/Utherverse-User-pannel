import { AfterViewInit, Component, OnInit } from '@angular/core';
import constants from './constants/constants';
import { LoginService } from './services/login.service';
import { ToastrService } from 'ngx-toastr';
import { BnNgIdleService } from 'bn-ng-idle';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CountdownService } from './services/countdown.service';
import { TokenSalesService } from './frontend/staking/token-sales.service';

@Component({
  selector: 'app-root',
  template: `<router-outlet></router-outlet>`,
})
export class AppComponent implements OnInit, AfterViewInit {
  constructor(
    private loginService: LoginService,
    private toastr: ToastrService,
    private bnIdle: BnNgIdleService,
    public tokens_sales: TokenSalesService,
    private http: HttpClient,
    public countdownService: CountdownService
  ) {
  }
  ngOnInit(): void {
    this.loginService.getLoggedIn().subscribe((resp: any) => {
      if (resp?.loggedIn == true) {
        this.autoLogout();
      }
    })

    if (JSON.parse(sessionStorage.getItem('loggedIn')) === true) {
      this.autoLogout();
    }

    let apiUrl = `${constants.DOMAIN_URL}offer`
    this.countdownService.checkAndStartCountdown(apiUrl);

    this.partners_images().subscribe((response: any) => {
      if (response.success) {
        this.tokens_sales.form_images = response.partners.map((item: any) => {
          return {
            ...item,
            logo: `${constants.DOMAIN_URL}/uploads/partner_logos/${item?.logo?.split('\\').pop()}`
          }
        })
      }
    })
  }



  partners_images(): Observable<any> {
    return this.http.get<any>(`${constants.DOMAIN_URL}partners`, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }




  ngAfterViewInit(): void {

  }

  autoLogout() {
    this.bnIdle.startWatching(1800).subscribe((res) => {
      if (res) {
        this.logout()
      }
    })
  }

  logout() {
    sessionStorage.removeItem('loggedIn');
    sessionStorage.removeItem('user_token');
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('projectID');
    sessionStorage.removeItem('short');
    sessionStorage.removeItem('address');
    sessionStorage.removeItem('balance');
    sessionStorage.removeItem('KYC');
    sessionStorage.removeItem('isEmailVerified')
    sessionStorage.removeItem('isPhoneVerified')
    sessionStorage.removeItem('is_accredited_paper_submitted')
    sessionStorage.removeItem('isAccreditedApproved')
    sessionStorage.removeItem('isKycApproved')
    this.toastr.success('Session Expired! Please Login Again');
    setTimeout(() => {
      window.location.href = constants.UTHERVERSE_URL;
    }, 700);
  }



  title = 'utherverse';
}
