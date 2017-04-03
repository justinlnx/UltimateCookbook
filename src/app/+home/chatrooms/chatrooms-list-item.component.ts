import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
import {Router} from '@angular/router';

import {ApiService, Chatroom, Message, User} from '../../api';

@Component({
  selector: 'chatrooms-list-item',
  template: `
  <md-list-item (click)="showDetails(chatroom)">
    <img md-list-avatar [src]="otherUserAvatarUrl" alt="avatar">
    <h4 md-line>{{otherUser?.name}}</h4>
    <p md-line class="message-line">{{latestMessageContent}}</p>
  </md-list-item>
  <md-divider></md-divider>`,
  styleUrls: ['./chatrooms-list-item.component.scss']
})
export class ChatroomsListItemComponent implements OnChanges {
  @Input() public chatroom: Chatroom;
  @Input() public currentUser: User;

  public otherUser: User;
  public otherUserAvatarUrl: SafeResourceUrl;

  get latestMessage(): Message {
    if (!this.chatroom) {
      return null;
    }
    let messages = this.chatroom.messages;

    if (messages.length === 0) {
      return null;
    }

    return messages[messages.length - 1];
  }

  get latestMessageContent(): string {
    let latestMessage = this.latestMessage;

    if (!latestMessage) {
      return '';
    }

    return latestMessage.message;
  }

  constructor(
      public apiService: ApiService, public domSanitizer: DomSanitizer, public router: Router) {}

  public ngOnChanges(changes: SimpleChanges) {
    this.updateUserObservable();
  }

  public showDetails(chatroom: Chatroom) {
    this.router.navigateByUrl(`/home/chatroom/${chatroom.$key}`);
  }

  private updateUserObservable() {
    if (!this.chatroom || !this.currentUser) {
      return;
    }

    let userIds = this.chatroom.users;

    if (userIds.length !== 2) {
      throw new Error('Invalid chatroom, not enough users.');
    }

    let otherUserId = userIds.find((userId) => {
      return userId !== this.currentUser.id;
    });

    this.apiService.getUserInfoObservable(otherUserId).subscribe((user) => {
      this.otherUser = user;
      this.updateBypassAvatarUrl();
    });
  }

  private updateBypassAvatarUrl() {
    this.otherUserAvatarUrl =
        this.domSanitizer.bypassSecurityTrustResourceUrl(this.otherUser.avatar);
  }
}
