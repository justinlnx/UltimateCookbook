import {browser} from 'protractor';

describe('App general test', () => {
  beforeEach(() => {
    browser.get('/');
  });

  it('should have a title', () => {
    let expectedTitle = 'Ultimate Cookbook';

    let title = browser.getTitle();

    expect(title).toEqual(expectedTitle);
  });
});
