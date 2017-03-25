import {CartEntry, cartEntryReceiveScheme, CartEntrySchema} from './cart';
import {DatabaseSchema, PushDatabaseSchema} from './database-schema';
import {DefaultTransferActions} from './default-transfer-actions';
import {FrontendObject} from './frontend-object';
import {ReceiveScheme} from './receive-scheme';
import {Recipe, RecipeSchema} from './recipe';

export interface PushUserSchema extends PushDatabaseSchema {
  id: string;
  name: string;
  recipes: string[];
  likedRecipes: string[];
  cart: CartEntrySchema[];
}

export interface UserSchema extends PushUserSchema, DatabaseSchema {}

export class User extends FrontendObject {
  constructor(
      public $key: string, public id: string, public name: string, public recipes: string[],
      public likedRecipes: string[], public cart: CartEntry[]) {
    super($key);
  }

  public asPushSchema(): PushUserSchema {
    return {
      id: this.id,
      name: this.name,
      recipes: this.recipes,
      likedRecipes: this.likedRecipes,
      cart: this.cartSchema()
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

  private cartSchema(): CartEntrySchema[] {
    return this.cart.map((cartEntry) => {
      return cartEntry.asSchema();
    });
  }
}

// tslint:disable-next-line:max-classes-per-file
class UserReceiveScheme implements ReceiveScheme {
  public receive(userSchema: UserSchema): User {
    let $key = userSchema.$key;
    let id = DefaultTransferActions.stringAction(userSchema.id);
    let name = DefaultTransferActions.stringAction(userSchema.id);
    let recipes = DefaultTransferActions.arrayAction(userSchema.recipes);
    let likedRecipes = DefaultTransferActions.arrayAction(userSchema.likedRecipes);
    let cart = DefaultTransferActions.arrayAction(userSchema.cart);
    let transferredCart = cart.map((cartEntrySchema) => {
      return cartEntryReceiveScheme.receive(cartEntrySchema);
    });

    return new User($key, id, name, recipes, likedRecipes, transferredCart);
  }
}

export const userReceiveScheme = new UserReceiveScheme();
