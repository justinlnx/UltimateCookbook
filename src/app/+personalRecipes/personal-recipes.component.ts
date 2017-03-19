import {Component} from '@angular/core';
import {ApiService} from '../api';

@Component({selector: 'personal-recipes',   template: `
  <md-toolbar class="top-toolbar" color="primary">
    <span>My Recipes</span>
  </md-toolbar>
  <div class="page-content">
    <md-list>
      <recipe-list-item *ngFor="let recipe of list | async" [recipe]="recipe"></recipe-list-item>
    </md-list> 
  </div>
  <button md-fab class="add-button" >
      <md-icon class="md-24">add</md-icon>
    </button>
  `,
  styleUrls: ['./personal-recipes.component.scss']
})
export class PersonalRecipesComponent {
  public list;
  constructor(public apiService: ApiService) {
    this.list = apiService.getAllRecipes();
  }
}
