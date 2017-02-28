import { Component } from '@angular/core';

@Component({
  selector: 'mainRecipe',
  template: `
    <div>
      <button type="button" class="btn-class" >
        <img class="img" src="grey.jpg" alt="grey box">
        <span class="recipeName"> Cook Book Recipe #1 </span>
      </button>
    </div>
  `
})
export class mainRecipeComponent{}
