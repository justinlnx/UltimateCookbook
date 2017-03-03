import {Injectable} from '@angular/core';
import {AngularFire, FirebaseListObservable, FirebaseObjectObservable} from 'angularfire2';
import {Observable} from 'rxjs/Observable';

type Guid = string;

interface Recipe {
  name: string;
  author: string;
  description: string;
  imageSources: string[];
}

@Injectable()
export class ApiService {
  constructor(private af: AngularFire) {}

  public getAllRecipes(): Observable<Recipe[]> {
    return this.af.database.list('/public/recipes');
  }

  public getRecipe(id: Guid): Observable<Recipe> {
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
