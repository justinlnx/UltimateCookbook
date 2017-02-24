import {
  Component,
  AfterViewInit,
  OnDestroy
} from '@angular/core';
import { AngularFire } from 'angularfire2';

@Component({
  selector: 'account',
  templateUrl: './account.component.html'
})
export class AccountComponent implements AfterViewInit {

  private userLoggedIn: boolean;

  constructor(
    private af: AngularFire
  ) {}

  ngAfterViewInit() {
    this.userLoggedIn = false;
    this.af.auth.subscribe((next) => {
      this.userLoggedIn = next != null;
    });
  }

  ngOnDestroy() {
    this.af.auth.unsubscribe();
  }
}
