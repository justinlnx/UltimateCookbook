import {DatabaseSchema, PushDatabaseSchema} from './database-schema';

export abstract class FrontendObject {
  public abstract asSchema(): DatabaseSchema;
  public abstract asPushSchema(): PushDatabaseSchema;
}
