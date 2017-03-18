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

    <md-card>
      <md-card-title>INGREDIENTS</md-card-title>

      <md-card-content>
        <md-list>
          <div>
            <ul *ngFor="let ingredient of recipe?.ingredients; let i = index">
              <p>{{i+1}} : {{ingredient}}</p>
            </ul>
          </div>
        </md-list>
      </md-card-content>
    </md-card>

    <md-card>
      <md-card-title>STEPS</md-card-title>

      <md-card-content>
        <md-list>
          <div>
            <ul *ngFor="let step of recipe?.steps; let i = index">
              <p>{{i+1}} : {{step}}</p>
            </ul>
          </div>
        </md-list>
      </md-card-content>
    </md-card>

    
    <img *ngFor="let trustedImageUrl of trustedImageUrls" [src]="trustedImageUrl" alt="recipe image" style="width: 100%;max-height: 100%">
  </div>
  `,
})
export class RecipeComponent implements OnInit, OnDestroy {
  // temp

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

}
