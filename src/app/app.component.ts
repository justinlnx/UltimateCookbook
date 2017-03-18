import {Component, ViewEncapsulation} from '@angular/core';

import {Section} from './shift-bottom-navigation';

/*
 * App Component
 * Top Level Component
 */
@Component({
  selector: 'app',
  styleUrls: ['./app.component.scss'],
  templateUrl: './app.component.html',
  encapsulation: ViewEncapsulation.None
})
export class AppComponent {
  public sections: Section[];
  constructor() {
    this.sections = [
      {name: 'Cart', url: './cart', icon: 'shopping_cart'},
      {name: 'Recipes', url: './recipes', icon: 'book'},
      {name: 'Favorite', url: './favorite', icon: 'favorite'},
      {name: 'Create', url: './personal_recipes', icon: 'create'},
      {name: 'Profile', url: './account', icon: 'account_circle'}
    ];
  }
}
