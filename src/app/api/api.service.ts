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
  recipes: FirebaseListObservable<any>;

  constructor(private af: AngularFire) {
    this.recipes = this.af.database.list('/public/recipes');
  }

  public getAllRecipes(): Observable<Recipe[]> {
    return this.recipes;
  }

  public getRecipe(id: Guid): Observable<Recipe> {
    this.recipes.subscribe(recipeList => {
      recipeList.forEach(recipe => {
        if(recipe.id === id) {
          return recipe;
        }
        else {
          console.log('Recipe id not found.');
        }
      });
    });
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
