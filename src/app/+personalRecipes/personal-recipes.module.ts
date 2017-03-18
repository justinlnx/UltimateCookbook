import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';

import {SharedModule} from '../shared';

import {PersonalRecipesComponent} from './personal-recipes.component';
import {routes} from './personal-recipes.routes';

@NgModule({
  imports: [SharedModule, RouterModule.forChild(routes)],
  declarations: [PersonalRecipesComponent]
})
export class PersonalRecipesModule {
}
