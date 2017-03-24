import {DatabaseSchema} from './database-schema';
import {FrontendObject} from './frontend-object';

export interface ReceiveScheme { receive: (schema: DatabaseSchema) => FrontendObject; }
