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
      {name: 'Home', url: './home', icon: 'home'},
      {name: 'Cart', url: './cart', icon: 'shopping_cart'},
      {name: 'Favorites', url: './favorite', icon: 'favorite'},
      {name: 'Mine', url: './personal_recipes', icon: 'local_library'},
      {name: 'Profile', url: './account', icon: 'account_circle'}
    ];
  }
}
