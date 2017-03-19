import {Component} from '@angular/core';
import {ApiService} from '../api';

@Component({
  selector: 'favorite',
  template: `<h1>Favorite</h1>
  <md-list>
    <recipe-list-item *ngFor="let recipe of list | async" [recipe]="recipe"></recipe-list-item>
  </md-list>
  `
})
export class FavoriteComponent {
  public list;
  constructor(public apiService: ApiService) {
    this.list = apiService.getAllRecipes();
  }
}
