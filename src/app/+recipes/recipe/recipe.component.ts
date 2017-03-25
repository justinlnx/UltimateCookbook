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
    <span class = "recipeName">
      <button md-icon-button class="back-button" (click)="onNavigatingBack()">
        <md-icon>arrow_back</md-icon>
      </button>
      {{recipe?.name}}
    </span>
    <button md-icon-button>
      <md-icon (click)="likeRecipe(recipe); $event.stopPropagation()">
        <span md-icon [class.fav-button]="recipe?.rating == '1'">favorite</span>
      </md-icon>
    </button>
  </md-toolbar>

  <div class="page-content">

    <md-card>
      <md-card-title>AUTHOR</md-card-title>
      <md-card-content>  
      <md-list>
      <md-list-item class="md-2-line">
        <img md-card-avatar class = "avatar" [src]="recipe.avatar">
         <div class="mat-list-text">
            <p md-line class = "name"> Shiba Inu </p>
          </div>
          <button md-icon-button>
            <md-icon>message</md-icon>
          </button>
      </md-list-item>
      </md-list>
      </md-card-content>
    </md-card>

    <md-card>
        <md-card-title>DESCRIPTION</md-card-title>
        <md-card-content>
          <p class = "description">{{recipe?.description}}</p>
        </md-card-content>
    </md-card>

    <md-card>
      <md-card-title>INGREDIENTS</md-card-title>
      <md-card-content>
        <md-list *ngFor="let ingredient of recipe?.ingredients">
          <p>{{ingredient}}</p>
        </md-list>
      </md-card-content>
    </md-card>

    <md-card>
      <md-card-title>STEPS</md-card-title>
      <md-card-content>
        <md-list *ngFor="let step of recipe?.steps; let i = index">
            <p>{{i+1}} {{step.content}}</p>
            <img [src]="step.imageSource" alt="recipe image" style="width: 100%;max-height: 100%">
        </md-list>
      </md-card-content>
    </md-card>

    <md-card>
    <md-card-title>COMMENTS</md-card-title>
    <md-card-content>
      <div *ngFor="let comment of recipe?.comments">
          <md-card-content>
            <md-list>
              <md-list-item class="md-2-line">
                <img md-card-avatar class = "avatar" [src]="recipe.avatar">
                <div class="mat-list-text">
                <p md-line class = "name"> Shiba Inu </p>
                </div>
              </md-list-item>
              <p>{{comment.content}}</p>
            </md-list>
            <md-divider></md-divider>
          </md-card-content>
      </div>

      <md-card-content>
        <div>
            <textarea cols="40" rows="5"></textarea>
        </div>
        <md-card-actions>
          <button md-button>ADD COMMENT</button>
          </md-card-actions>
      </md-card-content>
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

  public likeRecipe(recipe: Recipe) {
    this.apiService.toggleLike(recipe);
  }
}
