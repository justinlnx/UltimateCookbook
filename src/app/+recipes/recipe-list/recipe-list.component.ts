import {Component, OnInit} from '@angular/core';
import {Subscription} from 'rxjs/Subscription';
import {ApiService, Recipe} from '../../api';

@Component({
  selector: 'recipe-list',
  template: `
  <search-bar (searchInputChange)="onSearchInputChange($event)"></search-bar>
  <md-list>
    <recipe-list-item *ngFor="let recipe of filteredRecipes" [recipe]="recipe"></recipe-list-item>
  </md-list>
  `,
  styleUrls: ['./recipe-list.component.scss']
})
export class RecipeListComponent implements OnInit {
  public filteredRecipes: Recipe[];
  private _recipes: Recipe[];
  get recipes(): Recipe[] {
    return this._recipes;
  }
  set recipes(recipes: Recipe[]) {
    this._recipes = recipes;
    this.filterRecipeList();
  }
  public searchInput: string = '';

  private recipesSubscription: Subscription;

  constructor(private apiService: ApiService) {}

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

  private filterRecipeList(): void {
    if (!this.recipes) return;
    this.filteredRecipes = this.recipes.filter((recipe) => {
      return recipe.name.includes(this.searchInput);
    });
  }
}
