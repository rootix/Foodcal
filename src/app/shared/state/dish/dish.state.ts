import { Injectable, inject } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { append, patch, removeItem, updateItem } from '@ngxs/store/operators';
import { tap } from 'rxjs/operators';
import { DishApiService } from '../../services/dish-api.service';
import {
    CreateDish,
    DeleteDish,
    DishLoaded as DishesLoaded,
    DishLoading as DishesLoading,
    EnsureLoadAllDishes,
    LoadAllDishes,
    UpdateDish,
} from './dish.actions';
import { Dish } from '../../../model';

interface DishStateModel {
    loaded: boolean;
    loading: boolean;
    dishes: Dish[];
}

@State<DishStateModel>({
    name: 'dishes',
    defaults: {
        loaded: false,
        loading: false,
        dishes: [],
    },
})
@Injectable()
export class DishState {
    private dishService = inject(DishApiService);

    @Selector()
    static getAllDishes(state: DishStateModel) {
        return state.dishes;
    }

    @Selector()
    static loading({ loading }: DishStateModel) {
        return loading;
    }

    @Action(CreateDish)
    private createDish(context: StateContext<DishStateModel>, { dish }: CreateDish) {
        return this.dishService.createDish(dish).pipe(
            tap((newDish) => {
                context.setState(patch({ dishes: append([Object.assign(newDish, { last_preparation: null })]) }));
            })
        );
    }

    @Action(UpdateDish)
    private updateDish(context: StateContext<DishStateModel>, { dish }: UpdateDish) {
        return this.dishService.updateDish(dish).pipe(
            tap((_) =>
                context.setState(
                    patch({
                        dishes: updateItem<Dish>((d) => d.id === dish.id, patch({ ...dish })),
                    })
                )
            )
        );
    }

    @Action(DeleteDish)
    private deleteDish(context: StateContext<DishStateModel>, { dish }: DeleteDish) {
        return this.dishService
            .updateDish(Object.assign({}, dish, { deleted: true }))
            .pipe(tap((_) => context.setState(patch({ dishes: removeItem<Dish>((d) => d.id === dish.id) }))));
    }

    @Action(LoadAllDishes)
    private loadAllDishes(context: StateContext<DishStateModel>) {
        return this.dishService.getAllDishes().pipe(
            tap((dishes) => context.patchState({ loaded: true, dishes })),
            tap((_) => context.dispatch(new DishesLoaded()))
        );
    }

    @Action(EnsureLoadAllDishes)
    private ensureLoadAllDishes(context: StateContext<DishStateModel>) {
        const state = context.getState();
        if (state.loaded) {
            return context.dispatch(new DishesLoaded());
        }

        return this.dishService.getAllDishes().pipe(
            tap((dishes) => context.patchState({ loaded: true, dishes })),
            tap((_) => context.dispatch(new DishesLoaded()))
        );
    }

    @Action(DishesLoading)
    private dishesLoading(context: StateContext<DishStateModel>) {
        context.patchState({ loading: true });
    }

    @Action(DishesLoaded)
    private dishesLoaded(context: StateContext<DishStateModel>) {
        context.patchState({ loading: false });
    }
}
