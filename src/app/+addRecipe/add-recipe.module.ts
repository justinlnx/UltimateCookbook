import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';

import {SharedModule} from '../shared';

import {AddRecipeComponent} from './add-recipe.component';
import {routes} from './add-recipe.routes';
import {LoginWarningComponent} from './login-warning.component';

@NgModule({
  imports: [SharedModule, RouterModule.forChild(routes)],
  declarations: [AddRecipeComponent, LoginWarningComponent]
})
export class AddRecipeModule {
}
