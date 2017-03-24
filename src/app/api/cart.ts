import {RecipeId} from './types';

export interface CartEntry {
  recipeId: RecipeId;
  ingredients: [{
    content: string;
    bought: boolean;
  }]
}
