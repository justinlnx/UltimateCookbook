import {Component, OnInit} from '@angular/core';
import {Subscription} from 'rxjs/Subscription';
import {ApiService, Recipe} from '../../api';

@Component({
  selector: 'recipe-list',
  template: `
  <md-toolbar class="top-toolbar"  color="primary">
    <search-bar (searchInputChange)="onSearchInputChange($event)"></search-bar>
    <span class="toolbar-spacer"></span>
    <button md-icon-button>
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
    if (!this.recipes) {
      return;
    }

    this.filteredRecipes = this.recipes.filter((recipe) => {
      return recipe.name.search(new RegExp(this.searchInput, 'i')) !== -1;
    });
  }
}
