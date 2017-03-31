import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
import {Message, User} from '../../api';

@Component({
  selector: 'chat-content',
  template: `
  <div class="chat-content" *ngIf="shouldDisplay()">
    <div *ngFor="let message of displayMessages" class="message-entry">
      <div *ngIf="isCurrentUser(message)" class="current-user">
        <div class="spacer"></div>
        <md-card>{{message.message}}</md-card>
        <img [src]="currentUserAvatarUrl" alt="avatar">
      </div>
      <div *ngIf="isOtherUser(message)" class="other-user">
        <img [src]="otherUserAvatarUrl" alt="avatar">
        <md-card>{{message.message}}</md-card>
      </div>
    </div>
  </div>
  `,
  styleUrls: ['./chat-content.component.scss']
})
export class ChatContentComponent implements OnChanges {
  @Input() public currentUser: User;
  @Input() public otherUser: User;
  @Input() public messages: Message[];

  public displayMessages: Message[];
  public currentUserAvatarUrl: SafeResourceUrl;
  public otherUserAvatarUrl: SafeResourceUrl;

  constructor(public domSanitizer: DomSanitizer) {}

  public ngOnChanges(changes: SimpleChanges) {
    if (changes['messages']) {
      this.appendNewMessages();
    }
    if (changes['currentUser']) {
      this.updateCurrentUserAvatarUrl();
    }
    if (changes['otherUser']) {
      this.updateOtherUserAvatarUrl();
    }
  }

  public shouldDisplay(): boolean {
    return !!this.currentUser && !!this.otherUser;
  }

  public isCurrentUser(message: Message): boolean {
    return message.sender === this.currentUser.id;
  }

  public isOtherUser(message: Message): boolean {
    return message.sender === this.otherUser.id;
  }

  private appendNewMessages() {
    let newMessages = this.messages;

    if (!this.displayMessages) {
      this.displayMessages = newMessages;
      return;
    }

    for (let newMessageIndex = this.displayMessages.length; newMessageIndex < newMessages.length;
         newMessageIndex++) {
      this.displayMessages.push(newMessages[newMessageIndex]);
    }
  }

  private updateCurrentUserAvatarUrl() {
    if (!this.currentUser) {
      return;
    }
    this.currentUserAvatarUrl =
        this.domSanitizer.bypassSecurityTrustResourceUrl(this.currentUser.avatar);
  }

  private updateOtherUserAvatarUrl() {
    if (!this.otherUser) {
      return;
    }
    this.otherUserAvatarUrl =
        this.domSanitizer.bypassSecurityTrustResourceUrl(this.otherUser.avatar);
  }
}
