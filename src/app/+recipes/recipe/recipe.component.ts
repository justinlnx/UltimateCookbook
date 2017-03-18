import { Component, OnDestroy, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, Params, Router } from '@angular/router'
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { Rating } from './rating.component';

import { ApiService, Recipe } from '../../api';
import { ErrorReportService } from '../../error-report';

@Component({
  selector: 'recipe',
  // templateUrl: './recipe.component.html'
  template: `
  <md-toolbar class="top-toolbar" color="primary">
  <span>
    <button md-button class="back-button" (click)="onNavigatingBack()">
      <md-icon>arrow_back</md-icon>
    </button>
    {{recipe?.name}}
  </span>

  </md-toolbar>

  <div class="page-content">
    <p>{{recipe?.description}}</p>
    <p>Current Rate: <b>{{recipe?.rating}}</b></p>

    <rating 
      [max]="maxRateValue"
      (onHover)="overStarDoSomething($event)" 
      (onLeave)="resetRatingStar($event)">
    </rating>


    <img *ngFor="let trustedImageUrl of trustedImageUrls" [src]="trustedImageUrl" alt="recipe image" style="width: 100%;max-height: 100%">
  </div>
  `
})
export class RecipeComponent implements OnInit, OnDestroy {

  private maxRateValue: number = 10;
  private isRatingReadonly: boolean = false;
  private overStar: number;
  private ratingPercent: number;

  private recipeSubscription: Subscription;

  private trustedImageUrls: SafeResourceUrl[];

  constructor(
    private route: ActivatedRoute, private apiService: ApiService,
    private domSanitizer: DomSanitizer, private router: Router,
    private errorReportService: ErrorReportService) { }

  public ngOnInit(): void {
    this.route.params
      .switchMap((params: Params) => Observable.of(this.apiService.getRecipe(params['id'])))
        .subscribe((recipeObservable) => {
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

  private ratingStatesItems: any = [
    { stateOn: 'glyphicon-ok-sign', stateOff: 'glyphicon-ok-circle' },

  ];

  private resetRatingStar() {
    this.overStar = null;
  }

  private overStarDoSomething(value: number): void {
    this.overStar = value;
    this.ratingPercent = 100 * (value / this.maxRateValue);
  };
}
