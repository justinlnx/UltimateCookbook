import {Component} from '@angular/core';
import {Router} from '@angular/router'
import {Http} from '@angular/http';
import {ApiService, Recipe, FirebaseListObservable} from '../api';
import {RecipeComponent} from './recipe'

@Component({
  selector: 'mainRecipe',
  template: `
    <div>
      <button type="button" class="btn-class" (click)="showDetails(recipe1)" >
        <img class="img" src="./app/+recipes/1.jpg" alt="recipe1_sample"><br>
        <span class="recipeName"> {{recipe1|json}}</span>
      </button>
      <button type="button" class="btn-class" (click)="showDetails(recipe2)">
        <img class="img" src="./app/+recipes/2.jpg" alt="recipe1_sample"><br>
        <span class="recipeName"> {{recipe2|json}}</span>
      </button>
      <button type="button" class="btn-class" (click)="showDetails(recipe3)">
        <img class="img" src="./app/+recipes/3.jpg" alt="recipe1_sample"><br>
        <span class="recipeName"> {{recipe3|json}}</span>
      </button>
    </div>
  `,
  styleUrls: ['./recipes.component.css']
})
export class MainRecipeComponent {
  recipe1: Object;
  recipe2: Object;
  recipe3: Object;

  constructor(private apiService: ApiService, private route: Router) {
    this.apiService.getAllRecipes().subscribe(res => {
      this.recipe1 = res[0].name;
      this.recipe2 = res[1].name;
      this.recipe3 = res[2].name;
    });
  }

  public showDetails(recipe: Recipe) {
    console.log(recipe.id);
    this.route.navigateByUrl(`/recipes/recipe/${recipe.id}`);
  }
}
