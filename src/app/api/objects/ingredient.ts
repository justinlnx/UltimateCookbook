import {DatabaseSchema} from './database-schema';
import {DefaultTransferActions} from './default-transfer-actions';
import {FrontendObject} from './frontend-object';
import {ReceiveScheme} from './receive-scheme';
import {RecipeId} from './types';

export interface IngredientSchema extends DatabaseSchema {
  content: string;
  bought: boolean;
}

export class Ingredient extends FrontendObject {
  constructor(public content: string, public bought: boolean) {
    super();
  }
}

class IngredientReceiveScheme implements ReceiveScheme {
  public receive(ingredientSchema: IngredientSchema): Ingredient {
    let content = DefaultTransferActions.stringAction(ingredientSchema.content);
    let bought = DefaultTransferActions.booleanAction(ingredientSchema.bought);

    return new Ingredient(content, bought);
  }
}

export const ingredientReceiveScheme = new IngredientReceiveScheme();
