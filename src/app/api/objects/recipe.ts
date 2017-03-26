import {Comment, commentReceiveScheme, PushCommentSchema} from './comment';
import {CookStep, cookStepReceiveScheme, PushCookStepSchema} from './cook-step';
import {DatabaseSchema, PushDatabaseSchema} from './database-schema';
import {DefaultTransferActions} from './default-transfer-actions';
import {FrontendObject} from './frontend-object';
import {Ingredient, ingredientReceiveScheme, PushIngredientSchema} from './ingredient';
import {ReceiveScheme} from './receive-scheme';
import {User} from './user';

export interface PushRecipeSchema extends PushDatabaseSchema {
  avatar: string;
  name: string;
  authorId: string;
  description: string;
  ingredients: PushIngredientSchema[];
  likedUsers: string[];
  steps: PushCookStepSchema[];
  comments: PushCommentSchema[];
}

export interface RecipeSchema extends PushRecipeSchema, DatabaseSchema {}

export class Recipe extends FrontendObject {
  constructor(
      public $key: string, public avatar: string, public name: string, public authorId: string,
      public description: string, public ingredients: Ingredient[], public likedUsers: string[],
      public steps: CookStep[], public comments: Comment[]) {
    super($key);
  }

  public asPushSchema(): PushRecipeSchema {
    return {
      avatar: this.avatar,
      name: this.name,
      authorId: this.authorId,
      description: this.description,
      ingredients: this.pushIngredientsSchema(),
      likedUsers: this.likedUsers,
      steps: this.pushCookStepsSchema(),
      comments: this.pushCommentsSchema()
    };
  }

  public asSchema(): RecipeSchema {
    return this.pushSchemaToSchema();
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

  private pushIngredientsSchema(): PushIngredientSchema[] {
    return this.ingredients.map((ingredient) => {
      return ingredient.asPushSchema();
    });
  }

  private pushCookStepsSchema(): PushCookStepSchema[] {
    return this.steps.map((step) => {
      return step.asPushSchema();
    });
  }

  private pushCommentsSchema(): PushCommentSchema[] {
    return this.comments.map((comment) => {
      return comment.asPushSchema();
    });
  }
}

// tslint:disable-next-line:max-classes-per-file
class RecipeReceiveScheme extends ReceiveScheme {
  public receiveAsDescendant(recipeSchema: PushRecipeSchema, index: string): Recipe {
    let $key = DefaultTransferActions.requiredStringAction(index);
    let avatar = DefaultTransferActions.stringAction(recipeSchema.avatar);
    let name = DefaultTransferActions.stringAction(recipeSchema.name);
    let authorId = DefaultTransferActions.stringAction(recipeSchema.authorId);
    let description = DefaultTransferActions.stringAction(recipeSchema.description);
    let likedUsers = DefaultTransferActions.arrayAction(recipeSchema.likedUsers);

    let ingredients = DefaultTransferActions.arrayAction(recipeSchema.ingredients);
    let transferredIngredients = ingredients.map((ingredient, ingredientIndex) => {
      return ingredientReceiveScheme.receiveAsDescendant(ingredient, `${ingredientIndex}`);
    });

    let steps = DefaultTransferActions.arrayAction(recipeSchema.steps);
    let transferredSteps = steps.map((step, stepIndex) => {
      return cookStepReceiveScheme.receiveAsDescendant(step, `${stepIndex}`);
    });

    let comments = DefaultTransferActions.arrayAction(recipeSchema.comments);
    let transferredComments = comments.map((comment, commentIndex) => {
      return commentReceiveScheme.receiveAsDescendant(comment, `${commentIndex}`);
    });

    return new Recipe(
        $key, avatar, name, authorId, description, transferredIngredients, likedUsers,
        transferredSteps, transferredComments);
  }
}

export const recipeReceiveScheme = new RecipeReceiveScheme();
