import { Recipe } from 'src/app/api.generated';

export type RecipeWithLastPreparation = Recipe & { lastPreparation?: Date };
