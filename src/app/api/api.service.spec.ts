import {DebugElement} from '@angular/core';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
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

  it('delete recipe with empty key throws', async((done) => {
       apiService.errorReportService.asObservable().subscribe(
           (errorMessage) => expect(errorMessage).toEqual('Invalid Key'),
           (_) => {
             console.log('Error occurred');
           },
           () => {
             done();
           });
       apiService.deleteRecipe('');
       apiService.deleteRecipe(undefined);
       apiService.deleteRecipe(null);
     }));
});
