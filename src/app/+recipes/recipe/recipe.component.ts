import {Component, OnDestroy, OnInit} from '@angular/core';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {Subscription} from 'rxjs/Subscription';

import {ApiService, Recipe} from '../../api';
import {ErrorReportService} from '../../error-report';

import {Rating} from './rating.component';

@Component({
  selector: 'recipe',
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

    <md-card>
        <md-card-title>DESCRIPTION</md-card-title>
        <md-card-content>
            <div>
              <p>{{recipe?.description}}</p>
              <p class = "like">Likes: <b>{{recipe?.likedUsers?.length}}</b></p>
            </div>
        </md-card-content>
    </md-card>

    <md-card>
      <md-card-title>INGREDIENTS</md-card-title>
      <md-card-content>
        <md-list>
          <div>
            <ul *ngFor="let ingredient of recipe?.ingredients; let i = index">
              <p>{{ingredient}}</p>
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
              <p>{{i+1}} {{step.content}}</p>
              <img *ngIf="step.imageSource" [src]="bypassUrl(step.imageSource)"
                    alt="recipe image" style="width: 100%;max-height: 100%">
            </ul>
          </div>
        </md-list>
      </md-card-content>
    </md-card>

    <md-card>
    <md-card-title>COMMENTS</md-card-title>
    <md-card-content>
      <div  *ngFor="let comment of recipe?.comments; let i = index">
        <md-card>
          <md-card-content>
            <md-list>
              <p>{{comment.userId}}</p>
              <p>{{comment.content}}</p>
            </md-list>
          </md-card-content>
        </md-card>
      </div>

      <md-card>
        <md-card-content>
          <div>
            <textarea cols="40" rows="5"></textarea>
          </div>
          <md-card-actions>
            <button md-button>ADD COMMENT</button>
          </md-card-actions>
        </md-card-content>
      </md-card>
    </md-card-content>
    </md-card>

  </div>
  `,
  styleUrls: ['./recipe.component.scss'],
})
export class RecipeComponent implements OnInit, OnDestroy {
  public recipe: Recipe;

  private recipeSubscription: Subscription;

  constructor(
      private route: ActivatedRoute, private apiService: ApiService,
      private domSanitizer: DomSanitizer, private router: Router,
      private errorReportService: ErrorReportService) {}

  public ngOnInit(): void {
    this.route.params
        .switchMap((params: Params) => Observable.of(this.apiService.getRecipe(params['id'])))
        .subscribe((recipeObservable) => {
          this.recipeSubscription = recipeObservable.subscribe((recipe) => {
            console.log(recipe);
            this.recipe = recipe;
          }, (err) => this.errorReportService.send(err));
        });
  }

  public ngOnDestroy(): void {
    this.recipeSubscription.unsubscribe();
  }

  public onNavigatingBack() {
    this.router.navigateByUrl('recipes/all');
  }

  public bypassUrl(imageSource: string): SafeResourceUrl {
    return this.domSanitizer.bypassSecurityTrustResourceUrl(imageSource);
  }
}
