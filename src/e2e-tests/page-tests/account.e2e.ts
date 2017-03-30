import {$, browser} from 'protractor';

import {AccountPage} from '../pages/account-page';

describe('account page', () => {
  let accountPage: AccountPage;

  beforeEach(() => {
    accountPage = new AccountPage();

    accountPage.get();
  });

  describe('account page default setting', () => {
    it('should show correct browser title', () => {
      let title = browser.getTitle();

      expect(title).toEqual('Ultimate Cookbook');
    });

    it('should display "Sign In" Button in proper state', () => {
      expect(accountPage.getSignInButtonLabel()).toEqual('Sign in');
      expect(accountPage.getSignInButtonEnabledState()).toBeFalsy();
    });

    it('should display "Create Account" Button in proper state', () => {
      expect(accountPage.getCreateAccButtonLabel()).toEqual('Create Account');
      expect(accountPage.getCreateAccButtonEnabledState()).toBeFalsy();
    });

    it('"Email" and "Password" should be empty and error messages are shown', () => {
      let emailInput = accountPage.getEmailInputElement();
      let passwordInput = accountPage.getPasswordInputElement();
      let usernameInput = accountPage.getUsernameInputElement();

      expect(accountPage.getElementAttributePlaceholder(emailInput)).toEqual('Email');
      expect(accountPage.getElementAttributePlaceholder(passwordInput)).toEqual('Password');
      expect(accountPage.getElementAttributePlaceholder(usernameInput)).toEqual('User name');

      let emailInputWarning = accountPage.getEmailInputWarningMessage();
      let passwordInputWarning = accountPage.getPasswordInputWarningMessage();
      let usernameInputWarning = accountPage.getUsernameInputWarningMessage();

      expect(emailInputWarning).toEqual('Incorrect email format');
      expect(passwordInputWarning).toEqual('Incorrect password format');
      expect(usernameInputWarning).toEqual('Incorrect user name format');
    });
  });

  describe('Invalid user inputs should not allow sign in or create account', () => {
    let invalidEmail = 'invalidEmail';
    let invalidShortPassword = '123';
    let invalidLongPassword = '1111-1111-1111-1111';
    let validEmail = 'admin@gmail.com';
    let validPassword = 'Test!11';
    let validUserName = 'Admin Admin';

    describe('"Email" validation checking', () => {
      it('Invalid "Email" input should display error message', () => {
        entersEmailInput(invalidEmail);

        let warningMessage = accountPage.getEmailInputWarningMessage();
        expect(warningMessage).toEqual('Incorrect email format');
      });

      it('Valid "Email" input should display no error message', () => {
        entersEmailInput(validEmail);

        let warningMessage = $('email-input-warning');
        expect(warningMessage.isPresent()).toBeFalsy();
      });
    });

    describe('"Password" validation checking', () => {
      it('"Password" less than 6 char displays error message', () => {
        entersPasswordInput(invalidShortPassword);

        let warningMessage = accountPage.getPasswordInputWarningMessage();
        expect(warningMessage).toEqual('Incorrect password format');
      });

      it('"Password" longer than 16 char displays error message', () => {
        entersPasswordInput(invalidLongPassword);

        let warningMessage = accountPage.getPasswordInputWarningMessage();
        expect(warningMessage).toEqual('Incorrect password format');
      });

      it('Valid "Password" input should display no error message', () => {
        entersPasswordInput(validPassword);

        let warningMessage = $('password-input-warning');
        expect(warningMessage.isPresent()).toBeFalsy();
      });
    });

    describe('"Username" validation checking', () => {
      it('Empty "Username" should display error message', () => {
        entersUsernameInput('');

        let warningMessage = accountPage.getUsernameInputWarningMessage();
        expect(warningMessage).toEqual('Incorrect user name format');
      });

      it('Valid "Username" should display no error message', () => {
        entersUsernameInput(validUserName);

        let warningMessage = $('username-input-warning');
        expect(warningMessage.isPresent()).toBeFalsy();
      });
    });

    describe('Valid inputs should enable "Sign In" and "Create Account" buttons', () => {
      it('Valid "Email" and "Password" enables "Sign In" and disables "Create Account"', () => {
        entersEmailInput(validEmail);
        entersPasswordInput(validPassword);
        entersUsernameInput('');

        browser.sleep(1000);

        expect(accountPage.getSignInButtonEnabledState()).toBeTruthy();
        expect(accountPage.getCreateAccButtonEnabledState()).toBeFalsy();
      });

      it('Valid "Email", "Password", and "Username" shoud enable both buttons', () => {
        entersEmailInput(validEmail);
        entersPasswordInput(validPassword);
        entersUsernameInput(validUserName);

        browser.sleep(1000);

        expect(accountPage.getSignInButtonEnabledState()).toBeTruthy();
        expect(accountPage.getCreateAccButtonEnabledState()).toBeTruthy();
      });
    });

    function entersEmailInput(input: string): void {
      let emailInput = accountPage.getEmailInputElement();

      emailInput.clear();

      emailInput.sendKeys(input);
    }

    function entersPasswordInput(input: string): void {
      let passwordInput = accountPage.getPasswordInputElement();

      passwordInput.clear();

      passwordInput.sendKeys(input);
    }

    function entersUsernameInput(input: string): void {
      let usernameInput = accountPage.getUsernameInputElement();

      usernameInput.clear();

      usernameInput.sendKeys(input);
    }
  });
});
