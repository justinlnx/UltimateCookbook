import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from '@angular/router';
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
    <login-warning *ngIf="!isLoggedIn"></login-warning>
    <div *ngIf="isLoggedIn">
      <md-list>
        <recipe-list-item *ngFor="let recipe of ownedRecipeList | async"
                          [recipe]="recipe"></recipe-list-item>
      </md-list>
      <button md-fab class="add-button" (click)="showAddRecipePage()">
        <md-icon>add</md-icon>
      </button>
    </div>
  </div>

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

  constructor(public apiService: ApiService, private router: Router) {}

  public ngOnInit() {
    this.loginStatusSubscription = this.apiService.getLoginObservable().subscribe((status) => {
      this.isLoggedIn = status;
    });
  }

  public ngOnDestroy() {
    this.loginStatusSubscription.unsubscribe();
  }
  public showAddRecipePage() {
    this.router.navigateByUrl(`/addRecipe`);
  }
  private getOwnedRecipes() {
    this.ownedRecipeList = this.apiService.getOwnedRecipes();
  }
}
