import { Injectable } from '@angular/core';
import { isFuture, max, startOfDay } from 'date-fns';
import { map } from 'rxjs/operators';
import {
    CreateRecipeGQL,
    CreateRecipeMutationVariables,
    GetAllRecipesGQL,
    Recipe,
    UpdateRecipeGQL,
    UpdateRecipeMutationVariables,
} from '../../api.generated';
import { RecipeWithLastPreparation } from '../models/recipe.model';
import { Observable } from 'rxjs';
import { toDateFromApi } from '../utils/date-utils';

@Injectable({ providedIn: 'root' })
export class RecipeApiService {
    constructor(
        private getAllRecipesQuery: GetAllRecipesGQL,
        private createRecipeMutation: CreateRecipeGQL,
        private updateRecipeMutation: UpdateRecipeGQL
    ) {}

    getAllRecipes(): Observable<RecipeWithLastPreparation[]> {
        const variables = {};
        return this.getAllRecipesQuery.fetch(variables).pipe(
            map((response) => response.data.allRecipesByDeletedFlag.data),
            map((recipes) =>
                recipes.map((recipe) =>
                    recipe
                        ? {
                              _id: recipe._id,
                              name: recipe.name,
                              url: recipe.url,
                              lastPreparation:
                                  this.getNewestNonFutureDateFromGraphQlDates(
                                      recipe.meals.data.reduce<Date[]>((dates, curr) => {
                                          if (curr !== null) {
                                              dates.push(toDateFromApi(curr.date));
                                          }
                                          return dates;
                                      }, [])
                                  ) ?? undefined,
                              note: recipe.note,
                              tags: recipe.tags,
                              deleted: recipe.deleted,
                          }
                        : null
                )
            ),
            map((recipes) => recipes.filter((r) => r != null) as RecipeWithLastPreparation[])
        );
    }

    createRecipe(recipe: Recipe) {
        const variables: CreateRecipeMutationVariables = {
            name: recipe.name,
            url: recipe.url,
            note: recipe.note,
            deleted: false,
            tags: recipe.tags || [],
        };

        return this.createRecipeMutation.mutate(variables).pipe(map((response) => response.data?.createRecipe._id));
    }

    updateRecipe(recipe: Recipe) {
        const variables: UpdateRecipeMutationVariables = {
            id: recipe._id,
            name: recipe.name,
            url: recipe.url,
            note: recipe.note,
            deleted: recipe.deleted || false,
            tags: recipe.tags || [],
        };
        return this.updateRecipeMutation.mutate(variables).pipe(map((response) => response.data?.updateRecipe?._ts));
    }

    private getNewestNonFutureDateFromGraphQlDates(dates: Date[]): Date | null {
        if (dates == null || !dates.length) {
            return null;
        }

        const parsedDates = dates.map((d) => startOfDay(d));
        const datesNotInFuture = parsedDates.filter((d) => !isFuture(d));
        if (!datesNotInFuture.length) {
            return null;
        }

        return max(datesNotInFuture);
    }
}
