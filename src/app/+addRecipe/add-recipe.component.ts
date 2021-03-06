import {Location} from '@angular/common';
import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {AngularFire, FirebaseAuthState} from 'angularfire2';
import {Subject} from 'rxjs/Subject';
import {Subscription} from 'rxjs/Subscription';

import {ApiService, PushRecipeSchema, Recipe} from '../api';
import {ErrorReportService} from '../error-report';
import {createSingleFileUploader, FileUploader} from '../file-upload';
import {IndeterminateProgressBarService} from '../global-progress-bars';

@Component({
  selector: 'add-recipe',
  template: `
  <md-toolbar class="top-toolbar" color="primary">
    <button md-icon-button class="back-button" (click)="onNavigatingBack()">
      <md-icon>arrow_back</md-icon>
    </button>
    <span>Add a recipe</span>
    <span class="toolbar-spacer"></span>
    <button md-icon-button (click)="onAddRecipe()">
      <md-icon>done</md-icon>
    </button>
  </md-toolbar>

  <div class="page-content">
    <login-warning *ngIf="!userLoggedIn"></login-warning>
    <div class="add-field" *ngIf="userLoggedIn">
      <form class="recipeForm" [formGroup]="addRecipeForm" novalidate>
        <div class="upload-line">
          <button md-mini-fab (click)="onSelectAvatar()">
            <md-icon>file_upload</md-icon>
          </button>
          <md-input-container class="avatar-file-name">
            <input mdInput type="text" disabled [value]="avatarUploadFileName" placeholder="Recipe avatar">
          </md-input-container>
          <hidden-file-selector [uploader]="imageUploader"
                                [clickEventSubject]="avatarClickSubject"
                                (onSelected)="onAvatarSelected($event)">
          </hidden-file-selector>
        </div>
        <md-input-container md-no-float [dividerColor]="titleInputColor()">
            <input mdInput placeholder="Title" type="text" formControlName="recipeName">
            <md-hint *ngIf="!validateTitleNotEmpty()" id="empty-title-warning">Recipe title cannot be empty</md-hint>
        </md-input-container>

        <md-input-container md-no-float [dividerColor]="descriptionInputColor()" class="md-block">
          <input mdInput placeholder="Description" type="text" formControlName="recipeDescription">
          <md-hint *ngIf="!validateDescriptionNotEmpty()" id="empty-desc-warning">Recipe description cannot be empty</md-hint>
        </md-input-container>

        <div formArrayName="stepDesc" class="step-description">
          <div class="step-desc-item" *ngFor="let step of stepsArray.controls; let i = index" [formGroupName]="i">
            <button md-icon-button class="addPhoto" [class.selected]="stepPhotoSeleted(i)" (click)="onSelectPhoto(i)">
              <md-icon>add_a_photo</md-icon>
            </button>
            <md-input-container [dividerColor]="stepDescInputColor(i)" class="step-desc-input-container">
              <input mdInput placeholder="Step {{i+1}}" type="text" formControlName="stepDescription">
              <md-hint *ngIf="!validateStepDescNotEmpty(i)" id="empty-step-desc-warning">Recipe step description cannot be empty</md-hint>
            </md-input-container>
            <hidden-file-selector [uploader]="imageUploader"
                                  [clickEventSubject]="stepPhotoClickSubjects[i]"
                                  (onSelected)="onStepPhotoSelected($event, i)">
            </hidden-file-selector>
          </div>
        </div>
        <div>
          <button md-raised-button (click)="addStep()">Add Step</button>
          <button md-raised-button (click)="removeStep()" [disabled]='!validateStepsArraySize()'>Remove Step</button>
        </div>

        <div formArrayName="ingredientsList">
          <md-input-container md-no-float [dividerColor]="ingredientInputColor(i)"
            *ngFor="let ingredient of ingredientsArray.controls; let i = index" [formGroupName]="i">
            <input mdInput placeholder="Ingredient {{i+1}}" type="text" formControlName="ingredientDescription">
            <md-hint *ngIf="!validateIngredientNotEmpty(i)" id="empty-ingredient-warning">Recipe ingredient cannot be empty</md-hint>
          </md-input-container>
        </div>
        <div>
          <button md-raised-button (click)="addIngredient()">Add Ingredient</button>
          <button md-raised-button (click)="removeIngredient()" [disabled]='!validateIngredientsArraySize()'>Remove Ingredient</button>
        </div>
      </form>
    </div>
  </div>
  `,
  styleUrls: ['./add-recipe.component.scss']
})
export class AddRecipeComponent implements OnInit, OnDestroy {
  public userLoggedIn: boolean = false;
  public addRecipeForm: FormGroup;
  public imageUploader = createSingleFileUploader();

  public avatarUploadFileName = '';

  public avatarClickSubject = new Subject<string>();
  public stepPhotoClickSubjects: Array<Subject<string>> = [];

  private logInSubscription: Subscription;
  private authState: FirebaseAuthState;

  get stepsArray(): FormArray {
    return this.addRecipeForm.get('stepDesc') as FormArray;
  }

  get ingredientsArray(): FormArray {
    return this.addRecipeForm.get('ingredientsList') as FormArray;
  }

  constructor(
      private af: AngularFire, private errorReportService: ErrorReportService,
      private fb: FormBuilder, private apiService: ApiService, private router: Router,
      public location: Location, public loadingService: IndeterminateProgressBarService) {}

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

