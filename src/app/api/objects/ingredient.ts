import {DatabaseSchema} from './database-schema';
import {DefaultTransferActions} from './default-transfer-actions';
import {FrontendObject} from './frontend-object';
import {ReceiveScheme} from './receive-scheme';

export interface PushIngredientSchema extends DatabaseSchema {
  content: string;
  bought: boolean;
}

export interface IngredientSchema extends PushIngredientSchema { $key: string; }

export class Ingredient extends FrontendObject {
  constructor(public $key: string, public content: string, public bought: boolean) {
    super();
  }

  public asPushSchema(): PushIngredientSchema {
    return {content: this.content, bought: this.bought};
  }

  public asSchema(): IngredientSchema {
    let schema: any = this.asPushSchema();
    schema.$key = this.$key;
    return schema;
  }
}

// tslint:disable-next-line:max-classes-per-file
class IngredientReceiveScheme implements ReceiveScheme {
  public receive(ingredientSchema: IngredientSchema): Ingredient {
    let $key = DefaultTransferActions.requiredStringAction(ingredientSchema.$key);
    let content = DefaultTransferActions.stringAction(ingredientSchema.content);
    let bought = DefaultTransferActions.booleanAction(ingredientSchema.bought);

    return new Ingredient($key, content, bought);
  }
}

export const ingredientReceiveScheme = new IngredientReceiveScheme();
