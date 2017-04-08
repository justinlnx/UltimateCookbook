import {Component, OnDestroy, OnInit} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Subscription} from 'rxjs/Subscription';

import {ApiService, Recipe} from '../api';

@Component({
  selector: 'favorite',
  template: `
  <md-toolbar class="top-toolbar" color="primary">
    <span>Favorites</span>
  </md-toolbar>
  <div class="page-content">
    <login-warning *ngIf="!isLoggedIn"></login-warning>
    <md-list *ngIf="isLoggedIn">
      <div class="warning-area" *ngIf="(recipeList | async)?.length==0">
        <md-icon>favorite</md-icon>
          <div>You currently do not have any favorite recipes.</div>
      </div>
      <recipe-list-item *ngFor="let recipe of recipeList | async" [recipe]="recipe">
      </recipe-list-item>
    </md-list>
  </div>
  `,
  styleUrls: ['./favorite.component.scss']
})
export class FavoriteComponent implements OnInit, OnDestroy {
  public recipeList: Observable<Recipe[]>;

  private subscription: Subscription;

  private _isLoggedIn: boolean;
  set isLoggedIn(status: boolean) {
    this._isLoggedIn = status;
    if (status) {
      this.getLikedRecipes();
    }
  }
  get isLoggedIn(): boolean {
    return this._isLoggedIn;
  }

  constructor(public apiService: ApiService) {}

  public ngOnInit() {
    this.subscription = this.apiService.getLoginObservable().subscribe((isLoggedIn) => {
      this.isLoggedIn = isLoggedIn;
    });
  }

  public ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  private getLikedRecipes() {
    this.recipeList = this.apiService.getLikedRecipes();
  }
}
