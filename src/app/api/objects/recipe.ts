import {Comment, commentReceiveScheme, CommentSchema} from './comment';
import {CookStep, cookStepReceiveScheme, CookStepSchema} from './cook-step';
import {DatabaseSchema} from './database-schema';
import {DefaultTransferActions} from './default-transfer-actions';
import {FrontendObject} from './frontend-object';
import {Ingredient, ingredientReceiveScheme, IngredientSchema} from './ingredient';
import {ReceiveScheme} from './receive-scheme';

export interface RecipeSchema extends DatabaseSchema {
  $key: string;
  avatar: string;
  name: string;
  authorId: string;
  description: string;
  ingredients: IngredientSchema[];
  likedUsers: string[];
  steps: CookStepSchema[];
  comments: CommentSchema[];
}

export class Recipe extends FrontendObject {
  constructor(
      public $key: string, public avatar: string, public name: string, public authorId: string,
      public description: string, public ingredients: Ingredient[], public likedUsers: string[],
      public steps: CookStep[], public comments: Comment[]) {
    super();
  }
}

class RecipeReceiveScheme implements ReceiveScheme {
  public receive(recipeSchema: RecipeSchema): Recipe {
    let $key = recipeSchema.$key;
    let avatar = DefaultTransferActions.stringAction(recipeSchema.avatar);
    let name = DefaultTransferActions.stringAction(recipeSchema.name);
    let authorId = DefaultTransferActions.stringAction(recipeSchema.authorId);
    let description = DefaultTransferActions.stringAction(recipeSchema.description);
    let likedUsers = DefaultTransferActions.arrayAction(recipeSchema.likedUsers);

    let ingredients = DefaultTransferActions.arrayAction(recipeSchema.ingredients);
    ingredients = ingredients.map((ingredient) => {
      return ingredientReceiveScheme.receive(ingredient);
    });

    let steps = DefaultTransferActions.arrayAction(recipeSchema.steps);
    steps = steps.map((step) => {
      return cookStepReceiveScheme.receive(step);
    });

    let comments = DefaultTransferActions.arrayAction(recipeSchema.comments);
    comments = comments.map((comment) => {
      return commentReceiveScheme.receive(comment);
    });

    return new Recipe(
        $key, avatar, name, authorId, description, ingredients, likedUsers, steps, comments)
  }
}

export const recipeReceiveScheme = new RecipeReceiveScheme();
