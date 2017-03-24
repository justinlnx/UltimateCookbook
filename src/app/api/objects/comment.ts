import {DatabaseSchema} from './database-schema';
import {DefaultTransferActions} from './default-transfer-actions';
import {FrontendObject} from './frontend-object';
import {ReceiveScheme} from './receive-scheme';

export interface CommentSchema extends DatabaseSchema {
  content: string;
  userId: string;
}

export class Comment extends FrontendObject {
  constructor(public content: string, public userId: string) {
    super();
  }
}

class CommentReceiveScheme implements ReceiveScheme {
  public receive(commentSchema: CommentSchema): Comment {
    let content = DefaultTransferActions.stringAction(commentSchema.content);
    let userId = DefaultTransferActions.stringAction(commentSchema.userId);

    return new Comment(content, userId);
  }
}

export const commentReceiveScheme = new CommentReceiveScheme();
