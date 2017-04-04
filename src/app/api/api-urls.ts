export const PUBLIC_RECIPES_URL = '/public/recipes';
export const USERS_URL = '/users';
export function recipeUrl(recipeId: string): string {
  return `${PUBLIC_RECIPES_URL}/${recipeId}`;
}
export function commentsUrl(recipeId: string) {
  return `${recipeUrl(recipeId)}/comments`;
}
export function userUrl(userKey: string) {
  return `${USERS_URL}/${userKey}`;
}
export function userCartUrl(userKey: string) {
  return `${userUrl(userKey)}/cart`;
}
