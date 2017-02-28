import {Injectable} from '@angular/core';
import {AngularFire} from 'angularfire2';
import {Observable} from 'rxjs/Observable';

interface Recipe {
  name: string;
  author: string;
  description: string;
  imageSources: string[];
}

@Injectable()
export class ApiService {
  constructor(private af: AngularFire) {}

  // for example
  public getAllRecipes(): Observable<Recipe[]> {
    // this.af.database.
    return Observable.of([]);
  }

  public getRecipe(name: string): Observable<Recipe> {
    return Observable.of(null);
  }

  public addRecipe(recipe: Recipe): Observable<boolean> {
    return Observable.of(true);
  }

  public deleteRecipe(recipe: Recipe): Observable<boolean> {
    return Observable.of(true);
  }

  public updateRecipe(recipe: Recipe): Observable<boolean> {
    return Observable.of(true);
  }
}
