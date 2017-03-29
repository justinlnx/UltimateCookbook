import {Component} from '@angular/core';

@Component({
  selector: 'login-warning',
  template: `
  <div class="warning-area">
    <md-icon>account_circle</md-icon>
    <div>Please sign in to view the content.</div>
  </div>
  `,
  styleUrls: ['./login-warning.component.scss']
})
export class LoginWarningComponent {
}
