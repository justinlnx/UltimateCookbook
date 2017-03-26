import {DatabaseSchema, PushDatabaseSchema} from './database-schema';
import {DefaultTransferActions} from './default-transfer-actions';
import {FrontendObject} from './frontend-object';
import {ReceiveScheme} from './receive-scheme';

export interface PushIngredientSchema extends PushDatabaseSchema {
  content: string;
  bought: boolean;
}

export interface IngredientSchema extends PushIngredientSchema, DatabaseSchema {}

export class Ingredient extends FrontendObject {
  constructor(public $key: string, public content: string, public bought: boolean) {
    super($key);
  }

  public asPushSchema(): PushIngredientSchema {
    return {content: this.content, bought: this.bought};
  }

  public asSchema(): IngredientSchema {
    return this.pushSchemaToSchema();
  }
}

// tslint:disable-next-line:max-classes-per-file
class IngredientReceiveScheme extends ReceiveScheme {
  public receiveAsDescendant(ingredientSchema: PushIngredientSchema, index: string): Ingredient {
    let $key = DefaultTransferActions.requiredStringAction(index);
    let content = DefaultTransferActions.stringAction(ingredientSchema.content);
    let bought = DefaultTransferActions.booleanAction(ingredientSchema.bought);

    return new Ingredient($key, content, bought);
  }
}

export const ingredientReceiveScheme = new IngredientReceiveScheme();
