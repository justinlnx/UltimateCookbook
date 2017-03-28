import {browser} from 'protractor';
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

    it('should display Sign In Button in proper state', () => {
      accountPage.get();

      expect(accountPage.getSignInButtonLabel()).toEqual('Sign in');
      expect(accountPage.getSignInButtonEnabledState()).toBe(false);
    });

    it('should display create account Button in proper state', () => {
      accountPage.get();

      expect(accountPage.getCreateAccButtonLabel()).toEqual('Create Account');
      expect(accountPage.getCreateAccButtonEnabledState()).toBe(false);
    });

    it('email and password should be empty and error messages are shown', () => {
      let emailInput = accountPage.getEmailInputElement();
      let passwordInput = accountPage.getPasswordInputElement();
      let usernameInput = accountPage.getUsernameInputElement();

      expect(accountPage.getElementAttributePlaceholder(emailInput)).toEqual('Email');
      expect(accountPage.getElementAttributePlaceholder(passwordInput)).toEqual('Password');
      expect(accountPage.getElementAttributePlaceholder(usernameInput)).toEqual('User name');

      let emailInputWarning = accountPage.getEmailInputWarningElement();
      let passwordInputWarning = accountPage.getPasswordInputWarningElement();
      let usernameInputWarning = accountPage.getUsernameInputWarningElement();

      expect(emailInputWarning.getText()).toEqual('Incorrect email format');
      expect(passwordInputWarning.getText()).toEqual('Incorrect password format');
      expect(usernameInputWarning.getText()).toEqual('Incorrect user name format');
    });
  });
});
