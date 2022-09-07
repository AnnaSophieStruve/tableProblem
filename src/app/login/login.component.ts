import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { Subject} from 'rxjs';
import {filter, take, takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  public loginValid = true;
  public username = '';
  public password = '';

  private destroySub$ = new Subject<void>();
  private readonly returnUrl: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {
    this.returnUrl = this.route.snapshot.queryParams.returnUrl || '/table';
  }

  public ngOnInit(): void {
    this.authService.isAuthenticated$.pipe(
      filter((isAuthenticated: boolean) => isAuthenticated),
      takeUntil(this.destroySub$)

    ).subscribe( _ => this.router.navigateByUrl(this.returnUrl));
  }
  public ngOnDestroy(): void {
    this.destroySub$.next();
  }

  public onSubmit(): void {
    this.loginValid = true;

    this.authService.login(this.username, this.password).pipe(
      take(1)
    ).subscribe({
      next: _ => {
        this.loginValid = true;
        console.log('Hello I am here  in the code');
        this.router.navigate(['table']);
      },
      error: _ => this.loginValid = false
    });
  }
}
