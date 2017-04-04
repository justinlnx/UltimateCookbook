import {Component, Input, OnInit} from '@angular/core';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';

import {Observable} from 'rxjs/Observable';
import {User} from '../api';

@Component({
  selector: 'comment-list-item',
  template: `
  <md-list-item class="md-2-line">
    <img md-list-avatar class="avatar" [src]="avatarUrl">
    <p md-line class="name">{{user?.name}}</p>
    <p md-line class="comment">{{comment}}</p>
  </md-list-item>
  `,
  styleUrls: ['./comment-list-item.component.scss']
})
export class CommentListItemComponent implements OnInit {
  @Input() public comment: string;
  @Input() public userObservable: Observable<User>;

  public user: User;
  public avatarUrl: SafeResourceUrl;

  constructor(public domSanitizer: DomSanitizer) {}

  public ngOnInit() {
    this.userObservable.subscribe((user) => {
      this.user = user;
      this.updateUserAvatarUrl();
    });
  }

  private updateUserAvatarUrl() {
    this.avatarUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(this.user.avatar);
  }
}
