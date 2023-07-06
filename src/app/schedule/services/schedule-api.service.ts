import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { defer, from, Observable } from 'rxjs';
import { toApiStringFromDate, toDateFromApi } from '../../shared/utils/date-utils';
import { SupabaseService } from '../../shared/services/supabase.service';
import { Meal, Recipe } from '../../model';

@Injectable({
    providedIn: 'root',
})
export class ScheduleApiService {
    constructor(private supabaseService: SupabaseService) {}

    getMealsOfWeek(startDate: Date, endDate: Date): Observable<Meal[]> {
        return defer(() =>
            from(
                this.supabaseService
                    .getClient()
                    .from('meal')
                    .select(`*, recipe(id, name, url)`)
                    .lte('date', toApiStringFromDate(endDate))
                    .gte('date', toApiStringFromDate(startDate))
            ).pipe(
                map((result) => {
                    if (result.error) {
                        throw result.error;
                    }
                    return result.data;
                }),
                map((data) =>
                    data.map(
                        (m) =>
                            <Meal>{
                                id: m.id,
                                date: toDateFromApi(m.date),
                                type: m.type,
                                notes: m.notes,
                                recipe: <Recipe>{ id: m.recipe.id, name: m.recipe.name, url: m.recipe.url },
                            }
                    )
                )
            )
        );
    }

    createMeal(meal: Meal) {
        return defer(() =>
            from(
                this.supabaseService
                    .getClient()
                    .from('meal')
                    .insert({
                        date: toApiStringFromDate(meal.date),
                        type: meal.type,
                        recipe: meal.recipe.id,
                        notes: meal.notes,
                    })
                    .select(`*, recipe(id, name, url)`)
                    .single()
            ).pipe(
                map((result) => {
                    if (result.error) {
                        throw result.error;
                    }

                    return <Meal>{
                        id: result.data.id,
                        date: toDateFromApi(result.data.date),
                        type: result.data.type,
                        notes: result.data.notes,
                        recipe: <Recipe>{
                            id: result.data.recipe.id,
                            name: result.data.recipe.name,
                            url: result.data.recipe.url,
                        },
                    };
                })
            )
        );
    }

    updateMeal(meal: Meal) {
        return defer(() =>
            from(
                this.supabaseService
                    .getClient()
                    .from('meal')
                    .update({
                        date: toApiStringFromDate(meal.date),
                        type: meal.type,
                        notes: meal.notes,
                        recipe: meal.recipe.id,
                    })
                    .eq('id', meal.id)
            ).pipe(
                map((result) => {
                    if (result.error) {
                        throw result.error;
                    }
                })
            )
        );
    }

    deleteMeal(id: number) {
        return defer(() =>
            from(this.supabaseService.getClient().from('meal').delete().eq('id', id)).pipe(map((_) => id))
        );
    }
}
