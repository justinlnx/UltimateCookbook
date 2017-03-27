import {Injectable} from '@angular/core';
import {AngularFire, AuthMethods, AuthProviders, FirebaseAuthState} from 'angularfire2';
import {FirebaseListObservable, FirebaseObjectObservable} from 'angularfire2';
import {Observable} from 'rxjs/Observable';
import * as Rx from 'rxjs/Rx';

import {ErrorReportService} from '../error-report';

import {commentsUrl, PUBLIC_RECIPES_URL, userCartUrl, USERS_URL} from './api-urls';
import {generateGuid} from './guid';
import {Mapper} from './objects';
import {PushRecipeSchema, Recipe, recipeReceiveScheme, RecipeSchema} from './objects';
import {PushCommentSchema} from './objects';
import {PushUserSchema, User, userReceiveScheme, UserSchema} from './objects';
import {CartEntry, PushCartEntrySchema} from './objects';

@Injectable()
export class ApiService {
  private authState: FirebaseAuthState = null;
  private recipeListObservable: FirebaseListObservable<RecipeSchema[]>;
  private userListObservable: FirebaseListObservable<UserSchema[]>;

  private recipeListMappedObservable: Observable<Recipe[]>;
  private userListMappedObservable: Observable<User[]>;
  private currentUserMappedObservable: Observable<User>;

  constructor(private af: AngularFire, public errorReportService: ErrorReportService) {
    this.recipeListObservable = this.af.database.list(PUBLIC_RECIPES_URL);
    this.userListObservable = this.af.database.list(USERS_URL);

    this.recipeListMappedObservable =
        Mapper.mapListObservable(this.recipeListObservable, recipeReceiveScheme);

    this.userListMappedObservable =
        Mapper.mapListObservable(this.userListObservable, userReceiveScheme);

    this.currentUserMappedObservable = this.userListMappedObservable.map((userList: User[]) => {
      if (!this.authState) {
        return null;
      }

      return userList.find((user) => {
        return user.id === this.authState.uid;
      });
    });

    this.getAuth().subscribe(
        (newState) => {
          this.authState = newState;
        },
        (err) => this.errorReportService.send(err),
        () => console.error('No more authentication state!!!'));
  }

  public isLoggedIn() {
    return !!this.authState;
  }

  public getAuth() {
    return this.af.auth;
  }

  public getLoginObservable(): Observable<boolean> {
    return this.getAuth().map((authState) => {
      return !!authState;
    });
  }

  public login(email: string, password: string): void {
    this.getAuth()
        .login({email, password}, {provider: AuthProviders.Password, method: AuthMethods.Password})
        .then(
            (state) => {
              console.log(state);
            },
            (err) => {
              this.errorReportService.send(err.message);
            });
  }

  public createUser(email: string, password: string, name: string): void {
    this.getAuth()
        .createUser({email, password})
        .then(
            (state) => {
              let id = state.uid;

              let newUser: PushUserSchema = {id, name, recipes: [], likedRecipes: [], cart: []};

              this.userListObservable.push(newUser).then(
                  (_) => console.log(`User created: ${email}, ${password}, ${name}`),
                  (err) => this.errorReportService.send(err.message));

            },
            (err) => {
              this.errorReportService.send(err.message);
            });
  }

  public getCurrentUserObservable(): Observable<User> {
    return this.currentUserMappedObservable;
  }

  public toggleLike(recipe: Recipe): void {
    this.checkAuthState();

    if (recipe.authorId === this.authState.uid) {
      this.errorReportService.send('Cannot like yourself!');
      return;
    }

    this.userListMappedObservable.first().subscribe((users) => {
      let likedUsers = recipe.likedUsers;

      let user = this.getCurrentUser(users);

      let userLikedRecipes = user.likedRecipes;

      if (recipe.isLikedByUser(user)) {
        user.removeRecipeFromLikedList(recipe);
        recipe.removeLikedUser(user);
      } else {
        user.addRecipeToLikedList(recipe);
        recipe.addLikedUser(user);
      }

      this.updateLikedUsers(recipe);
      this.updateUserLikedRecipes(user);

    }, (err) => this.errorReportService.send(err));
  }

