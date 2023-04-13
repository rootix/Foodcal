import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { differenceInCalendarDays } from 'date-fns';
import { map } from 'rxjs/operators';
import {
    CreateMealGQL,
    CreateMealMutationVariables,
    DeleteMealGQL,
    DeleteMealMutationVariables,
    GetMealsOfWeekGQL,
    Meal,
    UpdateMealGQL,
    UpdateMealMutationVariables,
} from '../../api.generated';
import { Observable } from 'rxjs';
import { toApiStringFromDate, toDateFromApi } from '../../shared/utils/date-utils';

@Injectable({
    providedIn: 'root',
})
export class ScheduleApiService {
    constructor(
        private apollo: Apollo,
        private getMealsOfWeekGQL: GetMealsOfWeekGQL,
        private createMealGQL: CreateMealGQL,
        private updateMealGQL: UpdateMealGQL,
        private deleteMealGQL: DeleteMealGQL
    ) {}

    getMealsOfWeek(startDate: Date, endDate: Date): Observable<Meal[]> {
        const maxNumberOfMeals = (differenceInCalendarDays(endDate, startDate) + 1) * 2;
        const variables = {
            from: toApiStringFromDate(startDate),
            to: toApiStringFromDate(endDate),
            size: maxNumberOfMeals,
        };

        return this.getMealsOfWeekGQL.fetch(variables).pipe(
            map((response) => response.data.allMealsInDateRange.data || []),
            map((meals) =>
                meals.filter((m) => m != null && toDateFromApi(m.date) >= startDate && toDateFromApi(m.date) <= endDate)
            ),
            map((graphQlMeals) =>
                graphQlMeals.map((m) =>
                    m != null
                        ? ({
                              _id: m._id,
                              _ts: m._ts,
                              type: m.type,
                              notes: m.notes,
                              date: m.date,
                              recipe: m.recipe ? { _id: m.recipe._id, name: m.recipe.name, url: m.recipe.url } : null,
                          } as Meal)
                        : null
                )
            ),
            map((meals) => meals.filter((m) => m != null) as Meal[])
        );
    }

    createMeal(meal: Meal) {
        const variables: CreateMealMutationVariables = {
            date: meal.date,
            type: meal.type,
            recipe: { connect: meal.recipe._id },
            notes: meal.notes,
        };
        return this.createMealGQL.mutate(variables).pipe(
            map((response) => {
                if (!response.data) {
                    throw Error('missing response');
                }

                return response.data.createMeal._id;
            })
        );
    }

    updateMeal(meal: Meal) {
        const variables: UpdateMealMutationVariables = {
            id: meal._id,
            date: meal.date,
            type: meal.type,
            recipe: { connect: meal.recipe._id },
            notes: meal.notes,
        };

        return this.updateMealGQL.mutate(variables).pipe(
            map((response) => {
                if (!response.data?.updateMeal) {
                    throw Error('missing response');
                }

                return response.data.updateMeal._ts;
            })
        );
    }

    deleteMeal(id: string) {
        const variables: DeleteMealMutationVariables = {
            id,
        };

        return this.deleteMealGQL.mutate(variables).pipe(
            map((response) => {
                if (!response.data?.deleteMeal) {
                    throw Error('missing response');
                }

                return response.data.deleteMeal._id;
            })
        );
    }
}
