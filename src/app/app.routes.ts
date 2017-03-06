import { Routes } from '@angular/router';
import { NoContentComponent } from './no-content';

import { DataResolver } from './app.resolver';

export const ROUTES: Routes = [
  { path: '',      redirectTo: 'recipes', pathMatch: 'full'},
  { path: 'recipes', loadChildren: './+recipes#RecipesModule'},
  { path: 'account', loadChildren: './+account#AccountModule'},
  { path: '**',    component: NoContentComponent },
];
