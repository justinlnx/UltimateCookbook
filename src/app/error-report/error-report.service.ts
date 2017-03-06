import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';

const GENERIC_ERROR_MESSAGE = 'Something went wrong.';

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

  public send(message: any) {
    let actualMessage: string = '';

    if (typeof message === 'string') {
      actualMessage = message;
    } else if (message instanceof Error) {
      actualMessage = message.message;
    } else {
      actualMessage = GENERIC_ERROR_MESSAGE;

      // for developer to track bug
      console.error(message);
    }
    this.errorReporter.next(actualMessage);
  }

  public asObservable(): Observable<string> {
    return this.errorReporter.asObservable();
  }
}
