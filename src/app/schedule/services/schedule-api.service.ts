import { Injectable, inject } from '@angular/core';
import { map, switchMap } from 'rxjs/operators';
import { defer, from, Observable, of } from 'rxjs';
import { toApiStringFromDate, toDateFromApi } from '../../shared/utils/date-utils';
import { SupabaseService } from '../../shared/services/supabase.service';
import { Dish, Meal, MealFormValue, MealType } from '../../model';

@Injectable({
    providedIn: 'root',
})
export class ScheduleApiService {
    private supabaseService = inject(SupabaseService);

    getMealsOfWeek(startDate: Date, endDate: Date): Observable<Meal[]> {
        return defer(() =>
            from(
                this.supabaseService
                    .getClient()
                    .from('meal')
                    .select(`*, meal_dish(sort_index, dish:dish_id(id, name, url))`)
                    .lte('date', toApiStringFromDate(endDate))
                    .gte('date', toApiStringFromDate(startDate))
                    .order('sort_index', { referencedTable: 'meal_dish', ascending: true })
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
                                dishes: (
                                    m.meal_dish as {
                                        sort_index: number;
                                        dish: { id: number; name: string; url: string | null };
                                    }[]
                                ).map(
                                    (md) =>
                                        <Dish>{ id: md.dish.id, name: md.dish.name, url: md.dish.url, deleted: false }
                                ),
                            }
                    )
                )
            )
        );
    }

    createMeal(meal: MealFormValue): Observable<Meal> {
        return defer(() =>
            from(
                this.supabaseService
                    .getClient()
                    .from('meal')
                    .insert({
                        date: toApiStringFromDate(meal.date),
                        type: meal.type,
                        notes: meal.notes,
                    })
                    .select()
                    .single()
            ).pipe(
                map((result) => {
                    if (result.error) {
                        throw result.error;
                    }
                    return result.data;
                }),
                switchMap((mealRow) => {
                    const dishInserts = meal.dishes.map((d, i) => ({
                        meal_id: mealRow.id,
                        dish_id: d.id,
                        sort_index: i,
                    }));
                    if (dishInserts.length === 0) {
                        return of({ mealRow, dishes: [] as Dish[] });
                    }
                    return from(this.supabaseService.getClient().from('meal_dish').insert(dishInserts)).pipe(
                        map((result) => {
                            if (result.error) {
                                throw result.error;
                            }
                            return { mealRow, dishes: meal.dishes };
                        })
                    );
                }),
                map(
                    ({ mealRow, dishes }) =>
                        <Meal>{
                            id: mealRow.id,
                            date: toDateFromApi(mealRow.date),
                            type: mealRow.type,
                            notes: mealRow.notes,
                            dishes,
                        }
                )
            )
        );
    }

    updateMeal(meal: MealFormValue & { id: number }): Observable<void> {
        return defer(() =>
            from(
                this.supabaseService
                    .getClient()
                    .from('meal')
                    .update({
                        date: toApiStringFromDate(meal.date),
                        type: meal.type,
                        notes: meal.notes,
                    })
                    .eq('id', meal.id)
            ).pipe(
                map((result) => {
                    if (result.error) {
                        throw result.error;
                    }
                }),
                switchMap(() =>
                    from(this.supabaseService.getClient().from('meal_dish').delete().eq('meal_id', meal.id)).pipe(
                        map((result) => {
                            if (result.error) {
                                throw result.error;
                            }
                        })
                    )
                ),
                switchMap(() => {
                    const dishInserts = meal.dishes.map((d, i) => ({ meal_id: meal.id, dish_id: d.id, sort_index: i }));
                    if (dishInserts.length === 0) {
                        return of(undefined);
                    }
                    return from(this.supabaseService.getClient().from('meal_dish').insert(dishInserts)).pipe(
                        map((result) => {
                            if (result.error) {
                                throw result.error;
                            }
                        })
                    );
                })
            )
        );
    }

    moveMeal(sourceMealId: number, targetDate: Date, targetType: MealType): Observable<void> {
        const targetDateStr = toApiStringFromDate(targetDate);
        return defer(() =>
            from(
                this.supabaseService.getClient().from('meal').select('id, date, type').eq('id', sourceMealId).single()
            ).pipe(
                map((r) => {
                    if (r.error) throw r.error;
                    return r.data;
                }),
                switchMap((sourceMeal) =>
                    from(
                        this.supabaseService
                            .getClient()
                            .from('meal')
                            .select('id')
                            .eq('date', targetDateStr)
                            .eq('type', targetType)
                            .maybeSingle()
                    ).pipe(
                        map((r) => {
                            if (r.error) throw r.error;
                            return { sourceMeal, occupant: r.data };
                        })
                    )
                ),
                switchMap(({ sourceMeal, occupant }) => {
                    if (occupant && occupant.id !== sourceMealId) {
                        return from(
                            this.supabaseService
                                .getClient()
                                .from('meal')
                                .update({ date: sourceMeal.date, type: sourceMeal.type })
                                .eq('id', occupant.id)
                        ).pipe(
                            map((r) => {
                                if (r.error) throw r.error;
                            }),
                            switchMap(() =>
                                from(
                                    this.supabaseService
                                        .getClient()
                                        .from('meal')
                                        .update({ date: targetDateStr, type: targetType })
                                        .eq('id', sourceMealId)
                                ).pipe(
                                    map((r) => {
                                        if (r.error) throw r.error;
                                    })
                                )
                            )
                        );
                    }
                    return from(
                        this.supabaseService
                            .getClient()
                            .from('meal')
                            .update({ date: targetDateStr, type: targetType })
                            .eq('id', sourceMealId)
                    ).pipe(
                        map((r) => {
                            if (r.error) throw r.error;
                        })
                    );
                })
            )
        );
    }

    copyMeal(meal: MealFormValue): Observable<void> {
        const targetDateStr = toApiStringFromDate(meal.date);
        return defer(() =>
            from(
                this.supabaseService
                    .getClient()
                    .from('meal')
                    .select('id')
                    .eq('date', targetDateStr)
                    .eq('type', meal.type)
                    .maybeSingle()
            ).pipe(
                map((r) => {
                    if (r.error) throw r.error;
                    return r.data;
                }),
                switchMap((occupant) => {
                    if (occupant) {
                        return from(this.supabaseService.getClient().from('meal').delete().eq('id', occupant.id)).pipe(
                            map((r) => {
                                if (r.error) throw r.error;
                            })
                        );
                    }
                    return of(undefined);
                }),
                switchMap(() => this.createMeal(meal)),
                map(() => undefined)
            )
        );
    }

    deleteMeal(id: number) {
        return defer(() =>
            from(this.supabaseService.getClient().from('meal').delete().eq('id', id)).pipe(map((_) => id))
        );
    }
}
