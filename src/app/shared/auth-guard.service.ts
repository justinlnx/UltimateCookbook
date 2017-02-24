import {Injectable} from '@angular/core';
import {CanActivate} from '@angular/router';

import {AngularFire} from 'angularfire2';

@Injectable()
export class AuthGuardService implements CanActivate {
  constructor(
    private af: AngularFire
  ) {}

  canActivate() {
    let authState = this.af.auth.getAuth();

    return true;
  }
}
