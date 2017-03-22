import {RecipeId, UserId} from './types';

export interface PushUser {
  id: UserId;
  name: string;
  recipes: RecipeId[];
  likedRecipes: RecipeId[];
}

export interface User extends PushUser { $key: string; }
