import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {AngularFire, FirebaseAuthState} from 'angularfire2';
import {Subscription} from 'rxjs/Subscription';

import {ApiService, PushRecipe, Recipe} from '../api';
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
  </div>

  `,
  styles: ['form {margin-top: 24px;}']
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

  public onAddRecipe() {
    let name = this.addRecipeForm.value.name;
    let description = this.addRecipeForm.value.description;
    let author = this.authState.auth.email;

    let newRecipe: PushRecipe =
        {name: name, description: description, author: author, avatar: '', imageSources: []};

    this.apiService.addRecipe(newRecipe);
    this.nagivateToRecipesPage();
  }

  private createAddRecipeForm() {
    this.addRecipeForm = this.fb.group(
        {'name': ['', [Validators.required]], 'description': ['', [Validators.required]]});
  }

  private nagivateToRecipesPage() {
    this.router.navigateByUrl('/recipes');
  }
}
