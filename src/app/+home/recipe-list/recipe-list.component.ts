import {Component, OnInit} from '@angular/core';
import {MdDialog} from '@angular/material';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs/Subscription';

import {ApiService, Recipe} from '../../api';

import {ChatroomNavigationWarningComponent} from './chatroom-navigation-warning.component';

@Component({
  selector: 'recipe-list',
  template: `
  <md-toolbar class="top-toolbar"  color="primary">
    <search-bar (searchInputChange)="onSearchInputChange($event)"></search-bar>
    <span class="toolbar-spacer"></span>
    <button md-icon-button (click)="onNavigateToChatrooms()">
      <md-icon>chat</md-icon>
    </button>
  </md-toolbar>
  <div class="page-content">
    <md-list>
      <recipe-list-item *ngFor="let recipe of filteredRecipes" [recipe]="recipe"></recipe-list-item>
    </md-list>
  </div>
  `,
  styleUrls: ['./recipe-list.component.scss']
})
export class RecipeListComponent implements OnInit {
  public filteredRecipes: Recipe[];

  public searchInput: string = '';

  private recipesSubscription: Subscription;

  private _recipes: Recipe[];
  get recipes(): Recipe[] {
    return this._recipes;
  }
  set recipes(recipes: Recipe[]) {
    this._recipes = recipes;
    this.filterRecipeList();
  }

  constructor(public apiService: ApiService, public router: Router, public mdDialog: MdDialog) {}

  public ngOnInit(): void {
    this.recipesSubscription = this.apiService.getAllRecipes().subscribe((recipes) => {
      this.recipes = recipes;
    });
  }

  public onSearchInputChange(input: string): void {
    console.log(input);
    this.searchInput = input;

    this.filterRecipeList();
  }

  public onNavigateToChatrooms(): void {
    if (!this.apiService.isLoggedIn()) {
      this.mdDialog.open(ChatroomNavigationWarningComponent);
    } else {
      this.router.navigateByUrl('/home/chatrooms');
    }
  }

  private filterRecipeList(): void {
    if (!this.recipes) {
      return;
    }

    this.filteredRecipes = this.recipes.filter((recipe) => {
      return recipe.name.search(new RegExp(this.searchInput, 'i')) !== -1;
    });
  }
}
