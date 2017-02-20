import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../shared';

import {RecipesComponent} from './recipes.component';
import {routes} from './recipes.routes';

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ],
  declarations: [RecipesComponent]
})
export class RecipesModule {}
