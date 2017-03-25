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
    <span class = "topBar">
      <button md-icon-button class="back-button" (click)="onNavigatingBack()">
        <md-icon>arrow_back</md-icon>
      </button>
    </span>
  </md-toolbar>

  <div class="page-content">

    <md-card>
      <md-card-title>{{recipe.name}}</md-card-title>
      <md-card-content>
      <md-list>
      <md-list-item class="md-2-line">
         <img md-card-avatar class = "avatar" [src]="recipe.avatar">
         <div class="mat-list-text">
            <p md-line class = "name"> Shiba Inu </p>
          </div>
      </md-list-item>
      <p class = "description">{{recipe?.description}}</p>
      </md-list>
      <button md-icon-button>
        <md-icon (click)="likeRecipe(recipe); $event.stopPropagation()">
          <span md-icon [class.fav-button]="recipe?.rating == '1'">favorite</span>
        </md-icon>
      </button>
      <button md-icon-button>
        <md-icon>chat_bubble_outline</md-icon>
      </button>
      </md-card-content>
    </md-card>

    <md-card>
      <md-card-title>Ingredients</md-card-title>
      <md-card-content>
        <md-list *ngFor="let ingredient of recipe?.ingredients">
          <p>{{ingredient}}</p>
        </md-list>
      </md-card-content>
    </md-card>

    <md-card *ngFor="let step of recipe?.steps; let i = index">
    <md-card-title>Steps {{i+1}}</md-card-title>
      <md-card-content>
        <p>{{step.content}}</p>
        <img [src]="step.imageSource" alt="recipe image" style="width: 100%;max-height: 100%">
      </md-card-content>
    </md-card>

    <md-card>
    <md-card-title>Comments</md-card-title>
    <md-card-content>
      <div *ngFor="let comment of recipe?.comments">
          <md-card-content>
            <md-list>
              <md-list-item class="md-2-line">
                <img md-card-avatar class = "avatar" [src]="recipe.avatar">
                <div class="mat-list-text">
                <p md-line class = "name"> Shiba Inu </p>
                <p class = "comment">{{comment.content}}</p>
                </div>
              </md-list-item>
            </md-list>
            <md-divider></md-divider>
          </md-card-content>
      </div>

      <md-card-content>
        <div>
          <md-input-container>
            <input mdInput placeholder="Add comment...">
          </md-input-container>
        </div>
        <md-card-actions>
          <button md-raised-button>Add</button>
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
