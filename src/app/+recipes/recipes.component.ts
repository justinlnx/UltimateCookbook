import {Component, OnInit} from '@angular/core';

import {ApiService, FirebaseListObservable, Recipe} from '../api';

@Component({selector: 'recipes', templateUrl: './recipes.component.html'})
export class RecipesComponent implements OnInit {
  public recipesListObservable: FirebaseListObservable<Recipe[]>;

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.recipesListObservable = this.apiService.getAllRecipes();
  }
}
