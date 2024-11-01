import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, map } from 'rxjs';
import constants from '../constants/constants';
import { PhantomWalletServiceService } from './phantom-wallet.service.service';
@Injectable({
  providedIn: 'root',
})
export class LoginService {
  user: any;
  url = `${constants.DOMAIN_URL}api/customer/`;
  loginUrl = `${constants.DOMAIN_URL}auth/customer/`;
  projectID: string = '62c70a3bd031e020964c2ef0';
  affiliateUsersData: any;
  public isRefferralTrue: boolean;
  affiliateId: any;
  projectName: string = 'ido'
  // sessionStorage.getItem('project')
  private loggedIn = new Subject<any>();
  constructor(
    private http: HttpClient,
    private phantomWalletService: PhantomWalletServiceService
  ) {
    this.phantomWalletService.checkWalletConnection();
    this.user = JSON.parse(sessionStorage.getItem('user'));
  }


  setLoggedIn(loggedin: boolean) {
    this.loggedIn.next({
      loggedIn: loggedin
    });
  }

  getLoggedIn(): Observable<any> {
    return this.loggedIn.asObservable();
  }
  getProjectId(id: any) {
    this.projectID = id;
  }

  login(body: any) {
    body.project_name = this.projectName
    body.project_slug = this.projectName
    body.project_id = this.projectID;
    return this.http.post(this.loginUrl + 'signin', body);
  }

  register(body: any) {
    body.project_id = this.projectID;
    body.project_name = this.projectName
    body.project_slug = this.projectName
    console.log('check url', this.loginUrl);
    return this.http.post(this.loginUrl + 'signup', body);
  }

  registerWithRefferal(body: any) {
    this.affiliateId = sessionStorage.getItem('affiliateId');
    body.project_id = this.projectID
    body.project_name = this.projectName
    body.project_slug = this.projectName
    console.log('registerWith referral', body);
    return this.http.post(
      this.loginUrl + `signup/?referral=${this.affiliateId}`,
      body
    );
  }
  checkVerifiedStatuses(body: any) {

    this.user = JSON.parse(sessionStorage.getItem('user'));
    body.email = this.user.email
    body.project_id = this.projectID
    body.project_name = this.projectName
    body.project_slug = this.projectName
    return this.http.post(this.loginUrl + 'checkStatus', body)
      .pipe(
        map(
          (resp: any) => {
            resp.data.isEmailVerified = true;
            resp.data.isKycApproved = true;
            resp.data.isPhoneVerified = true;
            return resp;
          })
      );
  }
  getAffiliatedUsers(body: any) {
    this.user = JSON.parse(sessionStorage.getItem('user'));
    console.log("check user", this.user);
    console.log("check user email", this.user.customer.email);
    body.email = this.user.customer.email
    body.project_id = this.projectID
    body.project_name = this.projectName
    body.project_slug = this.projectName;
    console.log("checkout body of getAffiliate users", body);
    return this.http.post(this.url + 'getAffiliateUsers', body);
  }

  getAffiliateUsersData(data: any) {
    this.affiliateUsersData = data;
    // console.log(this.affiliateUsersData)
  }

  viewCustomerTransaction(body: any) {
    // body.email=this?.user.email
    body.project_id = this?.projectID
    body.project_name = this?.projectName
    body.project_slug = this?.projectName
    return this.http.post(this.url + 'getTransactions', body);
  }

  CheckReferralTrue(referralCheck: any) {
    // console.log(referralCheck)
    this.isRefferralTrue = referralCheck;
  }

  sendOTP(body: any) {
    body.project_id = this.projectID
    body.project_name = this.projectName
    body.project_slug = this.projectName
    return this.http.post(this.loginUrl + 'sendOtp', body)
  }

  verifyCustomer(body: any) {
    // body.email=this.user.email
    body.project_id = this.projectID
    body.project_name = this.projectName
    body.project_slug = this.projectName
    return this.http.post(this.loginUrl + 'verifyCustomer', body)
  }

  reserveToken(body: any) {
    this.user = JSON.parse(sessionStorage.getItem('user'));
    body.email = this.user.email
    body.project_id = this.projectID
    body.project_name = this.projectName
    body.project_slug = this.projectName
    return this.http.post(this.url + 'reservedToken', body)
  }

  uploadAccreditedDoc(file: any, customer_id: any) {
    return this.http.post(this.loginUrl + 'uploadAccreditedPaper/' + customer_id, file)
  }

  forgetPassword(body: any) {
    body.project_id = this.projectID
    body.project_name = this.projectName
    body.project_slug = this.projectName
    let url = this.loginUrl + 'forgetPassword';
    console.log('checkout url on forget passwork', url);
    return this.http.post(url, body);

  }



}
