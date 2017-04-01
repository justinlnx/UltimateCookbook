import {Location} from '@angular/common';
import {Component, OnInit} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import {ActivatedRoute, Params} from '@angular/router';
import {Observable} from 'rxjs/Observable';

import {ApiService, Chatroom, ChatroomService, PushMessageSchema, User} from '../../api';

@Component({
  selector: 'chatroom',
  template: `
  <md-toolbar class="top-toolbar" color="primary">
    <button md-icon-button (click)="onNavigateBack()">
      <md-icon>arrow_back</md-icon>
    </button>
    <span>{{otherUser?.name}}</span>
  </md-toolbar>
  <div class="page-content">
    <chat-content [currentUser]="currentUser"
                  [otherUser]="otherUser"
                  [messages]="chatroom?.messages">
    </chat-content>
    <md-card class="send-message">
      <button md-icon-button [disabled]="!validNewMessage()" (click)="onSendNewMessage()">
        <md-icon>send</md-icon>
      </button>
      <md-input-container floatPlaceholder="never">
        <input mdInput placeholder="Send message..."
                        [formControl]="newMessageInput"
                        (keyup.enter)="onSendNewMessage()">
      </md-input-container>
    </md-card>
  </div>
  `,
  styleUrls: ['./chatroom.component.scss']
})
export class ChatroomComponent implements OnInit {
  public newMessageInput: FormControl = new FormControl('', [Validators.required]);

  public chatroom: Chatroom;
  public currentUser: User;
  public otherUser: User;

  constructor(
      public route: ActivatedRoute, public location: Location,
      public chatroomService: ChatroomService, public apiService: ApiService) {}

  public ngOnInit() {
    this.route.params
        .switchMap(
            (params: Params) => this.chatroomService.getCurrentUserChatroomObservable(params['id']))
        .subscribe((chatroomObservable) => {
          console.log(chatroomObservable);

          chatroomObservable.subscribe((chatroom) => {
            console.log(chatroom);
            this.chatroom = chatroom;
          });
          this.updateOtherUserObservable(chatroomObservable);
        });

    this.apiService.getCurrentUserObservable().subscribe((currentUser) => {
      this.currentUser = currentUser;
    });
  }

  public onNavigateBack(): void {
    this.location.back();
  }

  public validNewMessage(): boolean {
    return this.newMessageInput.valid;
  }

  public onSendNewMessage(): void {
    if (this.validNewMessage()) {
      let newMessage = this.newMessageInput.value;
      let sender = this.currentUser.id;
      let timestamp = 123;

      let message: PushMessageSchema = {message: newMessage, sender, timestamp};

      console.log(message);

      this.chatroomService.sendNewMessage(this.chatroom.$key, message);

      this.newMessageInput.setValue('');
    }
  }

  private updateOtherUserObservable(chatroomObservable: Observable<Chatroom>) {
    this.chatroomService.getOtherUseObservable(chatroomObservable).subscribe((otherUser) => {
      console.log(otherUser);
      this.otherUser = otherUser;
    });
  }
}
