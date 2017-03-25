import {Observable} from 'rxjs/Observable';

import {DatabaseSchema} from './database-schema';
import {FrontendObject} from './frontend-object';

import {ReceiveScheme} from './receive-scheme';

export class Mapper {
  public static mapObservable(observable: Observable<DatabaseSchema>, receiveScheme: ReceiveScheme):
      Observable<FrontendObject> {
    return observable.map((value) => {
      return receiveScheme.receive(value);
    });
  }

  public static mapListObservable(
      observable: Observable<DatabaseSchema[]>,
      receiveScheme: ReceiveScheme): Observable<FrontendObject[]> {
    return observable.map((list) => {
      return list.map((value) => {
        return receiveScheme.receive(value);
      });
    });
  }
}
