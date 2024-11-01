import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import constants from 'src/app/constants/constants';

@Injectable({
  providedIn: 'root',
})
export class PublicService {
  // public ipfi_url = 'https://api.ipify.org?format=json';
  public user_country: string;
  public ipfi_url = 'https://api.ipify.org?format=json';
  public headers = new HttpHeaders({
    accept: 'application/json',
    'x-cg-demo-api-key': 'CG-BKjQaEcmqRa6pRD9YAtwgfjL',
  });
  // const options = {
  //   method: 'GET',
  //   headers: { accept: 'application/json', 'x-cg-demo-api-key': 'CG-U1stBd66s83CJi2Bv2A3DZE8' }
  // };
  urlGetStatus = `${constants.DOMAIN_URL}getStatus`;
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
    { countryName: 'Canada', countryCode: 'CA' },
  ];

  constructor(private http: HttpClient) {}

  _getStatus() {
    return this.http.get(this.urlGetStatus);
  }
  _getSolPrice() {
    let sol_api =
      'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=solana';
    return this.http.get(sol_api, { headers: this.headers });
  }
  _getDAIPriceInUsd() {
    let dai_api =
      'https://api.coingecko.com/api/v3/simple/token_price/ethereum?contract_addresses=0x6B175474E89094C44Da98b954EedeAC495271d0F&vs_currencies=usd';
    return this.http.get(dai_api, { headers: this.headers });
  }
  _setAffiliateCount(referral_id: string, source: string = '') {
    
    let params = new HttpParams();
    params = params.append('referral_id', referral_id);
    let url = `${constants.DOMAIN_URL}updateAffiliateCount`;
    console.log('here is the url', url);

    return this.http.post(url, {
      referral_id: referral_id,
      source: source,
    });
  }
  async checkUserLocation() {
    fetch(this.ipfi_url, {
      method: 'GET',
    })
      .then((res) => res.json())
      .then((data) => {
        let ip_addres = data.ip;
        // ip_addres = '188.241.176.133';
        let ip_info_url = `https://ipinfo.io/${ip_addres}?token=${constants.ipinfo_token}`;
        fetch(ip_info_url, {
          method: 'GET',
        })
          .then((res) => res.json())
          .then((user: any) => {
            let c_code = user.country;
            const country = this.package_purchase_users.find(
              (country: any) => country.countryCode === c_code
            );
            if (country) {
              console.log('cntry', country);

              this.user_country = country.countryName;

              sessionStorage.setItem('user_countery', this.user_country);
              // return this.user_country
            } else {
              console.log(`Country with code ${c_code} not found.`);
              // return false;
            }
          });
        if (this.user_country) {
          return this.user_country;
        } else {
          return false;
        }
      });
  }
}
