import {Component} from '@angular/core';
import {ApiService} from '../api';

@Component({
  selector: 'favorite',
  template: `
  <md-toolbar class="top-toolbar" color="primary">
    <span>Favorites</span>
  </md-toolbar>
  <div class="page-content">
    <md-list>
      <recipe-list-item *ngFor="let recipe of list | async" [recipe]="recipe"></recipe-list-item>
    </md-list>
  </div>
  `
})
export class FavoriteComponent {
  public list;
  constructor(public apiService: ApiService) {
    this.list = apiService.getAllRecipes();
  }
}
