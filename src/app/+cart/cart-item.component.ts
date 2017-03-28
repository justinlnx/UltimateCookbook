import {Component, Input, OnInit} from '@angular/core';

import {ApiService, CartEntry, Ingredient, Recipe} from '../api';

@Component({
  selector: 'cart-item',
  template: `
  <md-card *ngIf="contentsExist()" class="mat-elevation-z8" (click)="onToggleContract()">
      <md-card-title>
          <span class="md-headline">{{recipe.name}}</span>
      </md-card-title>
      <md-card-subtitle>
          <span class="md-subhead">{{author}}</span>
      </md-card-subtitle>
      <md-card-content>
          <md-list class="cart-ingredient-list">
              <md-list-item class="cart-ingredient-item" *ngFor="let ingredient of filteredIngredients">
                  <md-checkbox [ngModel]="ingredient.bought" (ngModelChange)="updateCartEntry(ingredient, $event)" (click)="$event.stopPropagation()">

                  </md-checkbox>{{ingredient.content}}
              </md-list-item>
              <md-list-item *ngIf="contracted">
                ...
              </md-list-item>
          </md-list>
      </md-card-content>
  </md-card>
  `,
  styleUrls: ['./cart-item.component.scss']
})
export class CartItemComponent implements OnInit {
  @Input() public cartEntry: CartEntry;
  public recipe: Recipe;
  public author: string;
  public contracted: boolean;
  public filteredIngredients: Ingredient[] = [];

  constructor(public apiService: ApiService) {
    this.contracted = true;
  }

  public ngOnInit() {
    this.getRecipeOnce();
    this.getAuthorOnce();

    this.populateFilteredIngredients();
  }

  public contentsExist(): boolean {
    return !!this.cartEntry && !!this.recipe;
  }

  public show2Items(ingredients: Ingredient[]): Ingredient[] {
    return ingredients.filter((_, index) => {
      return index < 2;
    });
  }

  public onToggleContract(): void {
    this.contracted = !this.contracted;
    this.populateFilteredIngredients();
  }

  public populateFilteredIngredients() {
    this.filteredIngredients =
        this.contracted ? this.show2Items(this.cartEntry.ingredients) : this.cartEntry.ingredients;

    console.log(this.filteredIngredients);
  }

  public getRecipeOnce(): void {
    this.apiService.getRecipe(this.cartEntry.recipeId).first().subscribe((recipe) => {
      this.recipe = recipe;
    });
  }

  public getAuthorOnce(): void {
    this.apiService.getRecipeAuthorName(this.cartEntry.recipeId).first().subscribe((author) => {
      this.author = author;
    });
  }

  public updateCartEntry(ingredient: Ingredient, value: boolean): void {
    ingredient.bought = value;
    this.apiService.updateCartEntryForCurrentUser(this.cartEntry);
  }
}
