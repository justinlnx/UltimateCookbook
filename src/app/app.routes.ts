import {Routes} from '@angular/router';

import {DataResolver} from './app.resolver';
import {NoContentComponent} from './no-content';

export const ROUTES: Routes = [
  {path: '', redirectTo: 'recipes', pathMatch: 'full'},
  {path: 'recipes', loadChildren: './+recipes#RecipesModule'},
  {path: 'cart', loadChildren: './+cart#CartModule'},
  {path: 'favorite', loadChildren: './+favorite#FavoriteModule'},
  {path: 'personal_recipes', loadChildren: './+personalRecipes#PersonalRecipesModule'},
  {path: 'addRecipe', loadChildren: './+addRecipe#AddRecipeModule'},
  {path: 'account', loadChildren: './+account#AccountModule'},
  {path: '**', component: NoContentComponent},
];
