import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouterModule} from '@angular/router';

import {SharedModule} from '../shared';

import {CommentListItemComponent} from './comment-list-item.component';
import {DeleteRecipeDialogComponent} from './delete-recipe-dialog.component';
import {RecipeComponent} from './recipe.component';
import {routes} from './recipe.routes';

@NgModule({
  imports: [SharedModule, RouterModule.forChild(routes)],
  declarations: [RecipeComponent, CommentListItemComponent, DeleteRecipeDialogComponent],
  entryComponents: [DeleteRecipeDialogComponent]
})
export class RecipeModule {
}
