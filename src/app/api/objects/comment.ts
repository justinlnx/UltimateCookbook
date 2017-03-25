import {DatabaseSchema} from './database-schema';
import {DefaultTransferActions} from './default-transfer-actions';
import {FrontendObject} from './frontend-object';
import {ReceiveScheme} from './receive-scheme';

export interface PushCommentSchema extends DatabaseSchema {
  content: string;
  userId: string;
}

export interface CommentSchema extends PushCommentSchema { $key: string; }

export class Comment extends FrontendObject {
  constructor(public $key: string, public content: string, public userId: string) {
    super();
  }

  public asPushSchema(): PushCommentSchema {
    return {content: this.content, userId: this.userId};
  }

  public asSchema(): CommentSchema {
    let schema: any = this.asPushSchema();
    schema.$key = this.$key;
    return schema;
  }
}

// tslint:disable-next-line:max-classes-per-file
class CommentReceiveScheme implements ReceiveScheme {
  public receive(commentSchema: CommentSchema): Comment {
    let $key = DefaultTransferActions.requiredStringAction(commentSchema.$key);
    let content = DefaultTransferActions.stringAction(commentSchema.content);
    let userId = DefaultTransferActions.stringAction(commentSchema.userId);

    return new Comment($key, content, userId);
  }
}

export const commentReceiveScheme = new CommentReceiveScheme();
