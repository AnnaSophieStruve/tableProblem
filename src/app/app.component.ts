import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { AuthService } from './auth.service';
import {take, takeUntil} from 'rxjs/operators';
import { OktaAuth } from '@okta/okta-auth-js';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'app';
  public isAuthenticated = false;
  private destroySub$ = new Subject<void>();

  constructor(private authService: AuthService) { }

  public ngOnInit(): void {
    this.authService.isAuthenticated$.pipe(
      takeUntil(this.destroySub$)
    ).subscribe((isAuthenticated: boolean) => this.isAuthenticated = isAuthenticated);
  }

  public logout(): void {
    this.authService.logout('/').pipe(take(1));
  }
}
