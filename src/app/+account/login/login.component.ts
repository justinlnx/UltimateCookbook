import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularFire, AuthMethods, AuthProviders } from 'angularfire2';
import { WebServiceException } from '../../api/WebServiceException';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  public loginForm: FormGroup;

  constructor(private af: AngularFire, private fb: FormBuilder) { }

  public ngOnInit() {
    this.createForm();
  }

  public emailInputColor(): string {
    return this.inputColor(this.validEmailInput());
  }

  public passwordInputColor(): string {
    return this.inputColor(this.validPasswordInput());
  }

  public validEmailInput(): boolean {
    return this.loginForm.controls['email'].valid;
  }

  public validPasswordInput(): boolean {
    if (!this.loginForm.controls['password'].valid) {
      return false;
    }
    return this.checkPasswordLength();
  }

  private checkPasswordLength(): boolean {
    var passwordLength = this.loginForm.controls['password'].value.length;
    var minimumLength = 6;
    var maximumLength = 16;

    return passwordLength >= minimumLength && passwordLength <= maximumLength;
  }

  public onSignIn() {
    this.af.auth
      .login(
      { email: this.loginForm.value.email, password: this.loginForm.value.password },
      { provider: AuthProviders.Password, method: AuthMethods.Password })
      .then(
      (state) => {
        console.log(state);
      },
      (err) => {
        console.error(err);
        this.throwException(err.message);
      });
  }

  private throwException(message: string): never {
    throw new WebServiceException(message);
  }

  public onCreateAccount() {
    this.validateLoginForm();

    this.createUser(this.loginForm.value.email, this.loginForm.value.password);
  }

  private validateLoginForm(): any {
    if (!this.validEmailInput()) {
      var errorMessage = "Invalid email format";
      this.throwException(errorMessage);
    }

    if (!this.validPasswordInput()) {
      var errorMessage = "Invalid password format";
      this.throwException(errorMessage);
    }
  }

  private inputColor(valid: boolean): string {
    return valid ? 'primary' : 'warn';
  }

  private createForm() {
    let emailRegex: RegExp = /^\w+@[A-Za-z0-9]+\.[A-Za-z]+$/;
    let passwordRegex: RegExp = /^.+$/;

    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.pattern(emailRegex)]],
      password: ['', [Validators.required, Validators.pattern(passwordRegex)]]
    });
  }

  private createUser(email: string, password: string) {
    this.af.auth.createUser({ email, password })
      .then(
      (state) => {
        console.log(`User created: ${email}, ${password}`);
      },
      (err) => {
        console.error(err);
        this.throwException(err.message);
      });
  }
}
