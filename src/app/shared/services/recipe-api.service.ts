import { Injectable, inject } from '@angular/core';
import { map } from 'rxjs/operators';
import { defer, from, Observable } from 'rxjs';
import { SupabaseService } from './supabase.service';
import { Recipe } from '../../model';
import { toDateFromApi } from '../utils/date-utils';

@Injectable({ providedIn: 'root' })
export class RecipeApiService {
    private supabaseService = inject(SupabaseService);

    getAllRecipes(): Observable<Recipe[]> {
        return defer(() =>
            from(this.supabaseService.getClient().from('recipe_with_last_preparation').select('*')).pipe(
                map((result) => {
                    if (result.error) {
                        throw result.error;
                    }

                    return result.data.map(
                        (r) =>
                            <Recipe>{
                                id: r.id,
                                name: r.name,
                                note: r.note,
                                url: r.url,
                                tags: r.tags,
                                last_preparation: r.last_preparation ? toDateFromApi(r.last_preparation) : null,
                            }
                    );
                })
            )
        );
    }

    createRecipe(recipe: Recipe): Observable<Recipe> {
        return defer(() =>
            from(
                this.supabaseService
                    .getClient()
                    .from('recipe')
                    .insert({
                        name: recipe.name,
                        url: recipe.url,
                        tags: recipe.tags,
                        note: recipe.note,
                    })
                    .select()
                    .single()
            ).pipe(
                map((result) => {
                    if (result.error) {
                        throw result.error;
                    }

                    return <Recipe>{
                        id: result.data.id,
                        name: result.data.name,
                        note: result.data.note,
                        url: result.data.url,
                        tags: result.data.tags,
                        deleted: result.data.deleted,
                    };
                })
            )
        );
    }

    updateRecipe(recipe: Recipe): Observable<void> {
        return defer(() =>
            from(
                this.supabaseService
                    .getClient()
                    .from('recipe')
                    .update({
                        name: recipe.name,
                        note: recipe.note,
                        url: recipe.url,
                        tags: recipe.tags,
                        deleted: recipe.deleted,
                    })
                    .eq('id', recipe.id)
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
