import {DatabaseSchema, PushDatabaseSchema} from './database-schema';

export abstract class FrontendObject {
  constructor(public $key) {}

  public abstract asPushSchema(): PushDatabaseSchema;
  public abstract asSchema(): DatabaseSchema;

  protected pushSchemaToSchema(): any {
    let schema: any = this.asPushSchema();
    schema.$key = this.$key;
    return schema;
  }
}
