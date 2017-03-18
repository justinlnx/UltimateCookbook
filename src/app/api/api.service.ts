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
  rating: number;
  imageSources: string[];
  steps: string[];
  ingredients: string[];
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

  public updateRecipe($key: string, updateRecipe: Recipe): void {
    if ($key === undefined || $key === null || $key.length === 0) {
      let exception = 'Invalid Key';
      this.errorReportService.send(exception);
    } else {
      let currentRecipe;
      this.getRecipe($key).subscribe((x) => {
        currentRecipe = x;
        if (!this.checkArrayEqual(currentRecipe.steps, updateRecipe.steps)) {
          this.updateSteps($key, updateRecipe.steps);
        }
        if (currentRecipe.author !== updateRecipe.author) {
          this.updateAuthor($key, updateRecipe.author);
        }
        if (currentRecipe.avatar !== updateRecipe.avatar) {
          this.updateAvatar($key, updateRecipe.avatar);
        }
        if (currentRecipe.description !== updateRecipe.description) {
          this.updateDescription($key, updateRecipe.description);
        }
        if (!this.checkArrayEqual(currentRecipe.imageSources, updateRecipe.imageSources)) {
          this.updateImageSources($key, updateRecipe.imageSources);
        }
        if (!this.checkArrayEqual(currentRecipe.ingredients, updateRecipe.ingredients)) {
          this.updateIngredients($key, updateRecipe.ingredients);
        }
        if (currentRecipe.name !== updateRecipe.name) {
          this.updateName($key, updateRecipe.avatar);
        }
        if (currentRecipe.rating !== updateRecipe.rating) {
          this.updateRating($key, updateRecipe.rating);
        }
      });
    }
  }
  private checkArrayEqual(arr1: string[], arr2: string[]): boolean {
    if (arr1.length !== arr2.length) {
      return false;
    }
    for (let i = 0; i < arr1.length; i++) {
      if (arr1[i] !== arr2[i]) {
        return false;
      }
    }
    return true;
  }
  private updateSteps($key: string, newSteps: string[]): void {
    this.af.database.list(PUBLIC_RECIPES_URL)
        .update($key, {steps: newSteps})
        .then((_) => console.log('200: OK'), (err) => this.errorReportService.send(err.message));
  }

  private updateAuthor($key: string, newAuthor: string): void {
    this.af.database.list(PUBLIC_RECIPES_URL)
        .update($key, {author: newAuthor})
        .then((_) => console.log('200: OK'), (err) => this.errorReportService.send(err.message));
  }

  private updateAvatar($key: string, newAvatar: string): void {
    this.af.database.list(PUBLIC_RECIPES_URL)
        .update($key, {avatar: newAvatar})
        .then((_) => console.log('200: OK'), (err) => this.errorReportService.send(err.message));
  }

  private updateDescription($key: string, newDescription: string): void {
    this.af.database.list(PUBLIC_RECIPES_URL)
        .update($key, {description: newDescription})
        .then((_) => console.log('200: OK'), (err) => this.errorReportService.send(err.message));
  }

  private updateImageSources($key: string, newImageSources: string[]): void {
    this.af.database.list(PUBLIC_RECIPES_URL)
        .update($key, {imageSources: newImageSources})
        .then((_) => console.log('200: OK'), (err) => this.errorReportService.send(err.message));
  }

  private updateIngredients($key: string, newIngredients: string[]): void {
    this.af.database.list(PUBLIC_RECIPES_URL)
        .update($key, {ingredients: newIngredients})
        .then((_) => console.log('200: OK'), (err) => this.errorReportService.send(err.message));
  }

  private updateName($key: string, newName: string): void {
    this.af.database.list(PUBLIC_RECIPES_URL)
        .update($key, {name: newName})
        .then((_) => console.log('200: OK'), (err) => this.errorReportService.send(err.message));
  }

  private updateRating($key: string, newRating: number): void {
    this.af.database.list(PUBLIC_RECIPES_URL)
        .update($key, {rating: newRating})
        .then((_) => console.log('200: OK'), (err) => this.errorReportService.send(err.message));
  }
}
