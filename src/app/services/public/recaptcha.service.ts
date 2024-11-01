import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import constants from '../../constants/constants';

@Injectable({
  providedIn: 'root'
})
export class RecaptchaService {

  constructor(private http: HttpClient) {

  }

  verify_captcha_URL = `${constants.DOMAIN_URL}validate-recaptcha`

  verifyCaptcha(tokenObtained: string) {
    return this.http.post(this.verify_captcha_URL, { token: tokenObtained })
  }
  
}
