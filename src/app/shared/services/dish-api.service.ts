import { Injectable, inject } from '@angular/core';
import { map } from 'rxjs/operators';
import { defer, from, Observable } from 'rxjs';
import { SupabaseService } from './supabase.service';
import { Dish, DishFormValue } from '../../model';
import { toDateFromApi } from '../utils/date-utils';

@Injectable({ providedIn: 'root' })
export class DishApiService {
    private supabaseService = inject(SupabaseService);

    getAllDishes(): Observable<Dish[]> {
        return defer(() =>
            from(this.supabaseService.getClient().from('dish_with_last_preparation').select('*')).pipe(
                map((result) => {
                    if (result.error) {
                        throw result.error;
                    }

                    return result.data.map(
                        (d) =>
                            <Dish>{
                                id: d.id,
                                name: d.name,
                                url: d.url,
                                deleted: d.deleted,
                                last_preparation: d.last_preparation ? toDateFromApi(d.last_preparation) : null,
                            }
                    );
                })
            )
        );
    }

    createDish(dish: DishFormValue): Observable<Dish> {
        return defer(() =>
            from(
                this.supabaseService
                    .getClient()
                    .from('dish')
                    .insert({
                        name: dish.name,
                        url: dish.url,
                    })
                    .select()
                    .single()
            ).pipe(
                map((result) => {
                    if (result.error) {
                        throw result.error;
                    }

                    return <Dish>{
                        id: result.data.id,
                        name: result.data.name,
                        url: result.data.url,
                        deleted: result.data.deleted,
                    };
                })
            )
        );
    }

    updateDish(dish: DishFormValue & { id: number; deleted?: boolean }): Observable<void> {
        return defer(() =>
            from(
                this.supabaseService
                    .getClient()
                    .from('dish')
                    .update({
                        name: dish.name,
                        url: dish.url,
                        deleted: dish.deleted,
                    })
                    .eq('id', dish.id)
            ).pipe(
                map((result) => {
                    if (result.error) {
                        throw result.error;
                    }
                })
            )
        );
    }
}
