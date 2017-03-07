import {Component, OnInit} from '@angular/core';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
import {ActivatedRoute, Params} from '@angular/router'
import {Observable} from 'rxjs/Observable';

import {ApiService, Recipe} from '../../api';
@Component({selector: 'recipe', templateUrl: './recipe.component.html'})
export class RecipeComponent implements OnInit {
  private recipe: Recipe;
  private trustedImageUrls: SafeResourceUrl[];
  constructor(
      private route: ActivatedRoute, private apiService: ApiService,
      private domSanitizer: DomSanitizer) {}
  ngOnInit(): void {
    this.route.params
        .switchMap((params: Params) => Observable.of(this.apiService.getRecipe(params['id'])))
        .subscribe(recipe => {
          this.recipe = recipe;
          this.updateTrustedImageUrls();
        });
  }
  private updateTrustedImageUrls() {
    if (this.recipe.imageSources != null) {
      this.trustedImageUrls = this.recipe.imageSources.map((imageSource) => {
        return this.domSanitizer.bypassSecurityTrustResourceUrl(imageSource);
      });
    } else {
          this.trustedImageUrls = [];
          console.log('null')
    }
  }
}
