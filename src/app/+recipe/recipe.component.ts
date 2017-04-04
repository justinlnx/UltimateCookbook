import {Location} from '@angular/common';
import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import {MdDialog} from '@angular/material';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {Subscription} from 'rxjs/Subscription';

import {ApiService, ChatroomService, PushCartEntrySchema, Recipe, User} from '../api';
import {ErrorReportService} from '../error-report';

import {DeleteRecipeDialogComponent} from './delete-recipe-dialog.component';

@Component({
  selector: 'recipe',
  template: `
  <md-toolbar class="top-toolbar" color="primary">
    <button md-icon-button class="back-button" (click)="onNavigatingBack()">
        <md-icon>arrow_back</md-icon>
      </button>
      <span>{{recipe?.name}}</span>
      <span class="toolbar-spacer"></span>
      <button md-icon-button *ngIf="isLoggedIn() && isOwner(recipe)" (click)="removeRecipe()">
        <md-icon>delete</md-icon>
      </button>
  </md-toolbar>

  <div class="page-content" *ngIf="!!recipe">
    <md-card>
      <md-card-title>{{recipe.name}}</md-card-title>
      <md-card-content>
        <md-list>
          <md-list-item class="md-2-line">
            <img md-card-avatar class="avatar" [src]="recipe.avatar">
            <div class="mat-list-text">
              <p md-line class = "name">{{author?.name}}</p>
            </div>
          </md-list-item>
          <p class="description">{{recipe.description}}</p>
        </md-list>
        <button md-icon-button  *ngIf="isLoggedIn() && !isOwner(recipe)" (click)="likeRecipe(recipe)">
          <md-icon>
            <span md-icon [class.fav-button]="isLiked(recipe)">favorite</span>
          </md-icon>
        </button>
        <button md-icon-button  *ngIf="isLoggedIn() && !isOwner(recipe)" (click)="openChat()">
          <md-icon>
            <span>chat_bubble_outline</span>
          </md-icon>
        </button>
      </md-card-content>
    </md-card>

    <md-card>
      <md-card-title>Ingredients</md-card-title>
      <md-card-content>
        <md-list *ngFor="let ingredient of recipe.ingredients">
          <p>{{ingredient}}</p>
        </md-list>
      </md-card-content>
      <md-card-actions>
        <button md-icon-button *ngIf="isLoggedIn() && !isOwner(recipe)" (click)="addNewCartEntry()">
          <md-icon>add_shopping_cart</md-icon>
        </button>
      </md-card-actions>
    </md-card>

    <md-card *ngFor="let step of recipe.steps; let i = index">
      <md-card-title>Steps {{i+1}}</md-card-title>
      <md-card-content>
        <p>{{step.content}}</p>
        <div *ngIf="isImage(step.imageSource)">
        <img [src]="trustedImageUrl" alt="recipe image" style="width: 100%; max-height: 100%">
        </div>
      </md-card-content>
    </md-card>

    <md-card>
      <md-card-title>Comments</md-card-title>
      <md-card-content>
        <div *ngFor="let comment of recipe.comments">
            <md-card-content>
              <md-list>
                <comment-list-item [comment]="comment.content"
                                   [userObservable]="getUserInfoObservable(comment.userId)">
                </comment-list-item>
              </md-list>
              <md-divider></md-divider>
            </md-card-content>
        </div>
        <md-card-content *ngIf="isLoggedIn() && !isOwner(recipe)">
          <div>
            <md-input-container [dividerColor]="commentInputColor()">
              <input mdInput placeholder="Write a comment..." [formControl]="commentInputControl">
              <md-hint *ngIf="!validCommentInput()">Comment is empty.</md-hint>
            </md-input-container>
          </div>
          <md-card-actions>
            <button md-raised-button (click)="onPostComment()">Add</button>
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
  public author: User;
  public trustedImageUrl: SafeResourceUrl;

  public commentInputControl = new FormControl('', [Validators.required]);

  private chatroomIdObservable: Observable<string>;
  private recipeSubscription: Subscription;

  constructor(
      private route: ActivatedRoute, private apiService: ApiService,
      private domSanitizer: DomSanitizer, private router: Router,
      private errorReportService: ErrorReportService, public location: Location,
      public chatroomService: ChatroomService, private mdDialog: MdDialog) {}

  public ngOnInit(): void {
    this.route.params
        .switchMap((params: Params) => Observable.of(this.apiService.getRecipe(params['id'])))
        .subscribe((recipeObservable) => {
          this.recipeSubscription = recipeObservable.subscribe((recipe) => {
            console.log(recipe);
            this.recipe = recipe;

            if (recipe) {
              if (this.apiService.isLoggedIn()) {
                this.chatroomService.getCurrentUserChatroomIdObservable(recipe.authorId)
                    .subscribe((chatroomIdObservable) => {
                      this.chatroomIdObservable = chatroomIdObservable;
                    });
              }

              this.apiService.getUserInfoObservable(recipe.authorId).subscribe((user) => {
                this.author = user;
              });
            }
          }, (err) => this.errorReportService.send(err));
        });
  }

  public ngOnDestroy(): void {
    this.recipeSubscription.unsubscribe();
  }

  public onNavigatingBack() {
    this.location.back();
  }

  public removeRecipe(): void {
    let dialogRef = this.mdDialog.open(DeleteRecipeDialogComponent);
    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'Yes') {
        this.apiService.deleteRecipe(this.recipe);
        this.location.back();
      }
    });
  }

  public likeRecipe(recipe: Recipe) {
    this.apiService.toggleLike(recipe);
  }

  public isLoggedIn(): boolean {
    return this.apiService.isLoggedIn();
  }

  public isLiked(recipe: Recipe): boolean {
    if (this.apiService.isLoggedIn()) {
      return this.apiService.isLiked(recipe);
    }
    return false;
  }

  public isOwner(recipe: Recipe): boolean {
    if (this.apiService.isLoggedIn()) {
      return this.apiService.ownsRecipe(recipe);
    }
    return false;
  }

  public isImage(imageSource: string): boolean {
    if (imageSource === '') {
      return false;
    }
    this.trustedImageUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(imageSource);
    return true;
  }

  public addNewCartEntry() {
    let newCartEntry: PushCartEntrySchema = {
      recipeId: this.recipe.$key,
      ingredients: this.recipe.ingredients.map((ingredient) => {
        return {content: ingredient, bought: false};
      })
    };

    this.apiService.pushNewCartEntryForCurrentUser(newCartEntry);
  }

  public openChat() {
    let subscription = this.chatroomIdObservable.subscribe((chatroomId) => {
      if (chatroomId) {
        this.router.navigateByUrl(`/home/chatroom/${chatroomId}`);
        subscription.unsubscribe();
      } else {
        this.chatroomService.createNewChatroom(this.recipe.authorId);
      }
    });
  }

  public getUserInfoObservable(userId: string): Observable<User> {
    return this.apiService.getUserInfoObservable(userId);
  }

  public commentInputColor(): string {
    return this.validCommentInput() ? 'primary' : 'warn';
  }

  public validCommentInput(): boolean {
    return this.commentInputControl.valid;
  }

  public onPostComment(): void {
    if (this.commentInputControl.valid) {
      this.apiService.getCurrentUserObservable().first().subscribe((currentUser) => {
        let content = this.commentInputControl.value;
        let userId = currentUser.id;

        this.apiService.commentOnRecipe(this.recipe, {content, userId});

        this.commentInputControl.setValue('');
      });
    }
  }
}
