export const PUBLIC_RECIPES_URL = '/public/recipes';
export const USERS_URL = '/users';
export function commentsUrl(recipeId: string) {
  return `${PUBLIC_RECIPES_URL}/${recipeId}/comments`;
}
export function userUrl(userKey: string) {
  return `${USERS_URL}/${userKey}`;
}
export function userCartUrl(userKey: string) {
  return `${userUrl(userKey)}/cart`;
}
