import {Location} from '@angular/common';
import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MdSnackBar} from '@angular/material';
import {SafeResourceUrl} from '@angular/platform-browser';
import {Router} from '@angular/router';
import {AngularFire, FirebaseAuthState} from 'angularfire2';

import {ApiService, DEFAULT_IMAGE_LOCATION, PushRecipeSchema, Recipe} from '../../api';
import {ErrorReportService} from '../../error-report';
import {createSingleFileUploader, FileUploader} from '../../file-upload';

@Component({
  selector: 'create-account',
  templateUrl: './create-account.component.html',
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
      private snackBar: MdSnackBar, private location: Location) {}

  public ngOnInit() {
    this.createCreateAccountForm();
  }

  public onNavigatingBack() {
    this.location.back();
  }

  public onCreateAccount() {
    let avatarPath = this.onUploadAvatarReturnAvatarPath();
  }

  public onUploadComplete(downloadableUrl: string): void {
    let email = this.createAccountForm.value.email;
    let password = this.createAccountForm.value.password;
    let name = this.createAccountForm.value.name;
    let avatarPath = downloadableUrl;

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

  public onUploadAvatarReturnAvatarPath(): void {
    if (this.avatarUploader.queue.length === 0) {
      this.onUploadComplete(DEFAULT_IMAGE_LOCATION);
    }

    this.loading = true;
    for (let item of this.avatarUploader.queue) {
      item.upload();

      const self = this;

      item.onComplete = (response: string) => {
        console.log(response);
        self.loading = false;

        self.openSnackBar('Avatar uploaded');

        self.onUploadComplete(response);
      };
    }
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
    this.router.navigateByUrl('/home');
  }

  private openSnackBar(confirmation: string): void {
    this.snackBar.open(confirmation, null, {duration: 1500});
  }
}
