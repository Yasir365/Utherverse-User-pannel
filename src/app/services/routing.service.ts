import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RoutingService {

  constructor() { }

  isLoggedIn(): boolean {
    if (sessionStorage.getItem('user_token') != null) {
      return true
    }
    else {
      return false;
    }

  }

}
