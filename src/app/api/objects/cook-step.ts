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
    super();
  }

  public asPushSchema(): PushCookStepSchema {
    return {content: this.content, imageSource: this.imageSource};
  }

  public asSchema(): CookStepSchema {
    let schema: any = this.asPushSchema();
    schema.$key = this.$key;
    return schema;
  }
}

// tslint:disable-next-line:max-classes-per-file
class CookStepReceiveScheme implements ReceiveScheme {
  public receive(cookStepSchema: CookStepSchema): CookStep {
    let $key = DefaultTransferActions.requiredStringAction(cookStepSchema.$key);
    let content = DefaultTransferActions.stringAction(cookStepSchema.content);
    let imageSource = DefaultTransferActions.stringAction(cookStepSchema.imageSource);

    return new CookStep($key, content, imageSource);
  }
}

export const cookStepReceiveScheme = new CookStepReceiveScheme();
