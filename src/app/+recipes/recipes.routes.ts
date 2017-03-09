import {Routes} from '@angular/router'

import {RecipeComponent} from './recipe';
import {RecipesComponent} from './recipes.component';

export const routes = [{
  path: '',
  component: RecipesComponent,
  children: [{path: 'recipe/:id', component: RecipeComponent}]
}];
