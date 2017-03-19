import {Component, Input, OnInit} from '@angular/core';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
import {Router} from '@angular/router';
import {Recipe} from '../api';

@Component({
  selector: 'recipe-list-item',
  template: `
  <md-list-item class="md-2-line"  (click)="showDetails(recipe)">
    <img md-list-avatar [src]="safeImageUrl" alt="showcase">
      <div class="mat-list-text">
     <h4 md-line class="recipe-name">{{recipe?.name}}</h4>
      <p md-line class="recipe-rating">{{recipe?.rating}} likes</p>
      </div>
    <md-icon (click)="likeRecipe(recipe); $event.stopPropagation()">
      <span md-icon [class.fav-button]="recipe?.rating == '1'">favorite</span>
    </md-icon>
  </md-list-item>
  <md-divider></md-divider>`,
   styleUrls: ['./recipe-list-item.component.scss']
})
export class RecipeListItemComponent implements OnInit {
  @Input() public recipe: Recipe;
  public safeImageUrl: SafeResourceUrl;

  constructor(private domSanitizer: DomSanitizer, private router: Router) {}

  public ngOnInit() {
    this.updateBypassImageSrc();
  }

  public showDetails(recipe: Recipe) {
    console.log(recipe.$key);
    this.router.navigateByUrl(`/recipes/recipe/${recipe.$key}`);
  }

  public likeRecipe(recipe: Recipe) {
    console.log(recipe.rating);
    if (recipe.rating === 0) {
      recipe.rating = 1;
    } else {
      recipe.rating = 0;
    }
  }

  private updateBypassImageSrc() {
    if (this.recipe.avatar) {
      this.safeImageUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(this.recipe.avatar);
    }
  }
}
