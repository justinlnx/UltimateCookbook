import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouterModule} from '@angular/router';

import {SharedModule} from '../shared';

// import { MainRecipeComponent } from './mainRecipe.component';
import {RecipeListComponent, RecipeListItemComponent} from './recipe-list';
import {RecipesComponent} from './recipes.component';
import {routes} from './recipes.routes';

@NgModule({
  imports: [SharedModule, RouterModule.forChild(routes)],
  declarations: [RecipesComponent, RecipeListComponent, RecipeListItemComponent]
})
export class RecipesModule {
}
