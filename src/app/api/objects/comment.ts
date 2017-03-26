import {DatabaseSchema, PushDatabaseSchema} from './database-schema';
import {DefaultTransferActions} from './default-transfer-actions';
import {FrontendObject} from './frontend-object';
import {ReceiveScheme} from './receive-scheme';

export interface PushCommentSchema extends PushDatabaseSchema {
  content: string;
  userId: string;
}

export interface CommentSchema extends PushCommentSchema, DatabaseSchema {}

export class Comment extends FrontendObject {
  constructor(public $key: string, public content: string, public userId: string) {
    super($key);
  }

  public asPushSchema(): PushCommentSchema {
    return {content: this.content, userId: this.userId};
  }

  public asSchema(): CommentSchema {
    return this.pushSchemaToSchema();
  }
}

// tslint:disable-next-line:max-classes-per-file
class CommentReceiveScheme extends ReceiveScheme {
  public receiveAsDescendant(commentSchema: PushCommentSchema, index: string): Comment {
    let $key = DefaultTransferActions.requiredStringAction(index);
    let content = DefaultTransferActions.stringAction(commentSchema.content);
    let userId = DefaultTransferActions.stringAction(commentSchema.userId);

    return new Comment($key, content, userId);
  }
}

export const commentReceiveScheme = new CommentReceiveScheme();
