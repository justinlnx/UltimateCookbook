import {Component} from '@angular/core';
import {Http} from '@angular/http';
import {ApiService, FirebaseListObservable} from '../api';

@Component({
  selector: 'mainRecipe',
  // template: `
  //   <div>
  //     <button type="button" class="btn-class" >
  //       <img class="img" src="./app/+recipes/1.jpg" alt="recipe1_sample"><br>
  //       <span class="recipeName"> {{recipe1|json}}</span>
  //     </button>
  //     <button type="button" class="btn-class" >
  //       <img class="img" src="./app/+recipes/2.jpg" alt="recipe1_sample"><br>
  //       <span class="recipeName"> {{recipe2|json}}</span>
  //     </button>
  //     <button type="button" class="btn-class" >
  //       <img class="img" src="./app/+recipes/3.jpg" alt="recipe1_sample"><br>
  //       <span class="recipeName"> {{recipe3|json}}</span>
  //     </button>
  //   </div>
  // `,
  template: `
    <div>
      <ul>
        <li *ngFor="let recipe of recipeNames; let i = index">
          <button type="button" class="btn-class">
            <img class="img" src="./app/+recipes/{{i}}.jpg" alt="recipe1_sample"><br>
            <span class="recipeName"> {{recipe|json}}</span>
          </button>
        </li>
      </ul>
    </div>
  `,
  styleUrls: ['./recipes.component.css']
})
export class MainRecipeComponent {
  // recipe1: Object;
  // recipe2: Object;
  // recipe3: Object;

  // constructor(private apiService: ApiService) {
  //   this.apiService.getAllRecipes().subscribe(res => {
  //     this.recipe1 = res[0].name;
  //     this.recipe2 = res[1].name;
  //     this.recipe3 = res[2].name;
  //   });
  // }
  recipeNames: Object[];

  constructor(private apiService: ApiService) {
    this.apiService.getAllRecipes().subscribe(response => {
      response.forEach(recipe => {
        this.recipeNames.push(recipe.name);
      });
    })
  }
}
