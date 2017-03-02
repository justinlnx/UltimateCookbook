import {Component, OnDestroy, OnInit} from '@angular/core';
import {MdSnackBar} from '@angular/material';
import {Subscription} from 'rxjs/Subscription';

import {ErrorReportService} from './error-report.service';


@Component({selector: 'error-report', template: ``})
export class ErrorReportComponent implements OnInit, OnDestroy {
  private errorReportSubscription: Subscription;

  constructor(private ers: ErrorReportService, private snackBar: MdSnackBar) {}

  public ngOnInit(): void {
    this.subscribeToErrorReport();
  }

  public ngOnDestroy(): void {
    this.unsubscribeToErrorReport();
  }

  private subscribeToErrorReport(): void {
    this.errorReportSubscription = this.ers.asObservable().subscribe((nextErrorMessage: string) => {
      if (nextErrorMessage.length !== 0) {
        this.openSnackbar(nextErrorMessage);
      }
    });
  }

  private unsubscribeToErrorReport(): void {
    this.errorReportSubscription.unsubscribe();
  }

  private openSnackbar(errorMessage: string): void {
    let snackBarRef = this.snackBar.open(errorMessage, 'Close');

    snackBarRef.onAction().subscribe(() => {
      snackBarRef.dismiss();
    });
  }
}
