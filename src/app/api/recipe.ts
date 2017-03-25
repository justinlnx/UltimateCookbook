import {ImageSource, RecipeId, UserId} from './types';

export interface CookStep {
  content: string;
  imageSource: ImageSource;
}

export interface Comment {
  content: string;
  userId: UserId;
}

export interface PushRecipe {
  avatar: string;
  name: string;
  authorId: UserId;
  description: string;
  ingredients: string[];
  likedUsers: UserId[];
  steps: CookStep[];
  comments: Comment[];
}

export interface Recipe extends PushRecipe { $key: RecipeId; }
