import {Injectable} from '@angular/core';
import {AngularFire, FirebaseListObservable, FirebaseObjectObservable} from 'angularfire2';
import {Observable} from 'rxjs/Observable';
import {ErrorReportService} from '../error-report';
import {generateGuid} from './guid';

type Guid = string;

export interface PushRecipe {
  avatar: string;
  name: string;
  author: string;
  description: string;
  imageSources: string[];
  rating: number;
}

export interface Recipe extends PushRecipe { $key: string; }

const PUBLIC_RECIPES_URL = '/public/recipes';

@Injectable()
export class ApiService {
  private recipeListObservable: FirebaseListObservable<Recipe[]>;
  private recipes: Recipe[];

  constructor(private af: AngularFire, public errorReportService: ErrorReportService) {
    this.recipes = [];

    this.recipeListObservable = this.af.database.list(PUBLIC_RECIPES_URL);
  }

  public getAllRecipes(): FirebaseListObservable<Recipe[]> {
    return this.recipeListObservable;
  }

  public getRecipe($key: string): FirebaseObjectObservable<Recipe> {
    return this.af.database.object(`${PUBLIC_RECIPES_URL}/${$key}`);
  }

  public addRecipe(recipe: PushRecipe): void {
    this.recipeListObservable.push(recipe).then(
        (_) => console.log('success.'), (err) => this.errorReportService.send(err.message));
  }

  public deleteRecipe($key: string): void {
    if ($key === undefined || $key === null || $key.length === 0) {
      throw new Error('Empty Key');
    } else {
      this.af.database.list(PUBLIC_RECIPES_URL)
          .remove($key)
          .then((_) => console.log('200: OK'), (err) => this.errorReportService.send(err.message));
    }
  }

  public updateRecipe(recipe: Recipe): Observable<boolean> {
    return Observable.of(true);
  }
}
