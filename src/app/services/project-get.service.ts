import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, map, Observable, of, Subject } from 'rxjs';
import constants from '../constants/constants';


@Injectable({
  providedIn: 'root',
})
export class ProjectGetService {
  constructor(private http: HttpClient) { }
  url = `${constants.DOMAIN_URL}`
  public footerImage: any;
  public logoImage: any;
  public pdfContent: any;
  private subject = new Subject<any>();
  private pdfSubject = new Subject<any>();
  private slug = new Subject<any>();
  private currencyValue = new Subject<any>();
  private network = new Subject<any>();
  user = JSON.parse(sessionStorage.getItem('user'));
  projectName = sessionStorage.getItem('project')
  projectID = sessionStorage.getItem('project_id');
  setLogoImage(logo_image: any, footer_image: any, facebook_link: any, instagram_link: any, linkedin_link: any, twitter_link: any, youtube_link: any, telegram_link: any, discord_link: any, footer_text: any) {
    this.subject.next({
      logoImg: logo_image,
      footerImg: footer_image,
      facebookLink: facebook_link,
      instagramLink: instagram_link,
      linkedinLink: linkedin_link,
      twitterLink: twitter_link,
      youtubeLink: youtube_link,
      telegramLink: telegram_link,
      discordLink: discord_link,
      footerText: footer_text
    });
  }
  getLogoImage(): Observable<any> {
    return this.subject.asObservable();
  }

  setSlug(slug: any) {
    // this.slug.next({ 
    //   projectSlug: slug
    // });
    this.slug.next({
      projectSlug: slug
    });
  }

  getSlug(): Observable<any> {
    return this.slug.asObservable();
  }

  setPdfContent(pdf: any) {
    this.pdfSubject.next({
      // pdfContent: content,
      // pdfContent2: content2,
      pdf: pdf
    });
  }

  getPdfContent(): Observable<any> {
    return this.pdfSubject.asObservable();
  }

  setNetwork(net: any) {
    this.network.next({
      network: net
    });
  }

  getNetwork(): Observable<any> {
    return this.network.asObservable();
  }

  getOneProject(value: any) {
    console.log('VALUE::', value)
    return this.http.get(value);
  }

  getUsdtPriceIntoBNB(body: any) {
    // console.log(value)
    console.log('check url', body);

    return this.http.post(this.url + 'crypto/getCryptoRate', body);

  }
  createOrderTransaction(body: any) {
    this.projectID = constants.project_id;
    this.user = JSON.parse(sessionStorage.getItem('user'));
    let loggedIn = sessionStorage.getItem('loggedIn');
    console.log('check user', this.user);
    if (loggedIn != undefined) {
      body.email = (this.user.customer.email) ? this.user.customer.email : '';
    }
    else {
      body.email = '';
    }
    body.project_id = this.projectID;
    body.project_name = constants.PROJECT_NAME;
    body.project_slug = constants.PROJECT_NAME;
    console.log('checkout body before going to db>>>', this.user);
    return this.http.post(this.url + 'api/customer/transaction/createTransaction', body);
  }
  checkTokenAmount(body: any) {
    body.email = this.user.email
    body.project_id = constants.project_id;
    body.project_name = this.projectName
    body.project_slug = this.projectName
    return this.http.post(this.url + 'api/customer/transaction/checkTokenAmount', body);
  }


  CheckReferralExist(referral: any, slug: any) {
    // let projectSlug = sessionStorage.getItem('project');
    console.log('referall,user,slug', referral, this.user, slug);
    let body: any = {
      referral_id: referral,
      project_slug: slug
    }
    body.email = this.user.customer.email;
    body.project_id = this.projectID
    body.project_name = this.projectName
    body.project_slug = this.projectName
    return this.http.post(this.url + 'auth/customer/isRefferralExist', body)
  }

  getWalletAddresses(body: any) {
    body.email = this.user.email
    body.project_id = this.projectID
    body.project_name = this.projectName
    body.project_slug = this.projectName
    return this.http.post(this.url + 'api/customer/wallet/getWalletAddress', body)
  }

  getVerificationInvestor() {
    const userToken = sessionStorage.getItem('user_token');
    return this.http.get('https://www.verifyinvestor.com/api/v1/users', {
      headers: new HttpHeaders().set('Content-Type', 'application/json').set('Accept', 'application/json')
    })
  }

  sendEmailToCustomer(body: any) {
    body.email = this.user.email
    body.project_id = this.projectID
    body.project_name = this.projectName
    body.project_slug = this.projectName
    return this.http.post(this.url + 'api/customer/transaction/sendSaftDocumentToCustomer', body)
  }

  projectSubscription(body: any) {
    body.project_id = this.projectID
    body.project_name = this.projectName
    body.project_slug = this.projectName
    console.log('check out the body of project Subscribtion', body);

    return this.http.post(this.url + 'project/subscribe', body)
  }

  getAllCountriesAndDialCodes() {
    return this.http.get('https://countriesnow.space/api/v0.1/countries/codes')
  }

  getStateByCountry(body: {}) {
    return this.http.post('https://countriesnow.space/api/v0.1/countries/states', body)
  }

  getCitiesByState(body: {}) {
    return this.http.post('https://countriesnow.space/api/v0.1/countries/state/cities', body)
  }

  getCitiesByCountry(body: {}) {
    return this.http.post('https://countriesnow.space/api/v0.1/countries/cities', body)
  }

  checkTransactionNetwork(body: any) {
    body.email = this.user.email
    body.project_id = this.projectID
    body.project_name = this.projectName
    body.project_slug = this.projectName
    return this.http.post(this.url + 'api/customer/checkNetworkType', body)
  }

  updateOrderTransaction(body: any) {
    this.projectID = sessionStorage.getItem('project_id');
    this.user = JSON.parse(sessionStorage.getItem('user'));
    let loggedIn = sessionStorage.getItem('loggedIn');
    if (loggedIn != undefined) {
      body.email = (this.user.customer.email) ? this.user.customer.email : '';
    }
    else {
      body.email = '';
    }
    body.project_id = constants.project_id
    body.project_name = constants.PROJECT_NAME
    body.project_slug = constants.PROJECT_NAME
    console.log('check body in update trxns', body);
    return this.http.post(this.url + 'api/customer/transaction/updateTransaction', body);
  }
  getAllLevelAffiliates(body: any) {
    body.email = this.user.customer.email;
    body.project_id = constants.project_id
    body.project_name = this.projectName
    body.project_slug = this.projectName
    console.log('here is body in getAFFiliates', body);
    return this.http.post(this.url + 'api/customer/getAffiliates', body)
  }

  getManualTransactionsOfCustomer(body: {}) {
    return this.http.post(this.url + 'api/customer/getManualTransactions', body, {
      headers: new HttpHeaders().set('Authorization', `Bearer ${this.user.token}`)
    })
  }
  // workiiing on this
  sendEmailAfterTransaction(projectID: any, amount: any) {
    const email = this.user.email
    const project_id = constants.project_id
    const project_name = this.projectName
    const project_slug = this.projectName
    return this.http.post(this.url + 'api/customer/sendEmailOnTransaction', { projectID, amount })
  }

}
