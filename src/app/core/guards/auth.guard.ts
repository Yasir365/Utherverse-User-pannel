import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import constants from 'src/app/constants/constants';

export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): Observable<boolean> => {
  const authService = inject(AuthService);
  const router = inject(Router);
  // Extract the 'id' query parameter from the route
  const id = route.queryParamMap.get('id');
  // Only proceed if the 'id' parameter is present
  if (id) {
    return authService.checkSession(id).pipe(
      map(response => {
        console.log('check response for check sessions', response);

        if (response && response.success) { // Adjust this condition based on your API response
          // Set user in session storage
          sessionStorage.setItem('loggedIn', 'true');
          const { token, customer, ...others } = response;
          console.log('check response for check sessions', customer, token);
          sessionStorage.setItem('user', JSON.stringify({ token: token, customer: customer }));
          sessionStorage.setItem('projectID', JSON.stringify(response.customer.project_id));
          return true;
        } else {
          // Navigate to login page or another route if needed
          router.navigate(['']);
          return false;
        }
      }),
      catchError((error) => {
        console.error('AuthGuard Error:', error);
        router.navigate(['']);
        return of(false);
      })
    );
  } else {
    console.error('Query Parameter ID is missing');
    router.navigate(['']);
    return of(false);
  }
};
