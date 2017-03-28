import {browser, by, element, ElementArrayFinder, ElementFinder} from 'protractor';
import * as webdriver from 'selenium-webdriver';

export class AccountPage {
  public signInButtonLabel: string;
  public signInButtonState: boolean;
  public createAccButtonLabel: string;
  public createAccButtonState: boolean;

  private signInButton = element(by.css('.sign-in-btn'));
  private createAccButton = element(by.css('.create-account-btn'));

  public get(): void {
    browser.get('#/account');
  }

  public getSignInButtonLabel(): webdriver.promise.Promise<string> {
    return this.signInButton.getText();
  }

  public getSignInButtonEnabledState(): webdriver.promise.Promise<any> {
    return this.signInButton.isEnabled();
  }

  public getCreateAccButtonLabel(): webdriver.promise.Promise<string> {
    return this.createAccButton.getText();
  }

  public getCreateAccButtonEnabledState(): webdriver.promise.Promise<any> {
    return this.createAccButton.isEnabled();
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
};
