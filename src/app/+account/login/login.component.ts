import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ApiService} from '../../api';
import {ErrorReportService} from '../../error-report';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  public loginForm: FormGroup;

  constructor(
      public apiService: ApiService, public fb: FormBuilder,
      public errorReportService: ErrorReportService) {}

  public ngOnInit() {
    this.createForm();
  }

  public emailInputColor(): string {
    return this.inputColor(this.validEmailInput());
  }

  public passwordInputColor(): string {
    return this.inputColor(this.validPasswordInput());
  }

  public userNameInputColor(): string {
    return this.inputColor(this.validUserNameInput());
  }

  public validEmailInput(): boolean {
    return this.loginForm.controls['email'].valid;
  }

  public validPasswordInput(): boolean {
    return this.loginForm.controls['password'].valid;
  }

  public validUserNameInput(): boolean {
    return this.loginForm.controls['name'].valid;
  }

  public onSignIn() {
    this.apiService.login(this.loginForm.value.email, this.loginForm.value.password);
  }

  public onCreateAccount() {
    this.createUser(
        this.loginForm.value.email, this.loginForm.value.password, this.loginForm.value.name);
  }

  public validSigninInput(): boolean {
    return this.validEmailInput() && this.validPasswordInput();
  }

  public validCreateInput(): boolean {
    return this.validEmailInput() && this.validPasswordInput() && this.validUserNameInput();
  }

  private inputColor(valid: boolean): string {
    return valid ? 'primary' : 'warn';
  }

  private createForm() {
    let emailRegex: RegExp = /^\w+@[A-Za-z0-9]+\.[A-Za-z]+$/;
    let passwordRegex: RegExp = /^.+$/;

    this.loginForm = this.fb.group({
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

  private createUser(email: string, password: string, name: string) {
    this.apiService.createUser(email, password, name);
  }
}
