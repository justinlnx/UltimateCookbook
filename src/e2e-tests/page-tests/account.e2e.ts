import {$, browser, by, element, ElementFinder} from 'protractor';

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
      expect(accountPage.getCreateAccButtonEnabledState()).toBeTruthy();
    });

    it('"Email" and "Password" should be empty and error messages are shown', () => {
      let emailInput = accountPage.getEmailInputElement();
      let passwordInput = accountPage.getPasswordInputElement();

      expect(accountPage.getElementAttributePlaceholder(emailInput)).toEqual('Email');
      expect(accountPage.getElementAttributePlaceholder(passwordInput)).toEqual('Password');

      let emailInputWarning = accountPage.getEmailInputWarningMessage();
      let passwordInputWarning = accountPage.getPasswordInputWarningMessage();

      expect(emailInputWarning).toEqual('Incorrect email format');
      expect(passwordInputWarning).toEqual('Incorrect password format');
    });
  });

  describe('Invalid user inputs should not allow sign in or create account', () => {
    let invalidEmailFormat = 'invalidEmail';
    let invalidEmail = 'no@user.com';
    let invalidPasswordFormatShort = '123';
    let invalidPasswordFormatLong = '1111-1111-1111-1111';
    let invalidPassword = '111111';
    let validEmail = 'admin@gmail.com';
    let validPassword = 'Test!11';
    let validUserName = 'Admin Admin';

    describe('"Email" validation checking', () => {
      it('Invalid "Email" input should display error message', () => {
        entersEmailInput(invalidEmailFormat);

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
        entersPasswordInput(invalidPasswordFormatShort);

        let warningMessage = accountPage.getPasswordInputWarningMessage();
        expect(warningMessage).toEqual('Incorrect password format');
      });

      it('"Password" longer than 16 char displays error message', () => {
        entersPasswordInput(invalidPasswordFormatLong);

        let warningMessage = accountPage.getPasswordInputWarningMessage();
        expect(warningMessage).toEqual('Incorrect password format');
      });

      it('Valid "Password" input should display no error message', () => {
        entersPasswordInput(validPassword);

        let warningMessage = $('password-input-warning');
        expect(warningMessage.isPresent()).toBeFalsy();
      });
    });

    describe('Valid inputs should enable "Sign In" and "Create Account" buttons', () => {
      it('Valid "Email" and "Password" enables "Sign In" and disables "Create Account"', () => {
        entersEmailInput(validEmail);
        entersPasswordInput(validPassword);

        browser.sleep(1000);

        expect(accountPage.getSignInButtonEnabledState()).toBeTruthy();
      });

      it('Valid "Email", "Password", and "Username" shoud enable both buttons', () => {
        entersEmailInput(validEmail);
        entersPasswordInput(validPassword);

        browser.sleep(1000);

        expect(accountPage.getSignInButtonEnabledState()).toBeTruthy();
      });
    });

    describe('login with correct input format results in different actions', () => {
      let signInBtnElement: ElementFinder;
      beforeEach(() => {
        signInBtnElement = accountPage.getSignInButtonElement();
      })

      it('login with incorrect "Email" displays no user exists error message', () => {
        entersEmailInput(invalidEmail);
        entersPasswordInput(validPassword);
        browser.sleep(1000);

        signInBtnElement.click();
        browser.sleep(500);

        let expectedErrorMessage =
            'There is no user record corresponding to this identifier. The user may have been deleted.';
        verifySnackBarMsgIsDisplayed(expectedErrorMessage);
      });

      it('login with incorrect "Password" display invalid password error message', () => {
        entersEmailInput(validEmail);
        entersPasswordInput(invalidPassword);
        browser.sleep(1000);

        signInBtnElement.click();
        browser.sleep(500);

        let expectedErrorMessage = 'The password is invalid or the user does not have a password.';
        verifySnackBarMsgIsDisplayed(expectedErrorMessage);
      });

      it('login with correct "Email" and "Password" displays "Profile" page', () => {
        entersEmailInput(validEmail);
        entersPasswordInput(validPassword);
        browser.sleep(1000);

        signInBtnElement.click();
        browser.sleep(3000);

        let profileElement = element(by.id('profile-header-text'));
        expect(profileElement.isPresent()).toBeTruthy();
        expect(profileElement.getText()).toEqual('Profile');

        signOut();
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

    function signOut(): void {
      let signOutBtnElement = element(by.id('sign-out-id'));

      signOutBtnElement.click();
      browser.sleep(1000);
    }

    function verifySnackBarMsgIsDisplayed(expectedErrorMessage: string): void {
      let snackBarMsgElement = element(by.className('mat-simple-snackbar-message'));
      expect(snackBarMsgElement.isPresent()).toBeTruthy();
      expect(snackBarMsgElement.getText()).toEqual(expectedErrorMessage);
    }
  });
});
