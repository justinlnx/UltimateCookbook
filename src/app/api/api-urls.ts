export const PUBLIC_RECIPES_URL = '/public/recipes';
export const USERS_URL = '/users';
export function commentsUrl(recipeId: string) {
  return `${PUBLIC_RECIPES_URL}/${recipeId}/comments`;
}
