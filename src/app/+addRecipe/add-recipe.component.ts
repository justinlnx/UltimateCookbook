import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AngularFire, FirebaseAuthState} from 'angularfire2';
import {Subscription} from 'rxjs/Subscription';
import {ApiService, Recipe} from '../api';

import {ErrorReportService} from '../error-report';

@Component({
  selector: 'add-recipe',
  template: `
  <login-warning *ngIf="!userLoggedIn"></login-warning>
  <div class="add-field" *ngIf="userLoggedIn">
    <h1>Add new Recipe</h1>
    <form [formGroup]="addRecipeForm" novalidate>
      <md-input-container>
        <input mdInput placeholder="Name" type="text" formControlName="name">
      </md-input-container>
      <md-input-container>
        <input mdInput placeholder="Description" type="text" formControlName="description">
      </md-input-container>
      <div>
        <button md-raised-button [disabled]="!validAddRecipeForm" type="button" (click)="onAddRecipe()">Add</button>
      </div>
    </form>
  </div>
  `
})
export class AddRecipeComponent implements OnInit {
  public userLoggedIn: boolean = false;
  public addRecipeForm: FormGroup;
  private logInSubscription: Subscription;
  private authState: FirebaseAuthState;

  get validAddRecipeForm(): boolean {
    return this.addRecipeForm.valid;
  }

  constructor(
      private af: AngularFire, private errorReportService: ErrorReportService,
      private fb: FormBuilder, private apiService: ApiService) {}

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

  public onAddRecipe() {
    let name = this.addRecipeForm.value.name;
    let description = this.addRecipeForm.value.description;
    let author = this.authState.auth.email;

    let newRecipe: Recipe = {
      name: name,
      description: description,
      id: '',
      author: author,
      avatar: '',
      imageSources: []
    };

    this.apiService.addRecipe(newRecipe);
  }

  private createAddRecipeForm() {
    this.addRecipeForm = this.fb.group(
        {'name': ['', [Validators.required]], 'description': ['', [Validators.required]]});
  }
}
