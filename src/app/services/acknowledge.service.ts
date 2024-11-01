import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import constants from '../constants/constants';

@Injectable({
  providedIn: 'root'
})
export class AcknowledgeService {

  url = `${constants.DOMAIN_URL}`;
  user = JSON.parse(sessionStorage.getItem('user'));
  // user: any;

  constructor(private http: HttpClient) { }

  addStatus(status: string) {
    return this.http.post(this.url + 'api/customer/accredited-acknowledge', { acknowledgement_status: status },
      { headers: new HttpHeaders().set('Authorization', `Bearer ${this.user.token}`) })
  }

  getUser() {
    return this.http.get(this.url + 'auth/customer/readProfile',
      { headers: new HttpHeaders().set('Authorization', `Bearer ${this.user.token}`) })
  }
}
