import {Component, OnInit} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';

import {AngularFire, AuthProviders, AuthMethods} from 'angularfire2';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;


  constructor(
    private af: AngularFire,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.createForm();
  }

  emailInputColor(): string {
    return this.inputColor(this.validEmailInput());
  }

  passwordInputColor(): string {
    return this.inputColor(this.validPasswordInput());
  }

  validEmailInput(): boolean {
    return this.loginForm.controls['email'].valid;
  }

  validPasswordInput(): boolean {
    return this.loginForm.controls['password'].valid;
  }

  onSignIn() {
    this.af.auth.login(
      {
        email: this.loginForm.value.email,
        password: this.loginForm.value.password
      }, {
        provider: AuthProviders.Password,
        method: AuthMethods.Password
      }).then(
        (state) => {
          console.log(state);
        },
        (err) => {
          console.error(err);
        }
      );
  }

  onCreateAccount() {
    if (this.loginForm.valid) {
      this.createUser(
        this.loginForm.value.email,
        this.loginForm.value.password
      );
    }
  }

  private inputColor(valid: boolean): string {
    return valid ? 'primary' : 'warn';
  }

  private createForm() {
    let emailRegex: RegExp = /^\w+@[A-Za-z0-9]+\.[A-Za-z]+$/;
    let passwordRegex: RegExp = /^.+$/;

    this.loginForm = this.fb.group({
      email: ['', [
        Validators.required,
        Validators.pattern(emailRegex)
      ]],
      password: ['', [
        Validators.required,
        Validators.pattern(passwordRegex)
      ]]
    });
  }

  private createUser(email: string, password: string) {
    this.af.auth.createUser({email: email, password: password}).then(
      (state) => {console.log(`User created: ${email}, ${password}`);},
      (err) => {console.error(err);}
    );
  }

}
