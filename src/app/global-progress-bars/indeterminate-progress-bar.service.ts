import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';

@Injectable()
export class IndeterminateProgressBarService {
  private loadingQueue = 0;
  private loadingSubject = new Subject<boolean>();

  public addTask(): void {
    this.loadingQueue += 1;

    this.loadingSubject.next(true);
  }

  public taskFinished(): void {
    if (this.loadingQueue > 0) {
      this.loadingQueue -= 1;
    }

    if (this.loadingQueue === 0) {
      this.loadingSubject.next(false);
    }
  }

  public loadingObservable(): Observable<boolean> {
    return this.loadingSubject.asObservable();
  }
}
