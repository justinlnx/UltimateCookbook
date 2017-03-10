import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs/Observable';

import {ApiService, Recipe} from '../../api';

@Component({
  selector: 'recipe-list',
  template: `
  <!--<input type="text" name="search" placeholder=" Search" id="searchBox">-->
  <md-list>
    <recipe-list-item *ngFor="let recipe of recipesObservable | async" [recipe]="recipe"></recipe-list-item>
  </md-list>
  `
})
export class RecipeListComponent implements OnInit {
  public recipesObservable: Observable<Recipe[]>;
  public searchInput: string = '';

  constructor(private apiService: ApiService) {}

  public ngOnInit(): void {
    this.recipesObservable = this.apiService.getAllRecipes().map((recipes: Recipe[]) => {
      return this.filterRecipeList(recipes);
    });
  }

  private filterRecipeList(recipes: Recipe[]): Recipe[] {
    return recipes.filter((recipe) => {
      return recipe.name.includes(this.searchInput);
    });
  }
}
