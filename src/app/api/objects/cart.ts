import {DatabaseSchema} from './database-schema';
import {DefaultTransferActions} from './default-transfer-actions';
import {FrontendObject} from './frontend-object';
import {Ingredient, ingredientReceiveScheme, IngredientSchema} from './ingredient';
import {ReceiveScheme} from './receive-scheme';

export interface PushCartEntrySchema extends DatabaseSchema {
  recipeId: string;
  ingredients: IngredientSchema[];
}

export interface CartEntrySchema extends PushCartEntrySchema { $key: string; }

export class CartEntry extends FrontendObject {
  constructor(public $key: string, public recipeId: string, public ingredients: Ingredient[]) {
    super();
  }

  public asPushSchema(): PushCartEntrySchema {
    return {recipeId: this.recipeId, ingredients: this.ingredientsSchema()};
  }

  public asSchema(): CartEntrySchema {
    let schema: any = this.asPushSchema();
    schema.$key = this.$key;
    return schema;
  }

  private ingredientsSchema(): IngredientSchema[] {
    return this.ingredients.map((ingredient) => {
      return ingredient.asSchema();
    });
  }
}

// tslint:disable-next-line:max-classes-per-file
class CartEntryReceiveScheme implements ReceiveScheme {
  public receive(cartEntrySchema: CartEntrySchema): CartEntry {
    let $key = DefaultTransferActions.requiredStringAction(cartEntrySchema.$key);
    let recipeId = DefaultTransferActions.stringAction(cartEntrySchema.recipeId);
    let ingredients = DefaultTransferActions.arrayAction(cartEntrySchema.ingredients);

    let transferredIngredients = ingredients.map((ingredient) => {
      return ingredientReceiveScheme.receive(ingredient);
    });

    return new CartEntry($key, recipeId, transferredIngredients);
  }
}

export const cartEntryReceiveScheme = new CartEntryReceiveScheme();
