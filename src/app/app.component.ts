import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { AuthService } from './auth.service';
import {take, takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  public title = 'Tic Tac Toe';
  public isAuthenticated = false;
  private destroySub$ = new Subject<void>();

  constructor(private authService: AuthService) { }

  public ngOnInit(): void {
    this.authService.isAuthenticated$.pipe(
      takeUntil(this.destroySub$)
    ).subscribe((isAuthenticated: boolean) => this.isAuthenticated = isAuthenticated);
  }

  public ngOnDestroy(): void {
    this.destroySub$.next();
  }

  public logout(): void {
    this.authService.logout('/').pipe(take(1));
  }
}
