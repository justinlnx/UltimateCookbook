import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MdSnackBar} from '@angular/material';
import {SafeResourceUrl} from '@angular/platform-browser';
import {Router} from '@angular/router';
import {AngularFire, FirebaseAuthState} from 'angularfire2';

import {ApiService, PushRecipeSchema, Recipe} from '../api';
import {ErrorReportService} from '../error-report';
import {createSingleFileUploader, FileUploader} from '../file-upload';

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
        <md-input-container [dividerColor]="confirmPasswordInputColor()">
          <input mdInput placeholder="Confirm Password" type="text" formControlName="confirmPassword">
          <md-hint *ngIf="!confirmPasswordInput()" id="confirm-password-input-warning">Inconsistent password</md-hint>
        </md-input-container>
        <md-input-container [dividerColor]="userNameInputColor()">
          <input mdInput placeholder="User name" type="text" formControlName="name">
          <md-hint *ngIf="!validUserNameInput()" id="username-input-warning">Incorrect user name format</md-hint>
        </md-input-container>
        <md-card>
          <md-card-title>Upload avatar</md-card-title>
          <md-card-content>
            <div class="upload-line">
              <button md-mini-fab (click)="onSelectFile()">
                <md-icon>file_upload</md-icon>
              </button>
              <md-input-container class="avatar-file-name">
                <input mdInput type="text" disabled [value]="avatarUploadFileName">
              </md-input-container>
            </div>
            <input id="avatar-upload" #avatarUploadInput type="file" ng2FileSelect [uploader]="avatarUploader">
            <md-card-actions>
              <button md-raised-button (click)="onUploadAvatarReturnAvatarPath()" [disabled]="avatarUploadFileName.length === 0">Upload</button>
            </md-card-actions>
          </md-card-content>
        </md-card>
        <div>
          <button md-raised-button class="create-btn" [disabled]="!validCreateAccountForm" 
            type="button" (click)="onAddRecipe()">Create Account</button>
        </div>
      </form>
    </div>
  </div>
  `,
  styleUrls: ['./create-account.component.scss']
})
export class CreateAccountComponent implements OnInit {
  @ViewChild('avatarUploadInput') public avatarUploadInput: ElementRef;
  public createAccountForm: FormGroup;
  public avatarUrl: SafeResourceUrl;
  public avatarUploader: FileUploader = createSingleFileUploader();
  public loading: boolean = false;

  get validCreateAccountForm(): boolean {
    return this.validEmailInput() && this.validPasswordInput() && this.confirmPasswordInput() &&
        this.validUserNameInput();
  }

  get avatarUploadFileName(): string {
    if (!this.avatarUploadInput || !this.avatarUploadInput.nativeElement.files ||
        this.avatarUploadInput.nativeElement.files.length < 1) {
      return '';
    }

    let files = this.avatarUploadInput.nativeElement.files as File[];

    let avatarImage = files[0];

    return avatarImage.name;
  }

  constructor(
      private af: AngularFire, private errorReportService: ErrorReportService,
      private fb: FormBuilder, private apiService: ApiService, private router: Router,
      private snackBar: MdSnackBar) {}

  public ngOnInit() {
    this.createCreateAccountForm();
  }

  public onAddRecipe() {
    let email = this.createAccountForm.value.email;
    let password = this.createAccountForm.value.password;
    let name = this.createAccountForm.value.name;
    let avatarPath = this.onUploadAvatarReturnAvatarPath();

    console.log('avatar path: ', avatarPath);

    this.apiService.createUser(email, password, name, avatarPath);
    this.nagivateToRecipesPage();
  }

  public emailInputColor(): string {
    return this.inputColor(this.validEmailInput());
  }

  public passwordInputColor(): string {
    return this.inputColor(this.validPasswordInput());
  }

  public confirmPasswordInputColor(): string {
    return this.inputColor(this.confirmPasswordInput());
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

  public confirmPasswordInput(): boolean {
    return this.createAccountForm.value.password === this.createAccountForm.value.confirmPassword;
  }

  public validUserNameInput(): boolean {
    return this.createAccountForm.controls['name'].valid;
  }

  public onSelectFile() {
    this.avatarUploadInput.nativeElement.click();
  }

  public onUploadAvatarReturnAvatarPath(): string {
    this.loading = true;
    for (let item of this.avatarUploader.queue) {
      item.upload();

      const self = this;

      item.onComplete = (response: string) => {
        console.log(response);
        this.loading = false;

        this.openSnackBar('Avatar uploaded');

        return response;
      };
    }

    this.openSnackBar('Failed to upload avatar');
    return '';
  }

  private inputColor(valid: boolean): string {
    return valid ? 'primary' : 'warn';
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
      confirmPassword: [
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

  private openSnackBar(confirmation: string): void {
    this.snackBar.open(confirmation, null, {duration: 1500});
  }
}
