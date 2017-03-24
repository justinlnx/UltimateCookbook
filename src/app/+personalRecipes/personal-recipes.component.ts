import {Component, OnDestroy, OnInit} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Subscription} from 'rxjs/Subscription';

import {ApiService, Recipe} from '../api';

@Component({
  selector: 'personal-recipes',
  template: `
  <md-toolbar class="top-toolbar" color="primary">
    <span>My Recipes</span>
  </md-toolbar>
  <div class="page-content">
    <md-list>
      <recipe-list-item *ngFor="let recipe of ownedRecipeList | async"
                        [recipe]="recipe"></recipe-list-item>
    </md-list>
  </div>
  <button md-fab class="add-button">
      <md-icon class="md-24">add</md-icon>
  </button>
  `,
  styleUrls: ['./personal-recipes.component.scss']
})
export class PersonalRecipesComponent implements OnInit, OnDestroy {
  public ownedRecipeList: Observable<Recipe[]>;

  private _isLoggedIn: boolean;
  set isLoggedIn(status: boolean) {
    this._isLoggedIn = status;

    if (status) {
      this.getOwnedRecipes();
    }
  }

  get isLoggedIn(): boolean {
    return this._isLoggedIn;
  }

  private loginStatusSubscription: Subscription;

  constructor(public apiService: ApiService) {}

  public ngOnInit() {
    this.loginStatusSubscription = this.apiService.getLoginObservable().subscribe((status) => {
      this.isLoggedIn = status;
    });
  }

  public ngOnDestroy() {
    this.loginStatusSubscription.unsubscribe();
  }

  private getOwnedRecipes() {
    this.ownedRecipeList = this.apiService.getOwnedRecipes();
  }
}
