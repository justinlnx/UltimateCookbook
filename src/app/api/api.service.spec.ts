import {AngularFire} from 'angularfire2';
import {Observable} from 'rxjs/Observable';
import {ErrorReportService} from '../error-report';
import {ApiService} from './api.service';

describe('delete api', () => {
  let apiService: ApiService;
  let afStub = {
    database: {
      object: (url: string) => {
        return Observable.of(null);
      },
      list: (url: string) => {
        return Observable.of(null);
      }
    }
  };

  beforeEach(() => {
    apiService = new ApiService(afStub as AngularFire, new ErrorReportService());
  });

  it('Delete recipe with empty key throws', () => {
    let errorMessage = 'Empty Key';

    expect(() => {
      apiService.deleteRecipe('');
    }).toThrowError(errorMessage);
    expect(() => {
      apiService.deleteRecipe(undefined);
    }).toThrowError(errorMessage);
    expect(() => {
      apiService.deleteRecipe(null);
    }).toThrowError(errorMessage);
  });
});
