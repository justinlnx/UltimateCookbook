import {Component, Input, OnInit} from '@angular/core';

import {ApiService, CartEntry, Ingredient, Recipe} from '../api';

@Component({
  selector: 'cart-item',
  template: `
  <md-card *ngIf="contentsExist()" class="mat-elevation-z8">
      <md-card-title>
          <span class="md-headline">{{recipe.name}}</span>
      </md-card-title>
      <md-card-subtitle>
          <span class="md-subhead">{{author}}</span>
      </md-card-subtitle>
      <md-card-content>
          <md-list>
              <md-list-item *ngFor="let ingredient of cartEntry.ingredients">
                  <md-checkbox [ngModel]="ingredient.bought" (ngModelChange)="updateCartEntry(ingredient, $event)">
                    {{ingredient.content}}
                  </md-checkbox>
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

  constructor(public apiService: ApiService) {}

  public ngOnInit() {
    this.getRecipeOnce();
    this.getAuthorOnce();
  }

  public contentsExist(): boolean {
    return !!this.cartEntry && !!this.recipe;
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
