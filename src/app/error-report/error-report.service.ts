import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';

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
