import {Location} from '@angular/common';
import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params} from '@angular/router';
import {Observable} from 'rxjs/Observable';

import {ApiService, Chatroom, ChatroomService, Message, User} from '../../api';

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
  </div>
  `
})
export class ChatroomComponent implements OnInit {
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

  private updateOtherUserObservable(chatroomObservable: Observable<Chatroom>) {
    this.chatroomService.getOtherUseObservable(chatroomObservable).subscribe((otherUser) => {
      console.log(otherUser);
      this.otherUser = otherUser;
    });
  }
}
