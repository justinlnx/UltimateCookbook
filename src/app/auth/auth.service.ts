import {Injectable} from '@angular/core';
import {AngularFire, AuthMethods, AuthProviders, FirebaseAuthState} from 'angularfire2';
import * as firebase from 'firebase';

import {ErrorReportService} from '../error-report';

@Injectable()
export class AuthService {
  constructor(public af: AngularFire, public errorReportService: ErrorReportService) {}

  public login(email: string, password: string): void {
    this.af.auth
        .login({email, password}, {provider: AuthProviders.Password, method: AuthMethods.Password})
        .then(
            (state) => {
              console.log(state);
            },
            (err) => {
              this.errorReportService.send(err.message);
            });
  }

  public createUser(email: string, password: string): void {
    this.af.auth.createUser({email, password})
        .then(
            (state) => {
              console.log(`User created: ${email}, ${password}`);
            },
            (err) => {
              this.errorReportService.send(err.message);
            });
  }
}