  public validAddRecipeForm(): boolean {
    return this.addRecipeForm.valid;
  }

  public addStep() {
    this.stepsArray.push(this.initStep());
  }

  public removeStep() {
    this.stepPhotoClickSubjects.pop();
    this.stepsArray.removeAt(this.stepsArray.length - 1);
  }

  public validateStepsArraySize(): boolean {
    if (!this.stepsArray || this.stepsArray.length <= 1) {
      return false;
    }
    return true;
  }

  public titleInputColor(): string {
    return this.inputColor(this.validateTitleNotEmpty());
  }

  public validateTitleNotEmpty(): boolean {
    return this.addRecipeForm.controls['recipeName'].valid;
  }

  public descriptionInputColor(): string {
    return this.inputColor(this.validateDescriptionNotEmpty());
  }

  public validateDescriptionNotEmpty(): boolean {
    return this.addRecipeForm.controls['recipeDescription'].valid;
  }

  public stepDescInputColor(index: number): string {
    return this.inputColor(this.validateStepDescNotEmpty(index));
  }

  public validateStepDescNotEmpty(index: number): boolean {
    return this.stepsArray.at(index).valid;
  }

  public ingredientInputColor(index: number): string {
    return this.inputColor(this.validateIngredientNotEmpty(index));
  }

  public validateIngredientNotEmpty(index: number): boolean {
    return this.ingredientsArray.at(index).valid;
  }

  public addIngredient() {
    this.ingredientsArray.push(this.initIngredient());
  }

  public removeIngredient() {
    this.ingredientsArray.removeAt(this.ingredientsArray.length - 1);
  }

  public validateIngredientsArraySize(): boolean {
    if (!this.ingredientsArray || this.ingredientsArray.length <= 1) {
      return false;
    }
    return true;
  }

  public onSelectAvatar(): void {
    this.avatarClickSubject.next('open');
  }

  public onAvatarSelected(fileName: string): void {
    this.avatarUploadFileName = fileName;
  }

  public onSelectPhoto(index: number): void {
    this.stepPhotoClickSubjects[index].next('open');
  }

  public stepPhotoSeleted(index: number): boolean {
    let stepFormGroup = this.stepsArray.at(index);

    return stepFormGroup.get('imageFileUrl').value !== '';
  }

  public onStepPhotoSelected(fileName: string, index: number): void {
    this.stepsArray.at(index).get('imageFileUrl').setValue(fileName);
  }

  public onNavigatingBack() {
    this.location.back();
  }

  public onAddRecipe() {
    if (this.validAddRecipeForm()) {
      this.uploadImages();
    } else {
      this.errorReportService.send('Please fill in the required attributes');
    }
  }

  private uploadImages(): void {
    if (this.imageUploader.queue.length === 0) {
      this.onUploadComplete();
      return;
    }

    this.loadingService.addTask();

    const self = this;

    for (let item of this.imageUploader.queue) {
      item.onComplete = (response: string) => {
        self.updateDownloadableUrlForSteps(item.file.name, response);
        self.updateAvatarUrl(item.file.name, response);
      };
    }

    this.imageUploader.uploadAll();

    this.imageUploader.onCompleteAll = () => {
      self.loadingService.taskFinished();
      self.onUploadComplete();
    };
  }

  private onUploadComplete(): void {
    let avatar = this.avatarUploadFileName;
    let name = this.addRecipeForm.value.recipeName;
    let description = this.addRecipeForm.value.recipeDescription;
    let authorId = this.authState.uid;
    let steps = this.stepsArray.controls.map((control) => {
      return {content: control.value.stepDescription, imageSource: control.value.imageFileUrl};
    });
    let ingredients = this.ingredientsArray.controls.map((control) => {
      return control.value.ingredientDescription;
    });
    let comments = [];
    let likedUsers = [];
    let newRecipe: PushRecipeSchema;
    newRecipe = {avatar, name, authorId, description, steps, ingredients, comments, likedUsers};

    if (this.addRecipeForm.valid) {
      this.apiService.addRecipe(newRecipe);
      this.nagivateToRecipesPage();
    } else {
      this.errorReportService.send('Please fill in required fields.');
      return;
    }
  }

  private updateDownloadableUrlForSteps(originalFilename, downloadableUrl): void {
    for (let stepArrayIndex = 0; stepArrayIndex < this.stepsArray.length; stepArrayIndex++) {
      let stepControlGroup = this.stepsArray.at(stepArrayIndex);
      let imageControl = stepControlGroup.get('imageFileUrl');

      let imageFileName = imageControl.value;

      if (imageFileName === originalFilename) {
        imageControl.setValue(downloadableUrl);
      }
    }
  }

  private updateAvatarUrl(originalFilename, downloadableUrl): void {
    if (originalFilename === this.avatarUploadFileName) {
      this.avatarUploadFileName = downloadableUrl;
    }
  }

  private inputColor(valid: boolean): string {
    return valid ? 'primary' : 'warn';
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

    this.stepPhotoClickSubjects.push(new Subject<string>());
  }

  private initStep() {
    this.stepPhotoClickSubjects.push(new Subject<string>());

    return this.fb.group({stepDescription: ['', [Validators.required]], imageFileUrl: ['']});
  }

  private initIngredient() {
    return this.fb.group({
      ingredientDescription: ['', [Validators.required]],
    });
  }

  private nagivateToRecipesPage() {
    this.router.navigateByUrl('/home');
  }
}
