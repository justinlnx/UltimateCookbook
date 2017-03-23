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
      <button md-button class="back-button" (click)="onNavigatingBack()">
        <md-icon>arrow_back</md-icon>
      </button>
      {{recipe?.name}}
    </span>
    <md-icon (click)="likeRecipe(recipe); $event.stopPropagation()">
      <span md-icon [class.fav-button]="recipe?.rating == '1'">favorite</span>
    </md-icon>
  </md-toolbar>

  <div class="page-content">

    <md-card>
      <md-card-title>AUTHOR</md-card-title>
      <md-card-content>  
      <md-list-item class="md-2-line">
        <img md-card-avatar class = "avatar" src={{recipe.avatar}}>
         <div class="mat-list-text">
            <p md-line class = "authorName"> Shiba Inu </p>
          </div>
          <md-icon>message</md-icon>
      </md-list-item>
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
        <md-list *ngFor="let ingredient of recipe?.ingredients; let i = index">
            <p>{{ingredient}}</p>
        </md-list>
      </md-card-content>
    </md-card>

    <md-card>
      <md-card-title>STEPS</md-card-title>
      <md-card-content>
        <md-list *ngFor="let step of recipe?.steps; let i = index">
            <p>{{i+1}} {{step.content}}</p>
            <img src={{step.imageSource}} style="width: 100%;max-height: 100%"> 
                    alt="recipe image" style="width: 100%;max-height: 100%">
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

  public likeRecipe(recipe: Recipe) {
    console.log(recipe.rating);
    if (recipe.rating === 0) {
      recipe.rating = 1;
    } else {
      recipe.rating = 0;
  }
}
