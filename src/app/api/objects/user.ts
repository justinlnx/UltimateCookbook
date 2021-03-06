import {CartEntry, cartEntryReceiveScheme, CartEntrySchema, PushCartEntrySchema} from './cart';
import {DatabaseSchema, PushDatabaseSchema} from './database-schema';
import {DefaultTransferActions} from './default-transfer-actions';
import {FrontendObject} from './frontend-object';
import {ReceiveScheme} from './receive-scheme';
import {Recipe, RecipeSchema} from './recipe';

export interface PushUserSchema extends PushDatabaseSchema {
  id: string;
  name: string;
  avatar: string;
  recipes: string[];
  likedRecipes: string[];
  cart: PushCartEntrySchema[];
}

export interface UserSchema extends PushUserSchema, DatabaseSchema {}

export class User extends FrontendObject {
  constructor(
      public $key: string, public id: string, public name: string, public avatar: string,
      public recipes: string[], public likedRecipes: string[], public cart: CartEntry[]) {
    super($key);
  }

  public asPushSchema(): PushUserSchema {
    return {
      id: this.id,
      name: this.name,
      avatar: this.avatar,
      recipes: this.recipes,
      likedRecipes: this.likedRecipes,
      cart: this.pushcCartSchema()
    };
  }

  public asSchema(): UserSchema {
    return this.pushSchemaToSchema();
  }

  public isInLikedRecipes(recipe: Recipe): boolean {
    return !!this.likedRecipes.find((likedRecipeId) => {
      return likedRecipeId === recipe.$key;
    });
  }

  public removeRecipeFromLikedList(recipe: Recipe): void {
    this.likedRecipes = this.likedRecipes.filter((recipeId) => {
      return recipeId !== recipe.$key;
    });
  }

  public addRecipeToLikedList(recipe: Recipe): void {
    this.likedRecipes.push(recipe.$key);
  }

  private pushcCartSchema(): PushCartEntrySchema[] {
    return this.cart.map((cartEntry) => {
      return cartEntry.asPushSchema();
    });
  }
}

// tslint:disable-next-line:max-classes-per-file
class UserReceiveScheme extends ReceiveScheme {
  public receiveAsDescendant(userSchema: PushUserSchema, index: string): User {
    let $key = DefaultTransferActions.requiredStringAction(index);
    let id = DefaultTransferActions.stringAction(userSchema.id);
    let name = DefaultTransferActions.stringAction(userSchema.name);
    let avatar = DefaultTransferActions.stringAction(userSchema.avatar);
    let recipes = DefaultTransferActions.arrayAction(userSchema.recipes);
    let likedRecipes = DefaultTransferActions.arrayAction(userSchema.likedRecipes);
    let cart = DefaultTransferActions.arrayAction(userSchema.cart);
    let transferredCart = cart.map((pushCartEntrySchema, cartEntryIndex) => {
      return cartEntryReceiveScheme.receiveAsDescendant(pushCartEntrySchema, `${cartEntryIndex}`);
    });

    return new User($key, id, name, avatar, recipes, likedRecipes, transferredCart);
  }
}

export const userReceiveScheme = new UserReceiveScheme();
