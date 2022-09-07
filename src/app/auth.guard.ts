import { Injectable } from '@angular/core';
import { Router, CanActivate, UrlTree } from '@angular/router';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  public canActivate(): Observable<boolean | UrlTree> {
    return this.authService.isAuthenticated$
      .pipe(
        map((s: boolean) => s ? true : this.router.parseUrl('/login'))
      );
  }
}
