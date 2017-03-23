import {RecipeId} from './types';

export const PUBLIC_RECIPES_URL = '/public/recipes';
export const USERS_URL = '/users';
export function commentsUrl(recipeId: RecipeId) {
  return `${PUBLIC_RECIPES_URL}/${recipeId}/comments`;
}
