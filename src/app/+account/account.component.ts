import {AfterViewInit, Component, OnDestroy} from '@angular/core';
import {AngularFire} from 'angularfire2';

@Component({selector: 'account', templateUrl: './account.component.html'})
export class AccountComponent implements AfterViewInit, OnDestroy {
  public userLoggedIn: boolean;

  constructor(private af: AngularFire) {}

  public ngAfterViewInit() {
    this.userLoggedIn = false;
    this.af.auth.subscribe((next) => {
      this.userLoggedIn = next != null;
    });
  }

  public ngOnDestroy() {
    this.af.auth.unsubscribe();
  }
}
