import {Comment, commentReceiveScheme, CommentSchema} from './comment';
import {CookStep, cookStepReceiveScheme, CookStepSchema} from './cook-step';
import {DatabaseSchema, PushDatabaseSchema} from './database-schema';
import {DefaultTransferActions} from './default-transfer-actions';
import {FrontendObject} from './frontend-object';
import {Ingredient, ingredientReceiveScheme, IngredientSchema} from './ingredient';
import {ReceiveScheme} from './receive-scheme';
import {User} from './user';

export interface PushRecipeSchema extends PushDatabaseSchema {
  avatar: string;
  name: string;
  authorId: string;
  description: string;
  ingredients: IngredientSchema[];
  likedUsers: string[];
  steps: CookStepSchema[];
  comments: CommentSchema[];
}

export interface RecipeSchema extends PushRecipeSchema, DatabaseSchema {}

export class Recipe extends FrontendObject {
  constructor(
      public $key: string, public avatar: string, public name: string, public authorId: string,
      public description: string, public ingredients: Ingredient[], public likedUsers: string[],
      public steps: CookStep[], public comments: Comment[]) {
    super();
  }

  public asPushSchema(): PushRecipeSchema {
    return {
      avatar: this.avatar,
      name: this.name,
      authorId: this.authorId,
      description: this.description,
      ingredients: this.ingredientsSchema(),
      likedUsers: this.likedUsers,
      steps: this.cookStepsSchema(),
      comments: this.commentsSchema()
    };
  }

  public asSchema(): RecipeSchema {
    let schema: any = this.asPushSchema();
    schema.$key = this.$key;
    return schema;
  }

  public numberOfLikes(): number {
    return this.likedUsers.length;
  }

  public isLikedByUser(user: User): boolean {
    return !!user.likedRecipes.find((recipeId) => {
      return recipeId === this.$key;
    });
  }

  public removeLikedUser(user: User): void {
    this.likedUsers = this.likedUsers.filter((userId) => {
      return userId !== user.$key;
    });
  }

  public addLikedUser(user: User): void {
    this.likedUsers.push(user.$key);
  }

  private ingredientsSchema(): IngredientSchema[] {
    return this.ingredients.map((ingredient) => {
      return ingredient.asSchema();
    });
  }

  private cookStepsSchema(): CookStepSchema[] {
    return this.steps.map((step) => {
      return step.asSchema();
    });
  }

  private commentsSchema(): CommentSchema[] {
    return this.comments.map((comment) => {
      return comment.asSchema();
    });
  }
}

// tslint:disable-next-line:max-classes-per-file
class RecipeReceiveScheme implements ReceiveScheme {
  public receive(recipeSchema: RecipeSchema): Recipe {
    let $key = recipeSchema.$key;
    let avatar = DefaultTransferActions.stringAction(recipeSchema.avatar);
    let name = DefaultTransferActions.stringAction(recipeSchema.name);
    let authorId = DefaultTransferActions.stringAction(recipeSchema.authorId);
    let description = DefaultTransferActions.stringAction(recipeSchema.description);
    let likedUsers = DefaultTransferActions.arrayAction(recipeSchema.likedUsers);

    let ingredients = DefaultTransferActions.arrayAction(recipeSchema.ingredients);
    let transferredIngredients = ingredients.map((ingredient) => {
      return ingredientReceiveScheme.receive(ingredient);
    });

    let steps = DefaultTransferActions.arrayAction(recipeSchema.steps);
    let transferredSteps = steps.map((step) => {
      return cookStepReceiveScheme.receive(step);
    });

    let comments = DefaultTransferActions.arrayAction(recipeSchema.comments);
    let transferredComments = comments.map((comment) => {
      return commentReceiveScheme.receive(comment);
    });

    return new Recipe(
        $key, avatar, name, authorId, description, transferredIngredients, likedUsers,
        transferredSteps, transferredComments);
  }
}

export const recipeReceiveScheme = new RecipeReceiveScheme();
