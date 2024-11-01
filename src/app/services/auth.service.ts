import { Injectable } from '@angular/core';
import { from, Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import constants from '../constants/constants';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${constants.DOMAIN_URL}auth/customer/sessionLogin`;

  constructor() { }

  checkSession(user_id: string): Observable<any> {
    let body = {
      _id: user_id
    };
    console.log('check body=======>', body);

    return new Observable(observer => {
      setTimeout(() => {
        fetch(this.apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(body)
        }).then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        }).then(data => {
          observer.next(data);
          observer.complete();
        }).catch(error => {
          observer.error(error);
        });
      }, 1000); // Delay of 1 second (1000 milliseconds)
    }).pipe(
      catchError((error: any) => {
        console.error('Error occurred:', error);
        return throwError(() => new Error('An error occurred while checking session: ' + error.message));
      })
    );
  }
}
