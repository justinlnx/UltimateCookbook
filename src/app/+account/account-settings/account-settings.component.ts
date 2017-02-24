import {Component} from '@angular/core';
import {AngularFire} from 'angularfire2';

@Component({
  selector: 'account-settings',
  templateUrl: './account-settings.component.html'
})
export class AccountSettingsComponent {

  constructor(
    private af: AngularFire
  ) {}

  onLogout() {
    this.af.auth.logout();
  }
}
