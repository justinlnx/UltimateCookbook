import {Location} from '@angular/common';
import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs/Observable';

import {ApiService, Chatroom, ChatroomService, User} from '../../api';

@Component({
  selector: 'chatrooms',
  template: `
  <md-toolbar class="top-toolbar" color="primary">
    <button md-icon-button (click)="onNavigateBack()">
      <md-icon>arrow_back</md-icon>
    </button>
    <span>Conversations</span>
  </md-toolbar>
  <div class="page-content">
    <md-list>
      <chatrooms-list-item *ngFor="let chatroom of chatroomsObservable | async"
                            [chatroom]="chatroom"
                            [currentUser]="currentUerObservable | async">
      </chatrooms-list-item>
    </md-list>
  </div>
`
})
export class ChatroomsComponent implements OnInit {
  public chatroomsObservable: Observable<Chatroom[]>;
  public currentUerObservable: Observable<User>;

  constructor(
      public apiService: ApiService, public chatroomService: ChatroomService,
      public location: Location) {}

  public ngOnInit() {
    this.chatroomService.getCurrentUserChatroomsObservable().subscribe((chatroomsObservable) => {
      this.chatroomsObservable = chatroomsObservable;
    });
    this.currentUerObservable = this.apiService.getCurrentUserObservable();
  }

  public onNavigateBack() {
    this.location.back();
  }
}
