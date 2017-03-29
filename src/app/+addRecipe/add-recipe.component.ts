import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {AngularFire, FirebaseAuthState} from 'angularfire2';
import {Subscription} from 'rxjs/Subscription';

import {ApiService, PushRecipeSchema, Recipe} from '../api';
import {ErrorReportService} from '../error-report';

@Component({
  selector: 'add-recipe',
  template: `
  <md-toolbar class="top-toolbar" color="primary">
      <span>Add new recipe</span>
  </md-toolbar>

  <div class="page-content">
    <login-warning *ngIf="!userLoggedIn"></login-warning>
    <div class="add-field" *ngIf="userLoggedIn">
      <form class="recipeForm" [formGroup]="addRecipeForm" novalidate>
        <md-input-container md-no-float>
            <input mdInput placeholder="Title" type="text" formControlName="recipeName">
        </md-input-container>

        <md-input-container md-no-float class="md-block">
          <input mdInput placeholder="Description" type="text" formControlName="recipeDescription">
        </md-input-container>

        <div formArrayName="stepDesc">
        <md-input-container md-no-float *ngFor="let step of stepsArray.controls; let i = index" [formGroupName]="i">
          <button md-icon-button class="addPhoto" (click)="uploadPhoto()">
            <md-icon>add_a_photo</md-icon>
          </button>
          <textarea mdInput placeholder="Step {{i+1}}" type="text" formControlName="stepDescription"></textarea>
        </md-input-container>
        </div>
        <button md-raised-button (click)="addStep()">+ Step</button>

        <div formArrayName="ingredientsList">
        <md-input-container md-no-float *ngFor="let ingredient of ingredientsArray.controls; let i = index" [formGroupName]="i">
          <input mdInput placeholder="Ingredient {{i+1}}" type="text" formControlName="ingredientDescription">
        </md-input-container>
        </div>
        <button md-raised-button (click)="addIngredient()">+ Ingredient</button>
      </form>
    </div>
  </div>

  `,
  styleUrls: ['./add-recipe.component.scss']
})
export class AddRecipeComponent implements OnInit, OnDestroy {
  public userLoggedIn: boolean = false;
  public addRecipeForm: FormGroup;
  private logInSubscription: Subscription;
  private authState: FirebaseAuthState;

  get validAddRecipeForm(): boolean {
    return this.addRecipeForm.valid;
  }

  constructor(
      private af: AngularFire, private errorReportService: ErrorReportService,
      private fb: FormBuilder, private apiService: ApiService, private router: Router) {}

  public ngOnInit() {
    this.logInSubscription = this.af.auth.subscribe(
        (state) => {
          this.authState = state;
          this.userLoggedIn = state !== null;
        },
        (err) => {
          this.errorReportService.send(err);
        });

    this.createAddRecipeForm();
  }

  public ngOnDestroy() {
    this.logInSubscription.unsubscribe();
  }

  public addStep() {
    this.stepsArray.push(this.initStep());
  }

  public addIngredient() {
    this.ingredientsArray.push(this.initIngredient());
  }

  public uploadPhoto() {
    console.log('add photo TODO');
  }

  public onAddRecipe() {
    let avatar = '';
    let name = this.addRecipeForm.value.recipeName;
    let description = this.addRecipeForm.value.recipeDescription;
    let authorId = this.authState.uid;
    let steps = this.stepsArray.controls.map((control) => {
      return {content: control.value.stepDescription, imageSource: ''};
    });
    let ingredients = this.ingredientsArray.controls.map((control) => {
      return control.value.ingredientDescription;
    });
    let comments = [];
    let likedUsers = [];
    let newRecipe: PushRecipeSchema;
    newRecipe = {avatar, name, authorId, description, steps, ingredients, comments, likedUsers};

    this.apiService.addRecipe(newRecipe);
    this.nagivateToRecipesPage();
  }

  get stepsArray(): FormArray {
    return this.addRecipeForm.get('stepDesc') as FormArray;
  }

  get ingredientsArray(): FormArray {
    return this.addRecipeForm.get('ingredientsList') as FormArray;
  }

  private createAddRecipeForm() {
    this.addRecipeForm = this.fb.group({
      recipeName: ['', [Validators.required]],
      recipeDescription: ['', [Validators.required]],
      stepDesc: this.fb.array([
        this.initStep(),
      ]),
      ingredientsList: this.fb.array([
        this.initIngredient(),
      ])
    });
  }

  private initStep() {
    return this.fb.group({
      stepDescription: ['', [Validators.required]],
    });
  }

  private initIngredient() {
    return this.fb.group({
      ingredientDescription: ['', [Validators.required]],
    });
  }

  private nagivateToRecipesPage() {
    this.router.navigateByUrl('/recipes');
  }
}