  public getLikedRecipes(): Observable<Recipe[]> {
    return Rx.Observable.combineLatest(
        this.recipeListMappedObservable, this.userListMappedObservable,
        (recipeList: Recipe[], userList: User[]) => {
          let user = this.getCurrentUser(userList);

          return recipeList.filter((recipe: Recipe) => {
            return user.isInLikedRecipes(recipe);
          });
        });
  }

  public getOwnedRecipes(): Observable<Recipe[]> {
    this.checkAuthState();

    return this.recipeListMappedObservable.map((recipes: Recipe[]) => {
      return recipes.filter((recipe) => {
        return this.ownsRecipe(recipe);
      });
    });
  }

  public ownsRecipe(recipe: Recipe): boolean {
    this.checkAuthState();

    return this.authState.uid === recipe.authorId;
  }

  public isLiked(recipe: Recipe): boolean {
    this.checkAuthState();

    let likedUsers = recipe.likedUsers;

    let found = likedUsers.find((userId) => {
      return userId === this.authState.uid;
    });

    return !!found;
  }

  public getCartObservableOfCurrentUser(): Observable<CartEntry[]> {
    return this.currentUserMappedObservable.map((user) => {
      if (!user) {
        return [];
      }
      return user.cart;
    });
  }

  public pushNewCartEntryForCurrentUser(pushCartEntrySchema: PushCartEntrySchema): void {
    this.checkAuthState();

    this.getCurrentUserObservable().first().subscribe((user: User) => {
      let cartEntryLength = user.cart.length;

      this.af.database.list(userCartUrl(user.$key))
          .update(`${cartEntryLength}`, pushCartEntrySchema)
          .then((_) => console.log('success.'), (err) => this.errorReportService.send(err.message));
      ;
    });
  }

  public updateCartEntryForCurrentUser(cartEntry: CartEntry): void {
    this.checkAuthState();

    this.getCurrentUserObservable().first().subscribe((user: User) => {
      let cartEntryLength = user.cart.length;

      this.af.database.list(userCartUrl(user.$key))
          .update(cartEntry.$key, cartEntry.asPushSchema())
          .then((_) => console.log('success.'), (err) => this.errorReportService.send(err.message));
      ;
    });
  }

  public commentOnRecipe(recipe: Recipe, comment: PushCommentSchema): void {
    this.checkAuthState();

    let recipeId = recipe.$key;

    this.af.database.list(commentsUrl(recipeId))
        .push(comment)
        .then((_) => console.log('success.'), (err) => this.errorReportService.send(err.message));
  }

  public getAllRecipes(): Observable<Recipe[]> {
    return this.recipeListMappedObservable;
  }

  public getRecipe($key: string): Observable<Recipe> {
    return Mapper.mapObservable(
        this.af.database.object(`${PUBLIC_RECIPES_URL}/${$key}`), recipeReceiveScheme);
  }

  public getRecipeOwner($key: string): Observable<User> {
    return Rx.Observable.combineLatest(
        this.getRecipe($key), this.userListMappedObservable, (recipe: Recipe, userList: User[]) => {
          return userList.find((user) => {
            return user.id === recipe.authorId;
          });
        });
  }

  public getRecipeAuthorName($key: string): Observable<string> {
    return this.getRecipeOwner($key).map((user: User) => {
      return user.name;
    });
  }

  public addRecipe(recipe: PushRecipeSchema): void {
    this.recipeListObservable.push(recipe).then(
        (_) => console.log('success.'), (err) => this.errorReportService.send(err.message));
  }

  public deleteRecipe(recipe: Recipe): void {
    if (this.authState.uid !== recipe.authorId) {
      throw new Error('Action not permitted by current user.');
    } else {
      this.af.database.list(PUBLIC_RECIPES_URL)
          .remove(recipe.$key)
          .then((_) => console.log('200: OK'), (err) => this.errorReportService.send(err.message));
    }
  }

