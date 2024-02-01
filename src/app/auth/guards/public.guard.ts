import { Injectable } from '@angular/core';
import { AuthService } from '../services/auth.service';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanMatch,
  Route,
  Router,
  UrlSegment,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable, map, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PublicGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  private checkAuthStatus(url?: string): boolean | Observable<boolean> {
    return this.authService.checkAuthentication().pipe(
      tap((isAuthenticated) => {
        if (isAuthenticated) {
          return this.router.navigateByUrl('/');
        }
        return;
      }),
      map((isAuthenticated) => !isAuthenticated)
    );
  }

  canMatch(
    route: Route,
    segments: UrlSegment[]
  ): boolean | Observable<boolean> {
    return this.checkAuthStatus();
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | Observable<boolean> {
    return this.checkAuthStatus(state.url);
  }
}
