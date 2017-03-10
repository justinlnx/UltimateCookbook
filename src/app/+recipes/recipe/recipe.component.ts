import {Component, OnDestroy, OnInit} from '@angular/core';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
import {ActivatedRoute, Params, Router} from '@angular/router'
import {Observable} from 'rxjs/Observable';
import {Subscription} from 'rxjs/Subscription';

import {ApiService, Recipe} from '../../api';
import {ErrorReportService} from '../../error-report';

@Component({selector: 'recipe', templateUrl: './recipe.component.html'})
export class RecipeComponent implements OnInit, OnDestroy {
  private recipeSubscription: Subscription;
  private recipe: Recipe;
  private trustedImageUrls: SafeResourceUrl[];
  constructor(
      private route: ActivatedRoute, private apiService: ApiService,
      private domSanitizer: DomSanitizer, private router: Router,
      private errorReportService: ErrorReportService) {}
  public ngOnInit(): void {
    this.route.params
        .switchMap((params: Params) => Observable.of(this.apiService.getRecipe(params['id'])))
        .subscribe(recipeObservable => {
          this.recipeSubscription = recipeObservable.subscribe((recipe) => {
            console.log(recipe);
            this.recipe = recipe;
            this.updateTrustedImageUrls();
          }, (err) => this.errorReportService.send(err));
        });
  }

  public ngOnDestroy(): void {
    this.recipeSubscription.unsubscribe();
  }

  public onNavigatingBack() {
    this.router.navigateByUrl('recipes/all');
  }

  private updateTrustedImageUrls() {
    if (this.recipe.imageSources) {
      this.trustedImageUrls = this.recipe.imageSources.map((imageSource) => {
        return this.domSanitizer.bypassSecurityTrustResourceUrl(imageSource);
      });
    } else {
      this.trustedImageUrls = [];
    }
  }
}
