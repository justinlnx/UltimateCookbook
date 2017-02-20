import { RecipesComponent } from './recipes.component';

export const routes = [
  { path: '', children: [
    { path: '', component: RecipesComponent }
  ]},
];
