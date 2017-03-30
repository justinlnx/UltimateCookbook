import {Routes} from '@angular/router';

import {RecipeListComponent} from './recipe-list';

export const routes: Routes = [
  {path: '', redirectTo: '/home/explore', pathMatch: 'full'},
  {path: 'explore', component: RecipeListComponent},
  // {path: 'chatlist'}
  // {path: 'chat/:id'}
];
