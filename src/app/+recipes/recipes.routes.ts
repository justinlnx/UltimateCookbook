import { Routes } from '@angular/router'
import { RecipesComponent } from './recipes.component';

export const routes = [
  { path: '', 
    component: RecipesComponent,
    children: []
  }
];
