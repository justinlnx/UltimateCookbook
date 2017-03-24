import {CartEntry, cartEntryReceiveScheme, CartEntrySchema} from './cart';
import {DatabaseSchema} from './database-schema';
import {DefaultTransferActions} from './default-transfer-actions';
import {FrontendObject} from './frontend-object';
import {ReceiveScheme} from './receive-scheme';

export interface UserSchema extends DatabaseSchema {
  $key: string;
  id: string;
  name: string;
  recipes: string[];
  likedRecipes: string[];
  cart: CartEntrySchema[];
}

export class User extends FrontendObject {
  constructor(
      public $key: string, public id: string, public name: string, public recipes: string[],
      public likedRecipes: string[], public cart: CartEntry[]) {
    super();
  }
}

class UserReceiveScheme implements ReceiveScheme {
  public receive(userSchema: UserSchema): User {
    let $key = userSchema.$key;
    let id = DefaultTransferActions.stringAction(userSchema.id);
    let name = DefaultTransferActions.stringAction(userSchema.id);
    let recipes = DefaultTransferActions.arrayAction(userSchema.recipes);
    let likedRecipes = DefaultTransferActions.arrayAction(userSchema.likedRecipes);
    let cart = DefaultTransferActions.arrayAction(userSchema.cart);
    cart = cart.map((cartEntrySchema) => {
      return cartEntryReceiveScheme.receive(cartEntrySchema);
    });

    return new User($key, id, name, recipes, likedRecipes, cart);
  }
}

export const userReceiveScheme = new UserReceiveScheme();
