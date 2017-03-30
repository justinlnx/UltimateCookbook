import {browser, by, element, ElementArrayFinder, ElementFinder} from 'protractor';
import * as webdriver from 'selenium-webdriver';

export class AccountPage {
  public get(): void {
    browser.get('#/account');
  }

  public getSignInButtonLabel(): webdriver.promise.Promise<string> {
    let signInButton = this.getSignInButtonElement();
    return signInButton.getText();
  }

  public getSignInButtonElement(): ElementFinder {
    return element(by.id('sign-in-btn-id'));
  }

  public getSignInButtonEnabledState(): webdriver.promise.Promise<boolean> {
    let signInButton = this.getSignInButtonElement();
    return signInButton.isEnabled();
  }

  public getCreateAccButtonLabel(): webdriver.promise.Promise<string> {
    let createAccButton = element(by.id('create-account-btn-id'));
    return createAccButton.getText();
  }

  public getCreateAccButtonEnabledState(): webdriver.promise.Promise<boolean> {
    let createAccButton = element(by.id('create-account-btn-id'));
    return createAccButton.isEnabled();
  }

  public getEmailInputElement(): ElementFinder {
    return element(by.id('email-input'));
  }

  public getPasswordInputElement(): ElementFinder {
    return element(by.id('password-input'));
  }

  public getUsernameInputElement(): ElementFinder {
    return element(by.id('username-input'));
  }

  public getElementAttributePlaceholder(element: ElementFinder): webdriver.promise.Promise<string> {
    return this.getElementAttribute(element, 'placeholder');
  }

  private getElementAttribute(element: ElementFinder, attribute: string):
      webdriver.promise.Promise<string> {
    return element.getAttribute(attribute);
  }

  public getEmailInputWarningMessage(): webdriver.promise.Promise<string> {
    return element(by.id('email-input-warning')).getText();
  }

  public getPasswordInputWarningMessage(): webdriver.promise.Promise<string> {
    return element(by.id('password-input-warning')).getText();
  }

  public getUsernameInputWarningMessage(): webdriver.promise.Promise<string> {
    return element(by.id('username-input-warning')).getText();
  }
};
