import {DatabaseSchema, PushDatabaseSchema} from './database-schema';
import {DefaultTransferActions} from './default-transfer-actions';
import {FrontendObject} from './frontend-object';
import {Ingredient, ingredientReceiveScheme, PushIngredientSchema} from './ingredient';
import {ReceiveScheme} from './receive-scheme';

export interface PushCartEntrySchema extends PushDatabaseSchema {
  recipeId: string;
  ingredients: PushIngredientSchema[];
}

export interface CartEntrySchema extends PushCartEntrySchema, DatabaseSchema {}

export class CartEntry extends FrontendObject {
  constructor(public $key: string, public recipeId: string, public ingredients: Ingredient[]) {
    super($key);
  }

  public asPushSchema(): PushCartEntrySchema {
    return {recipeId: this.recipeId, ingredients: this.pushIngredientsSchema()};
  }

  public asSchema(): CartEntrySchema {
    return this.pushSchemaToSchema();
  }

  private pushIngredientsSchema(): PushIngredientSchema[] {
    return this.ingredients.map((ingredient) => {
      return ingredient.asPushSchema();
    });
  }
}

// tslint:disable-next-line:max-classes-per-file
class CartEntryReceiveScheme extends ReceiveScheme {
  public receiveAsDescendant(cartEntrySchema: PushCartEntrySchema, index: string): CartEntry {
    let $key = DefaultTransferActions.requiredStringAction(index);
    let recipeId = DefaultTransferActions.stringAction(cartEntrySchema.recipeId);
    let ingredients = DefaultTransferActions.arrayAction(cartEntrySchema.ingredients);

    let transferredIngredients = ingredients.map((pushIngredientSchema, ingredientIndex) => {
      return ingredientReceiveScheme.receiveAsDescendant(
          pushIngredientSchema, `${ingredientIndex}`);
    });

    return new CartEntry($key, recipeId, transferredIngredients);
  }
}

export const cartEntryReceiveScheme = new CartEntryReceiveScheme();
