import { Component } from '@angular/core';
import {Http} from '@angular/http';

@Component({
  selector: 'mainRecipe',
  template: `
    <div>
      <button type="button" class="btn-class" >
        <img class="img" src="./app/+recipes/1.jpg" alt="recipe1_sample"><br>
        <span class="recipeName"> {{recipe1|json}}</span>
      </button>
      <button type="button" class="btn-class" >
        <img class="img" src="./app/+recipes/2.jpg" alt="recipe1_sample"><br>
        <span class="recipeName"> {{recipe2|json}}</span>
      </button>
      <button type="button" class="btn-class" >
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
    constructor(private http:Http) {
        this.http.get('./app/+recipes/recipes.json')
                 .subscribe(res => {this.recipe1 = res.json().Recipes[0].Name;
                                    this.recipe2 = res.json().Recipes[1].Name;
                                    this.recipe3 = res.json().Recipes[2].Name;
                  });

    }}
