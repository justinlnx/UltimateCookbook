import {DatabaseSchema, PushDatabaseSchema} from './database-schema';
import {DefaultTransferActions} from './default-transfer-actions';
import {FrontendObject} from './frontend-object';
import {ReceiveScheme} from './receive-scheme';

export interface PushMessageSchema extends PushDatabaseSchema {
  sender: string;
  message: string;
  timestamp: number;
}

export interface MessageSchema extends PushMessageSchema, DatabaseSchema {}

export class Message extends FrontendObject {
  constructor(
      public $key: string, public sender: string, public message: string,
      public timestamp: number) {
    super($key);
  }

  public asPushSchema(): PushMessageSchema {
    return {sender: this.sender, message: this.message, timestamp: this.timestamp};
  }

  public asSchema(): Message {
    return this.pushSchemaToSchema();
  }
}

// tslint:disable-next-line:max-classes-per-file
class MessageRetrieveScheme extends ReceiveScheme {
  public receiveAsDescendant(messageSchema: PushMessageSchema, index: string): Message {
    let $key = DefaultTransferActions.requiredStringAction(index);
    let sender = DefaultTransferActions.stringAction(messageSchema.sender);
    let message = DefaultTransferActions.stringAction(messageSchema.message);
    let timestamp = DefaultTransferActions.numberAction(messageSchema.timestamp);
    return new Message($key, sender, message, timestamp);
  }
}

export const messageRetrieveScheme = new MessageRetrieveScheme();
