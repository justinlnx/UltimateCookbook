import {DatabaseSchema, PushDatabaseSchema} from './database-schema';
import {DefaultTransferActions} from './default-transfer-actions';
import {FrontendObject} from './frontend-object';
import {ReceiveScheme} from './receive-scheme';

export interface PushCookStepSchema extends PushDatabaseSchema {
  content: string;
  imageSource: string;
}

export interface CookStepSchema extends PushCookStepSchema, DatabaseSchema {}

export class CookStep extends FrontendObject {
  constructor(public $key: string, public content: string, public imageSource: string) {
    super($key);
  }

  public asPushSchema(): PushCookStepSchema {
    return {content: this.content, imageSource: this.imageSource};
  }

  public asSchema(): CookStepSchema {
    return this.pushSchemaToSchema();
  }
}

// tslint:disable-next-line:max-classes-per-file
class CookStepReceiveScheme extends ReceiveScheme {
  public receiveAsDescendant(cookStepSchema: PushCookStepSchema, index: string): CookStep {
    let $key = DefaultTransferActions.requiredStringAction(index);
    let content = DefaultTransferActions.stringAction(cookStepSchema.content);
    let imageSource = DefaultTransferActions.stringAction(cookStepSchema.imageSource);

    return new CookStep($key, content, imageSource);
  }
}

export const cookStepReceiveScheme = new CookStepReceiveScheme();
