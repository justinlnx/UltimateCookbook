import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';

/**
 * Error Report Service
 *
 * To send an error message, simply call send(message). A snack bar will pop up on the bottom of the
 * screen with a dismiss button.
 */
@Injectable()
export class ErrorReportService {
  private errorReporter: Subject<string>;

  constructor() {
    this.errorReporter = new Subject<string>();
  }

  public send(message: string) {
    this.errorReporter.next(message);
  }

  public asObservable(): Observable<string> {
    return this.errorReporter.asObservable();
  }
}
