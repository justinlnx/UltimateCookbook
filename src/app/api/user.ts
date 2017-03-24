import {CartEntry} from './cart';
import {RecipeId, UserId} from './types';

export interface PushUser {
  id: UserId;
  name: string;
  recipes: RecipeId[];
  likedRecipes: RecipeId[];
  cart: CartEntry[];
}

export interface User extends PushUser { $key: string; }
