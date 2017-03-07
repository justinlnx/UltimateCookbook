import {AfterViewInit, Component, OnDestroy} from '@angular/core';
import {AngularFire} from 'angularfire2';
import {ErrorReportService} from '../error-report';

@Component({selector: 'account', templateUrl: './account.component.html'})
export class AccountComponent implements AfterViewInit, OnDestroy {
  public userLoggedIn: boolean;

  constructor(private af: AngularFire, private errorReportService: ErrorReportService) {}

  public ngAfterViewInit() {
    this.userLoggedIn = false;
    this.af.auth.subscribe(
        (next) => {
          this.userLoggedIn = next != null;
        },
        (err) => {
          this.errorReportService.send(err);
        });
  }

  public ngOnDestroy() {
    this.af.auth.unsubscribe();
  }
}
