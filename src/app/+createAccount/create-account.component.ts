import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {AngularFire, FirebaseAuthState} from 'angularfire2';

import {ApiService, PushRecipeSchema, Recipe} from '../api';
import {ErrorReportService} from '../error-report';

@Component({
  selector: 'create-account',
  template: `
  <md-toolbar class="top-toolbar" color="primary">
    <span>Create new account</span>
  </md-toolbar>

  <div class="page-content">
    <div class="add-field">
      <form [formGroup]="createAccountForm" novalidate>
        <md-input-container [dividerColor]="emailInputColor()">
          <input mdInput placeholder="Email" type="text" formControlName="email">
          <md-hint *ngIf="!validEmailInput()" id="email-input-warning">Incorrect email format</md-hint>
        </md-input-container>
        <md-input-container [dividerColor]="passwordInputColor()">
          <input mdInput placeholder="Password" type="text" formControlName="password">
          <md-hint *ngIf="!validPasswordInput()" id="password-input-warning">Incorrect password format</md-hint>
        </md-input-container>
        <md-input-container [dividerColor]="userNameInputColor()">
          <input mdInput placeholder="User name" type="text" formControlName="name">
          <md-hint *ngIf="!validUserNameInput()" id="username-input-warning">Incorrect user name format</md-hint>
        </md-input-container>
        <div>
          <button md-raised-button class="create-btn" [disabled]="!validCreateAccountForm" type="button" (click)="onAddRecipe()">Create Account</button>
        </div>
      </form>
    </div>
  </div>
  `,
  styleUrls: ['./create-account.component.scss']
})
export class CreateAccountComponent implements OnInit, OnDestroy {
  public createAccountForm: FormGroup;

  get validCreateAccountForm(): boolean {
    return this.validEmailInput() && this.validPasswordInput() && this.validUserNameInput();
  }

  constructor(
      private af: AngularFire, private errorReportService: ErrorReportService,
      private fb: FormBuilder, private apiService: ApiService, private router: Router) {}

  public ngOnInit() {
    this.createCreateAccountForm();
  }

  public ngOnDestroy() {
    // this.logInSubscription.unsubscribe();
  }

  public onAddRecipe() {
    let email = this.createAccountForm.value.email;
    let password = this.createAccountForm.value.password;
    let name = this.createAccountForm.value.name;

    this.apiService.createUser(email, password, name);
    this.nagivateToRecipesPage();
  }

  public emailInputColor(): string {
    return this.inputColor(this.validEmailInput());
  }

  private inputColor(valid: boolean): string {
    return valid ? 'primary' : 'warn';
  }

  public passwordInputColor(): string {
    return this.inputColor(this.validPasswordInput());
  }

  public userNameInputColor(): string {
    return this.inputColor(this.validUserNameInput());
  }

  public validEmailInput(): boolean {
    return this.createAccountForm.controls['email'].valid;
  }

  public validPasswordInput(): boolean {
    return this.createAccountForm.controls['password'].valid;
  }

  public validUserNameInput(): boolean {
    return this.createAccountForm.controls['name'].valid;
  }

  private createCreateAccountForm() {
    let emailRegex: RegExp = /^\w+@[A-Za-z0-9]+\.[A-Za-z]+$/;
    let passwordRegex: RegExp = /^.+$/;

    this.createAccountForm = this.fb.group({
      email: ['', [Validators.required, Validators.pattern(emailRegex)]],
      password: [
        '',
        [
          Validators.required, Validators.pattern(passwordRegex), Validators.minLength(6),
          Validators.maxLength(16)
        ]
      ],
      name: ['', [Validators.required]]
    });
  }

  private nagivateToRecipesPage() {
    this.router.navigateByUrl('/account');
  }
}
