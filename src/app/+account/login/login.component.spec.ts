import {DebugElement} from '@angular/core';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';

import {AuthService, MockAuthService} from '../../auth';
import {ErrorReportService} from '../../error-report';
import {SharedModule} from '../../shared';

import {LoginComponent} from './login.component';

describe('login component', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async(() => {
    TestBed
        .configureTestingModule({
          imports: [SharedModule],
          declarations: [LoginComponent],
          providers: [
            ErrorReportService, {provide: AuthService, useValue: new MockAuthService(null, null)}
          ]
        })
        .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should be initialized', () => {
    expect(fixture).toBeDefined();
    expect(component).toBeDefined();
  });

  it('should use mock auth service', () => {
    expect(TestBed.get(AuthService)).toBeDefined();
  });

  it('should have form setup', () => {
    expect(component.loginForm).toBeDefined();
  });

  it('should reject invalid emails', () => {
    let emailInput = getEmailInput().nativeElement;

    let invalidEmails = ['', 'abc', 'abc@123', 'abc@123.com.com', 'abc@abc@abc.com'];

    for (let invalidEmail of invalidEmails) {
      emailInput.value = invalidEmail;

      emailInput.dispatchEvent(new Event('input'));

      fixture.detectChanges();

      expect(component.validEmailInput()).toBeFalsy();
    }
  });

  it('shouldd accept valid emails', () => {
    let emailInput = getEmailInput().nativeElement;

    let validEmails = ['abc@1213.com', '123_456@abc.com'];

    for (let validEmail of validEmails) {
      emailInput.value = validEmail;

      emailInput.dispatchEvent(new Event('input'));

      fixture.detectChanges();

      expect(component.validEmailInput()).toBeTruthy();
    }
  });

  it('should reject invalid passwords', () => {
    let passwordInput = getPasswordInput().nativeElement;

    let invalidPasswords = ['', '12345'];

    for (let invalidPassword of invalidPasswords) {
      passwordInput.value = invalidPassword;

      passwordInput.dispatchEvent(new Event('input'));

      fixture.detectChanges();

      expect(component.validPasswordInput()).toBeFalsy();
    }
  });

  it('should accept valid passwords', () => {
    let passwordInput = getPasswordInput().nativeElement;

    let invalidPasswords = ['123456', 'abc_123'];

    for (let invalidPassword of invalidPasswords) {
      passwordInput.value = invalidPassword;

      passwordInput.dispatchEvent(new Event('input'));

      fixture.detectChanges();

      expect(component.validPasswordInput()).toBeTruthy();
    }
  });

  it('should disable login and create account buttons when given invalid inputs', () => {
    let signInButton = getSignInButton();
    let createAccountButton = getCreateAccountButton();

    let emailInput = getEmailInput();
    let passwordInput = getPasswordInput();

    emailInput.nativeElement.value = '123';
    passwordInput.nativeElement.value = 'abc';

    emailInput.nativeElement.dispatchEvent(new Event('input'));
    passwordInput.nativeElement.dispatchEvent(new Event('input'));

    fixture.detectChanges();

    expect(signInButton.nativeElement.attributes['disabled']).toBeDefined();
    expect(createAccountButton.nativeElement.attributes['disabled']).toBeDefined();

  });

  it('should allow login and create account buttons when given valid inputs', () => {
    let signInButton = getSignInButton();
    let createAccountButton = getCreateAccountButton();

    let emailInput = getEmailInput();
    let passwordInput = getPasswordInput();

    let email = '123@abc.com';
    let password = 'abcdefg';

    emailInput.nativeElement.value = email;
    passwordInput.nativeElement.value = password;

    emailInput.nativeElement.dispatchEvent(new Event('input'));
    passwordInput.nativeElement.dispatchEvent(new Event('input'));

    fixture.detectChanges();

    let authService = getAuthService();

    spyOn(authService, 'login');
    spyOn(authService, 'createUser');

    signInButton.triggerEventHandler('click', null);
    createAccountButton.triggerEventHandler('click', null);

    expect(authService.login).toHaveBeenCalledWith(email, password);
    expect(authService.createUser).toHaveBeenCalledWith(email, password);
  });

  function getAuthService() {
    return TestBed.get(AuthService);
  }

  function getEmailInput(): DebugElement {
    return getAllInputs()[0];
  }

  function getPasswordInput(): DebugElement {
    return getAllInputs()[1];
  }

  function getAllInputs(): DebugElement[] {
    return fixture.debugElement.queryAll(By.css('input'));
  }

  function getSignInButton(): DebugElement {
    return fixture.debugElement.query(By.css('.sign-in-btn'));
  }

  function getCreateAccountButton(): DebugElement {
    return fixture.debugElement.query(By.css('.create-account-btn'));
  }

});
