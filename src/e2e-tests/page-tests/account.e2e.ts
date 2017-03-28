import {$, browser} from 'protractor';

import {AccountPage} from '../pages/account-page';

describe('account page', () => {
  let accountPage: AccountPage;

  beforeEach(() => {
    accountPage = new AccountPage();
  });

  describe('account page default setting', () => {
    it('should show correct browser title', () => {
      accountPage.get();

      expect(browser.getTitle()).toEqual('Ultimate Cookbook');
    });

    it('should display "Sign In" Button in proper state', () => {
      accountPage.get();

      expect(accountPage.getSignInButtonLabel()).toEqual('Sign in');
      expect(accountPage.getSignInButtonEnabledState()).toBe(false);
    });

    it('should display "Create Account" Button in proper state', () => {
      accountPage.get();

      expect(accountPage.getCreateAccButtonLabel()).toEqual('Create Account');
      expect(accountPage.getCreateAccButtonEnabledState()).toBe(false);
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
        let emailInput = accountPage.getEmailInputElement();

        emailInput.sendKeys(invalidEmail);

        let warningMessage = accountPage.getEmailInputWarningMessage();
        expect(warningMessage).toEqual('Incorrect email format');
      });

      it('Valid "Email" input should display no error message', () => {
        let emailInput = accountPage.getEmailInputElement();

        emailInput.sendKeys(validEmail);

        let warningMessage = $('email-input-warning');
        expect(warningMessage.isPresent()).toBeFalsy();
      });
    });

    describe('"Password" validation checking', () => {
      it('"Password" less than 6 char displays error message', () => {
        let passwordInput = accountPage.getPasswordInputElement();

        passwordInput.sendKeys(invalidShortPassword);

        let warningMessage = accountPage.getPasswordInputWarningMessage();
        expect(warningMessage).toEqual('Incorrect password format');
      });

      it('"Password" longer than 16 char displays error message', () => {
        let passwordInput = accountPage.getPasswordInputElement();

        passwordInput.sendKeys(invalidLongPassword);

        let warningMessage = accountPage.getPasswordInputWarningMessage();
        expect(warningMessage).toEqual('Incorrect password format');
      });

      it('Valid "Password" input should display no error message', () => {
        let passwordInput = accountPage.getPasswordInputElement();

        passwordInput.sendKeys(validPassword);

        let warningMessage = $('password-input-warning');
        expect(warningMessage.isPresent()).toBeFalsy();
      });
    });
  });
});
