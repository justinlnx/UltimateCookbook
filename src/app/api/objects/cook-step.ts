import {DatabaseSchema} from './database-schema';
import {DefaultTransferActions} from './default-transfer-actions';
import {FrontendObject} from './frontend-object';
import {ReceiveScheme} from './receive-scheme';

export interface CookStepSchema extends DatabaseSchema {
  content: string;
  imageSource: string;
}

export class CookStep extends FrontendObject {
  constructor(public content: string, public imageSource: string) {
    super();
  }
}

// tslint:disable-next-line:max-classes-per-file
class CookStepReceiveScheme implements ReceiveScheme {
  public receive(cookStepSchema: CookStepSchema): CookStep {
    let content = DefaultTransferActions.stringAction(cookStepSchema.content);
    let imageSource = DefaultTransferActions.stringAction(cookStepSchema.imageSource);

    return new CookStep(content, imageSource);
  }
}

export const cookStepReceiveScheme = new CookStepReceiveScheme();
