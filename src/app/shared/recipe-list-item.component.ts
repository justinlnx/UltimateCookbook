import {Component, Input, OnInit} from '@angular/core';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
import {Router} from '@angular/router';

import {ApiService, Recipe} from '../api';

@Component({
  selector: 'recipe-list-item',
  template: `
  <md-list-item class="md-2-line"  (click)="showDetails(recipe)">
    <img md-list-avatar [src]="safeImageUrl" alt="showcase">
      <div class="mat-list-text">
     <h4 md-line class="recipe-name">{{recipe?.name}}</h4>
      <p md-line class="recipe-rating">{{numberOfLikes(recipe)}} likes</p>
      </div>
    <div *ngIf="isLoggedIn()">
      <button md-icon-button *ngIf="!isOwner(recipe)"
              (click)="likeRecipe(recipe); $event.stopPropagation()">
        <md-icon [class.fav-button]="isLiked(recipe)">favorite</md-icon>
      </button>
      <md-chip-list *ngIf="isOwner(recipe)" [selectable]="false">
        <md-chip>Owner</md-chip>
      </md-chip-list>
    </div>
  </md-list-item>
  <md-divider></md-divider>`,
   styleUrls: ['./recipe-list-item.component.scss']
})
export class RecipeListItemComponent implements OnInit {
  @Input() public recipe: Recipe;
  public safeImageUrl: SafeResourceUrl;

  constructor(
      private domSanitizer: DomSanitizer, private router: Router, public apiService: ApiService) {}

  public ngOnInit() {
    this.updateBypassImageSrc();
  }

  public isLoggedIn() {
    return this.apiService.isLoggedIn();
  }

  public showDetails(recipe: Recipe) {
    console.log(recipe.$key);
    this.router.navigateByUrl(`/recipes/recipe/${recipe.$key}`);
  }

  public likeRecipe(recipe: Recipe) {
    this.apiService.toggleLike(recipe);
  }

  public numberOfLikes(recipe: Recipe): number {
    return recipe.likedUsers ? recipe.likedUsers.length : 0;
  }

  public isLiked(recipe: Recipe): boolean {
    return this.apiService.isLiked(recipe);
  }

  public isOwner(recipe: Recipe): boolean {
    return this.apiService.ownsRecipe(recipe);
  }

  private updateBypassImageSrc() {
    if (this.recipe.avatar) {
      this.safeImageUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(this.recipe.avatar);
    }
  }
}
