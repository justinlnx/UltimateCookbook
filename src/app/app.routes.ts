import {Routes} from '@angular/router';

import {DataResolver} from './app.resolver';
import {NoContentComponent} from './no-content';

export const ROUTES: Routes = [
  {path: '', redirectTo: 'home', pathMatch: 'full'},
  {path: 'home', loadChildren: './+home#HomeModule'},
  {path: 'cart', loadChildren: './+cart#CartModule'},
  {path: 'favorite', loadChildren: './+favorite#FavoriteModule'},
  {path: 'personal_recipes', loadChildren: './+personalRecipes#PersonalRecipesModule'},
  {path: 'addRecipe', loadChildren: './+addRecipe#AddRecipeModule'},
  {path: 'account', loadChildren: './+account#AccountModule'},
  {path: 'recipe', loadChildren: './+recipe#RecipeModule'},
  {path: '**', component: NoContentComponent},
];
