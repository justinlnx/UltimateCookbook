import {DatabaseSchema, PushDatabaseSchema} from './database-schema';
import {DefaultTransferActions} from './default-transfer-actions';
import {FrontendObject} from './frontend-object';
import {Message, messageRetrieveScheme, PushMessageSchema} from './message';
import {ReceiveScheme} from './receive-scheme';

export interface PushChatroomSchema extends PushDatabaseSchema {
  users: string[];
  messages: PushMessageSchema[];
}

export interface ChatroomSchema extends PushChatroomSchema, DatabaseSchema {}

export class Chatroom extends FrontendObject {
  constructor(public $key: string, public users: string[], public messages: Message[]) {
    super($key);
  }

  public asPushSchema(): PushChatroomSchema {
    return {users: this.users, messages: this.pushMessagesSchema()};
  }

  public asSchema(): ChatroomSchema {
    return this.pushSchemaToSchema();
  }

  private pushMessagesSchema(): PushMessageSchema[] {
    return this.messages.map((message) => {
      return message.asPushSchema();
    });
  }
}

// tslint:disable-next-line:max-classes-per-file
class ChatroomRetrieveScheme extends ReceiveScheme {
  public receiveAsDescendant(chatroomSchema: PushChatroomSchema, index: string): Chatroom {
    let $key = DefaultTransferActions.requiredStringAction(index);
    let users = DefaultTransferActions.arrayAction(chatroomSchema.users);
    let messages = DefaultTransferActions.arrayAction(chatroomSchema.messages);

    let transferredMessages: Message[] = [];

    for (let messageKey in messages) {
      if (messages.hasOwnProperty(messageKey)) {
        transferredMessages.push(
            messageRetrieveScheme.receiveAsDescendant(messages[messageKey], messageKey));
      }
    }

    return new Chatroom($key, users, transferredMessages);
  }
}

export const chatroomRetrieveScheme = new ChatroomRetrieveScheme();
