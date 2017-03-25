import {DatabaseSchema} from './database-schema';
import {DefaultTransferActions} from './default-transfer-actions';
import {FrontendObject} from './frontend-object';
import {Ingredient, ingredientReceiveScheme, IngredientSchema} from './ingredient';
import {ReceiveScheme} from './receive-scheme';

export interface CartEntrySchema extends DatabaseSchema {
  recipeId: string;
  ingredients: IngredientSchema[]
}

export class CartEntry extends FrontendObject {
  constructor(public recipeId: string, public ingredients: Ingredient[]) {
    super();
  }
}

class CartEntryReceiveScheme implements ReceiveScheme {
  public receive(cartEntrySchema: CartEntrySchema): CartEntry {
    let recipeId = DefaultTransferActions.stringAction(cartEntrySchema.recipeId);
    let ingredients = DefaultTransferActions.arrayAction(cartEntrySchema.ingredients);

    let transferredIngredients = ingredients.map((ingredient) => {
      return ingredientReceiveScheme.receive(ingredient);
    });

    return new CartEntry(recipeId, transferredIngredients);
  }
}

export const cartEntryReceiveScheme = new CartEntryReceiveScheme();
