import {Routes} from '@angular/router';

import {DataResolver} from './app.resolver';
import {NoContentComponent} from './no-content';

export const ROUTES: Routes = [
  {path: '', redirectTo: 'recipes', pathMatch: 'full'},
  {path: 'recipes', loadChildren: './+recipes#RecipesModule'},
  {path: 'addRecipe', loadChildren: './+addRecipe#AddRecipeModule'},
  {path: 'account', loadChildren: './+account#AccountModule'},
  {path: '**', component: NoContentComponent},
];
