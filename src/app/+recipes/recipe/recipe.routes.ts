import { Routes } from '@angular/router';
import { RecipeComponent } from './recipe.component';

export const routes: Routes = [{ path: 'recipe/:id', component: RecipeComponent }];