import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AngularFire, AuthMethods, AuthProviders} from 'angularfire2';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  public loginForm: FormGroup;

  constructor(private af: AngularFire, private fb: FormBuilder) {}

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
            {email: this.loginForm.value.email, password: this.loginForm.value.password},
            {provider: AuthProviders.Password, method: AuthMethods.Password})
        .then(
            (state) => {
              console.log(state);
            },
            (err) => {
              console.error(err);
            });
  }

  public onCreateAccount() {
    if (this.loginForm.valid) {
      this.createUser(this.loginForm.value.email, this.loginForm.value.password);
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
    this.af.auth.createUser({email, password})
        .then(
            (state) => {
              console.log(`User created: ${email}, ${password}`);
            },
            (err) => {
              console.error(err);
            });
  }
}
