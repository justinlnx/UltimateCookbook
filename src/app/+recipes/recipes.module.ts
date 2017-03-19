import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouterModule} from '@angular/router';

import {SharedModule} from '../shared';

import {RecipeComponent} from './recipe';
import {RecipeListComponent, SearchBarComponent} from './recipe-list';
import {RecipesComponent} from './recipes.component';
import {routes} from './recipes.routes';

@NgModule({
  imports: [SharedModule, RouterModule.forChild(routes)],
  declarations: [
    RecipesComponent, RecipeListComponent, RecipeComponent,
    SearchBarComponent
  ],
})
export class RecipesModule {
}
