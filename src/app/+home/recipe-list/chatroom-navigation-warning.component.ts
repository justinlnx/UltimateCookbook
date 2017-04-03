import {Component} from '@angular/core';

@Component({
  selector: 'chatroom-navigation-warning',
  template: `
  <h1 md-dialog-title><md-icon>warning</md-icon></h1>
  <div md-dialog-content>Sign in to chat with authors about their amazing recipes!</div>
  `,
  styleUrls: ['./chatroom-navigation-warning.component.scss']
})
export class ChatroomNavigationWarningComponent {
}