  public updateRecipe(updateRecipe: Recipe): void {
    let $key = updateRecipe.$key;

    if (this.authState.uid !== updateRecipe.authorId) {
      throw new Error('Action not permitted by current user.');
    } else {
      this.getRecipe($key).first().subscribe((currentRecipe) => {

        if (currentRecipe.authorId !== updateRecipe.authorId) {
          throw new Error('Author id cannot be modified.');
        }

        // if (!this.checkArrayEqual(currentRecipe.steps, updateRecipe.steps)) {
        //   this.updateSteps($key, updateRecipe.steps);
        // }
        if (currentRecipe.avatar !== updateRecipe.avatar) {
          this.updateAvatar($key, updateRecipe.avatar);
        }
        if (currentRecipe.description !== updateRecipe.description) {
          this.updateDescription($key, updateRecipe.description);
        }
        // if (!this.checkArrayEqual(currentRecipe.ingredients, updateRecipe.ingredients)) {
        //   this.updateIngredients($key, updateRecipe.ingredients);
        // }
        if (currentRecipe.name !== updateRecipe.name) {
          this.updateName($key, updateRecipe.avatar);
        }
      });
    }
  }
  private checkArrayEqual(oldArr: string[], newArr: string[]): boolean {
    if (newArr === null || newArr === undefined) {
      return true;
    }
    if (oldArr === null || oldArr === undefined) {
      return false;
    }
    if (oldArr.length !== newArr.length) {
      return false;
    }
    for (let i = 0; i < oldArr.length; i++) {
      if (oldArr[i] !== newArr[i]) {
        return false;
      }
    }
    return true;
  }
  private updateSteps($key: string, newSteps: string[]): void {
    this.af.database.list(PUBLIC_RECIPES_URL)
        .update($key, {steps: newSteps})
        .then((_) => console.log('200: OK'), (err) => this.errorReportService.send(err.message));
  }

  private updateAvatar($key: string, newAvatar: string): void {
    this.af.database.list(PUBLIC_RECIPES_URL)
        .update($key, {avatar: newAvatar})
        .then((_) => console.log('200: OK'), (err) => this.errorReportService.send(err.message));
  }

  private updateDescription($key: string, newDescription: string): void {
    this.af.database.list(PUBLIC_RECIPES_URL)
        .update($key, {description: newDescription})
        .then((_) => console.log('200: OK'), (err) => this.errorReportService.send(err.message));
  }

  private updateImageSources($key: string, newImageSources: string[]): void {
    this.af.database.list(PUBLIC_RECIPES_URL)
        .update($key, {imageSources: newImageSources})
        .then((_) => console.log('200: OK'), (err) => this.errorReportService.send(err.message));
  }

  private updateIngredients($key: string, newIngredients: string[]): void {
    this.af.database.list(PUBLIC_RECIPES_URL)
        .update($key, {ingredients: newIngredients})
        .then((_) => console.log('200: OK'), (err) => this.errorReportService.send(err.message));
  }

  private updateName($key: string, newName: string): void {
    this.af.database.list(PUBLIC_RECIPES_URL)
        .update($key, {name: newName})
        .then((_) => console.log('200: OK'), (err) => this.errorReportService.send(err.message));
  }

  private updateLikedUsers(recipe: Recipe): void {
    this.af.database.list(PUBLIC_RECIPES_URL)
        .update(recipe.$key, {likedUsers: recipe.likedUsers})
        .then((_) => console.log('200: OK'), (err) => this.errorReportService.send(err.message));
  }

  private updateUserLikedRecipes(user: User): void {
    this.userListObservable.update(user.$key, {likedRecipes: user.likedRecipes})
        .then((_) => console.log('200: OK'), (err) => this.errorReportService.send(err.message));
  }

  private checkAuthState() {
    if (!this.isLoggedIn()) {
      throw new Error('Not signed in!!!');
    }
  }

  private getCurrentUser(users: User[]): User {
    return users.find((user) => {
      return user.id === this.authState.uid;
    });
  }
}
