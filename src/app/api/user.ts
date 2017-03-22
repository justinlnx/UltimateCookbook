import {RecipeId, UserId} from './types';

export interface User {
  $key: UserId;
  name: string;
  recipes: RecipeId[];
  likedRecipes: RecipeId[];
}
