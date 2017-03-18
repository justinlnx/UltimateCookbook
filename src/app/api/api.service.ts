import { Injectable } from '@angular/core';
import { AngularFire, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';
import { Observable } from 'rxjs/Observable';
import { ErrorReportService } from '../error-report';
import { generateGuid } from './guid';

type Guid = string;

export interface PushRecipe {
  avatar: string;
  name: string;
  author: string;
  description: string;
  imageSources: string[];
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

  public updateRecipe($key: string, attributeName: string, newValue: any): void {

    if ($key === undefined || $key === null || $key.length === 0) {
      let exception = 'Invalid Key';
      this.errorReportService.send(exception);
    }
    else {
      if (attributeName === "steps") {
        this.updateSteps($key, newValue);
      }
      else if (attributeName === "author") {
        this.updateAuthor($key, newValue);
      }
      else if (attributeName === "avatar") {
        this.updateAvatar($key, newValue);
      }
      else if (attributeName === "description") {
        this.updateDescription($key, newValue);
      }
      else if (attributeName === "imageSources") {
        this.updateImageSources($key, newValue);
      }
      else if (attributeName === "ingredients") {
        this.updateIngredients($key, newValue);
      }
      else if (attributeName === "name") {
        this.updateName($key, newValue);
      }
      else if (attributeName === "rating") {
        this.updateRating($key, newValue);
      }
    }
  }

  private updateSteps($key: string, newSteps: string[]): void {
    this.af.database.list(PUBLIC_RECIPES_URL)
      .update($key, { steps: newSteps })
      .then((_) => console.log('200: OK'), (err) => this.errorReportService.send(err.message));
  }

  private updateAuthor($key: string, newAuthor: string): void {
    this.af.database.list(PUBLIC_RECIPES_URL)
      .update($key, { author: newAuthor })
      .then((_) => console.log('200: OK'), (err) => this.errorReportService.send(err.message));
  }

  private updateAvatar($key: string, newAvatar: string): void {
    this.af.database.list(PUBLIC_RECIPES_URL)
      .update($key, { avatar: newAvatar })
      .then((_) => console.log('200: OK'), (err) => this.errorReportService.send(err.message));
  }

  private updateDescription($key: string, newDescription: string): void {
    this.af.database.list(PUBLIC_RECIPES_URL)
      .update($key, { description: newDescription })
      .then((_) => console.log('200: OK'), (err) => this.errorReportService.send(err.message));
  }

  private updateImageSources($key: string, newImageSources: string[]): void {
    this.af.database.list(PUBLIC_RECIPES_URL)
      .update($key, { imageSources: newImageSources })
      .then((_) => console.log('200: OK'), (err) => this.errorReportService.send(err.message));
  }

  private updateIngredients($key: string, newIngredients: string[]): void {
    this.af.database.list(PUBLIC_RECIPES_URL)
      .update($key, { ingredients: newIngredients })
      .then((_) => console.log('200: OK'), (err) => this.errorReportService.send(err.message));
  }

  private updateName($key: string, newName: string): void {
    this.af.database.list(PUBLIC_RECIPES_URL)
      .update($key, { name: newName })
      .then((_) => console.log('200: OK'), (err) => this.errorReportService.send(err.message));
  }

  private updateRating($key: string, newRating: number): void {
    this.af.database.list(PUBLIC_RECIPES_URL)
      .update($key, { rating: newRating })
      .then((_) => console.log('200: OK'), (err) => this.errorReportService.send(err.message));
  }
}