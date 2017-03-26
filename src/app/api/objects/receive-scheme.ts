import {DatabaseSchema, PushDatabaseSchema} from './database-schema';
import {FrontendObject} from './frontend-object';

export abstract class ReceiveScheme {
  public abstract receiveAsDescendant(schema: PushDatabaseSchema, index: string): FrontendObject;
  public receiveAsRoot(schema: DatabaseSchema): FrontendObject {
    return this.receiveAsDescendant(schema, schema.$key);
  }
}
