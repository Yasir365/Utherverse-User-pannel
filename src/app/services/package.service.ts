import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import constants from '../constants/constants';
@Injectable({
  providedIn: 'root',
})
export default class PackageService {
  constructor(private http: HttpClient) { }
  getPackages() {
    return this.http.get(`${constants.DOMAIN_URL}packages`);
  }
}
