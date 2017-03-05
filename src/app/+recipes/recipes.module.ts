import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared';
import {RecipesComponent} from './recipes.component';
import {routes} from './recipes.routes';
import { BrowserModule } from '@angular/platform-browser';
import { MainRecipeComponent } from './mainRecipe.component';
import {RecipeComponent} from './recipe'

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ],
  declarations: [RecipesComponent, MainRecipeComponent, RecipeComponent]
})
export class RecipesModule {}
