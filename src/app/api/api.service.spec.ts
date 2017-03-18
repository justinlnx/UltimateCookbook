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
  let stubApiService = {AngularFire: afStub, ErrorReportService: new ErrorReportService()};

  TestBed.configureTestingModule({providers: [{provide: ApiService, useValue: stubApiService}]});

  beforeEach(() => {
    apiService = TestBed.get(ApiService);
  });

  it('delete recipe with empty key throws', () => {
    this.apiService.deleteRecipe('').subscribe((errorMessage) => {
      expect(errorMessage).toBe('Invalid Key');
    });
  });
});
