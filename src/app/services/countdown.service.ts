import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { BehaviorSubject, Observable } from 'rxjs';

interface Time {
  minutes: number;
  seconds: number;
}

@Injectable({
  providedIn: 'root',
})
export class CountdownService {
  private countdownInterval: any;
  minutes: number = 0;
  seconds: number = 0;
  private set_additional_time_val = new BehaviorSubject<Time>({ minutes: 0, seconds: 0 });
  private is_offer_exist = new BehaviorSubject<boolean>(true);
  public is_offer_exist_response$ = this.is_offer_exist.asObservable();

  constructor(private cookieService: CookieService, private http: HttpClient) { }

  startCountdown(minutes: number) {
    console.log('startCountdown minutes called ')
    this.is_offer_exist.next(true);
    const endTime = new Date().getTime() + minutes * 60 * 1000;
    const expirationDate = new Date(endTime);
    expirationDate.setMonth(expirationDate.getMonth() + 1);
    this.cookieService.set('countdownEndTime', endTime.toString(), expirationDate);
    this.updateCountdown();
  }


  checkAndStartCountdown(apiUrl: string) {

    const endTime = this.cookieService.get('countdownEndTime');
    if (endTime) {
      this.updateCountdown();
    } else {
      this.getInitialTimeFromAPI(apiUrl).subscribe((resp: any) => {
        this.startCountdown(Number(resp.offer.time));
      })
    }

  }


  private getInitialTimeFromAPI(apiUrl: string): Observable<any> {
    return this.http.get<any>(apiUrl);
  }

  private updateCountdown() {
    const endTime = parseInt(this.cookieService.get('countdownEndTime'), 10);
    if (isNaN(endTime)) return;

    this.countdownInterval = setInterval(() => {
      const now = new Date().getTime();
      const distance = endTime - now;

      if (distance < 0) {
        clearInterval(this.countdownInterval);
        this.cookieService.set('countdownEndTime', '0');
        this.is_offer_exist.next(false);
      } else {
        this.minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        this.seconds = Math.floor((distance % (1000 * 60)) / 1000);
        // if (this.seconds <= 0 && this.minutes <= 0) {


        // }
      }
    }, 1000);
  }


  set_additional_time(time: Time) {
    this.set_additional_time_val.next(time);
  }

  get_additional_time(): Observable<Time> {
    return this.set_additional_time_val.asObservable();
  }
}
