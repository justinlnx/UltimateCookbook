import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouterModule} from '@angular/router';

import {SharedModule} from '../shared';

import {RecipeComponent} from './recipe.component';
import {routes} from './recipe.routes';

@NgModule({
  imports: [SharedModule, RouterModule.forChild(routes)],
  declarations: [RecipeComponent],
})
export class RecipeModule {
}
