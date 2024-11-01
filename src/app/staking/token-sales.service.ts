import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import constants from 'src/app/constants/constants';

@Injectable({
  providedIn: 'root'
})
export class TokenSalesService {

  form_images: any = [];
  offers_response: any;
  hours: number = 0;
  minutes: number = 0;
  seconds: number = 0;
  constructor(
    private http:HttpClient
  ) { }

  formatTimeCounter(minutes: number) {
    const totalSeconds = minutes * 60;
    const hours = Math.floor(totalSeconds / 3600);
    const remainingSecondsAfterHours = totalSeconds % 3600;
    const mins = Math.floor(remainingSecondsAfterHours / 60);
    const secs = remainingSecondsAfterHours % 60;
    this.hours = hours;
    this.minutes = mins;
    this.seconds = secs;
    return {
      hours: hours,
      minutes: mins,
      seconds: secs
    };
  }
  offers_value(): Observable<any> {
    return this.http.get<any>(constants.DOMAIN_URL+'offer')
  }


  get_the_rounds(url: any ,body: {}): Observable<any> {
    return this.http.post<any>(url, body)
  }
  
}
