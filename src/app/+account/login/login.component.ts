import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularFire, AuthMethods, AuthProviders } from 'angularfire2';
import { WebServiceException } from '../../api/WebServiceException';
import { ErrorReportService } from '../../error-report';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  public loginForm: FormGroup;

  constructor(
    private af: AngularFire, private fb: FormBuilder,
    private errorReportService: ErrorReportService) { }

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
    return this.loginForm.controls['password'].valid;
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
        this.errorReportService.send(err.message);
      });
  }

  public onCreateAccount() {
    if (this.validateLoginForm()) {
      this.createUser(this.loginForm.value.email, this.loginForm.value.password);
    }
  }

  public validateLoginForm(): boolean {
    return this.validEmailInput() && this.validPasswordInput();
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
      ]
    });
  }

  private createUser(email: string, password: string) {
    this.af.auth.createUser({ email, password })
      .then(
      (state) => {
        console.log(`User created: ${email}, ${password}`);
      },
      (err) => {
        this.errorReportService.send(err.message);
      });
  }
}
