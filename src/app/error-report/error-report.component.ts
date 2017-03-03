import {Component, OnDestroy, OnInit} from '@angular/core';
import {MdSnackBar} from '@angular/material';
import {Subscription} from 'rxjs/Subscription';

import {ErrorReportService} from './error-report.service';

@Component({selector: 'error-report', template: ``})
export class ErrorReportComponent implements OnInit, OnDestroy {
  private errorReportSubscription: Subscription;

  constructor(private errorReportService: ErrorReportService, private snackBar: MdSnackBar) {}

  public ngOnInit(): void {
    this.subscribeToErrorReport();
  }

  public ngOnDestroy(): void {
    this.unsubscribeToErrorReport();
  }

  private subscribeToErrorReport(): void {
    this.errorReportSubscription =
        this.errorReportService.asObservable().subscribe((nextErrorMessage: string) => {
          if (nextErrorMessage.length !== 0) {
            this.openSnackbar(nextErrorMessage);
          }
        });
  }

  private unsubscribeToErrorReport(): void {
    this.errorReportSubscription.unsubscribe();
  }

  private openSnackbar(errorMessage: string): void {
    this.snackBar.open(errorMessage, null, {duration: 1500});
  }
}
