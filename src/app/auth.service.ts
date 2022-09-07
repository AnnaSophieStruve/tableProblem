import { Injectable, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthTransaction, OktaAuth } from '@okta/okta-auth-js';
import {BehaviorSubject, from, Observable} from 'rxjs';
import {catchError, map, tap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService implements OnDestroy {

  private authSub$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public get isAuthenticated$(): Observable<boolean> {
    console.log('Succesfully');
    return this.authSub$.asObservable();
  }

  constructor(private router: Router, private authClient: OktaAuth) {
    this.authClient.session.exists().then(exists => this.authSub$.next(exists));
  }

  public ngOnDestroy(): void {
    this.authSub$.next(false);
    this.authSub$.complete();
  }

  public login(username: string, password: string): Observable<void> {
    console.log('login ', username, );
    return from(this.authClient.signInWithCredentials({username, password})).pipe(
      map((t: AuthTransaction) => this.handleSignInResponse(t))
    );
  }

  public logout(redirect: string): Observable<void> {
    console.log('logout');
    return from(this.authClient.signOut()).pipe(
      tap( _ => (this.authSub$.next(false), this.router.navigate([redirect]))),
      catchError(err => {
        console.error(err);
        throw new Error('Unable to sign out');
      })
    );
  }

  private handleSignInResponse(transaction: AuthTransaction): void {
    console.log('handleSignInResponse');
    if (transaction.status !== 'SUCCESS') {
      throw new Error(`We cannot handle the ${transaction.status} status`);
    }

    this.authSub$.next(true);
    this.authClient.session.setCookieAndRedirect(transaction.sessionToken);
  }
}
