import {Routes} from '@angular/router';

import {RecipeComponent} from './recipe';
import {RecipeListComponent} from './recipe-list';
import {RecipesComponent} from './recipes.component';

export const routes: Routes = [
  {path: '', redirectTo: '/recipes/all', pathMatch: 'full'},
  {path: 'all', component: RecipeListComponent}, {path: 'recipe/:id', component: RecipeComponent}
];
