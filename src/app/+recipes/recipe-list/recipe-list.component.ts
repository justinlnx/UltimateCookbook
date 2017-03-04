import {Component, Input} from '@angular/core';
import {Recipe} from '../../api';

@Component({
  selector: 'recipe-list',
  template: `
  <md-list>
    <recipe-list-item *ngFor="let recipe of recipes" [recipe]="recipe"></recipe-list-item>
  </md-list>
  `
})
export class RecipeListComponent {
  @Input() recipes: Recipe[];
}
