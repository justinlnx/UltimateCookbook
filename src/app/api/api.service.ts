import {Injectable} from '@angular/core';
import {AngularFire, FirebaseListObservable, FirebaseObjectObservable} from 'angularfire2';
import {Observable} from 'rxjs';
import {ErrorReportService} from '../error-report';
import {generateGuid} from './guid';

type Guid = string;

export interface Recipe {
  id: string;
  avatar: string;
  name: string;
  author: string;
  description: string;
  imageSources: string[];
}

const PUBLIC_RECIPES_URL = '/public/recipes';

@Injectable()
export class ApiService {
  private recipeListObservable: FirebaseListObservable<Recipe[]>;
  private recipes: Recipe[];

  constructor(private af: AngularFire, private errorReportService: ErrorReportService) {
    this.recipes = [];

    this.recipeListObservable = this.af.database.list(PUBLIC_RECIPES_URL);

    this.recipeListObservable.subscribe(
        (recipes) => {
          if (recipes) {
            this.recipes = recipes;
          }
        },
        (err) => {
          this.errorReportService.send(err);
        });
  }

  public getAllRecipes(): FirebaseListObservable<Recipe[]> {
    return this.recipeListObservable;
  }

  public getAllCachedRecipes(): Recipe[] {
    return this.recipes;
  }

  public getRecipe(id: Guid): Recipe {
    if (this.recipes.length === 0) {
      return null;
    } else {
      let found = this.recipes.find((recipe) => {return recipe.id === id});

      return found ? found : null;
    };
  }

  public addRecipe(recipe: Recipe): void {
    recipe.id = generateGuid();

    let list = this.af.database.list(PUBLIC_RECIPES_URL);

    list.push(recipe).then(
        _ => console.log('success.'), (err) => this.errorReportService.send(err.message));
  }

  public deleteRecipe(recipe: Recipe): Observable<boolean> {
    return Observable.of(true);
  }

  public updateRecipe(recipe: Recipe): Observable<boolean> {
    return Observable.of(true);
  }
}
