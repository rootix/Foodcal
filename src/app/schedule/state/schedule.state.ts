import { Injectable, inject } from '@angular/core';
import { Action, NgxsOnInit, Selector, State, StateContext } from '@ngxs/store';
import { append, patch, removeItem, updateItem } from '@ngxs/store/operators';
import { eachDayOfInterval } from 'date-fns';
import { mergeMap, switchMap, tap } from 'rxjs/operators';
import { ScheduleApiService } from '../services/schedule-api.service';
import {
    CreateMeal,
    DeleteMeal,
    EnsureInitializeSchedule,
    LoadMealsOfWeek,
    NavigateToWeek,
    UpdateMeal,
    WeekLoaded,
    WeekLoading,
} from './schedule.actions';
import { getCurrentWeek, getWeekByYearAndWeek } from '../utils/week-utils';
import { MealsPerDay, Week } from '../models/schedule.model';
import { Meal, MealType } from '../../model';

interface ScheduleStateModel {
    loading: boolean;
    week: Week;
    mealsOfWeek: Meal[];
}

@State<ScheduleStateModel>({
    name: 'schedule',
    defaults: {
        loading: false,
        week: getCurrentWeek(),
        mealsOfWeek: [],
    },
})
@Injectable()
export class ScheduleState implements NgxsOnInit {
    private scheduleApiService = inject(ScheduleApiService);

    @Selector()
    static week(state: ScheduleStateModel) {
        return state.week;
    }

    @Selector()
    static mealsOfWeek(state: ScheduleStateModel) {
        return this.buildCompleteMealsOfWeek(state.week.startDate, state.week.endDate, state.mealsOfWeek);
    }

    @Selector()
    static loading(state: ScheduleStateModel) {
        return state.loading;
    }

    private static buildCompleteMealsOfWeek(startDate: Date, endDate: Date, existingMeals: Meal[]) {
        const mealsPerDay: MealsPerDay[] = [];
        const interval = eachDayOfInterval({ start: startDate, end: endDate });
        interval.forEach((date: Date) => {
            const lunch =
                existingMeals.find((m) => m.date.getTime() === date.getTime() && m.type === MealType.Lunch) ||
                ({
                    date,
                    type: MealType.Lunch,
                } as Meal);

            const dinner =
                existingMeals.find((m) => m.date.getTime() === date.getTime() && m.type === MealType.Dinner) ||
                ({
                    date,
                    type: MealType.Dinner,
                } as Meal);

            const day: MealsPerDay = {
                date,
                meals: [lunch, dinner],
            };

            mealsPerDay.push(day);
        });

        return mealsPerDay;
    }

    ngxsOnInit(ctx: StateContext<ScheduleStateModel>) {
        const currentWeek = getCurrentWeek();
        ctx.patchState({ week: currentWeek });
    }

    @Action(CreateMeal)
    private createMeal(ctx: StateContext<ScheduleStateModel>, { meal }: CreateMeal) {
        return this.scheduleApiService
            .createMeal(meal)
            .pipe(tap((m) => ctx.setState(patch({ mealsOfWeek: append([m]) }))));
    }

    @Action(UpdateMeal)
    private updateMeal(ctx: StateContext<ScheduleStateModel>, { meal }: UpdateMeal) {
        return this.scheduleApiService.updateMeal(meal).pipe(
            tap((_) =>
                ctx.setState(
                    patch({
                        mealsOfWeek: updateItem<Meal>((m) => m.id === meal.id, patch({ ...meal })),
                    })
                )
            )
        );
    }

    @Action(DeleteMeal)
    private deleteMeal(ctx: StateContext<ScheduleStateModel>, { id }: DeleteMeal) {
        return this.scheduleApiService
            .deleteMeal(id)
            .pipe(
                tap((deletedId) => ctx.setState(patch({ mealsOfWeek: removeItem<Meal>((m) => m?.id === deletedId) })))
            );
    }

    @Action(EnsureInitializeSchedule)
    private ensureInitializeSchedule(ctx: StateContext<ScheduleStateModel>) {
        const currentState = ctx.getState();
        if (currentState.mealsOfWeek.length > 0) {
            return;
        }

        return ctx.dispatch(new LoadMealsOfWeek(currentState.week.startDate, currentState.week.endDate));
    }

    @Action(NavigateToWeek)
    private navigateToWeek(ctx: StateContext<ScheduleStateModel>, { year, week }: NavigateToWeek) {
        const targetWeek = getWeekByYearAndWeek(year, week);
        ctx.patchState({ week: targetWeek });
        return ctx.dispatch(new LoadMealsOfWeek(targetWeek.startDate, targetWeek.endDate));
    }

    @Action(LoadMealsOfWeek)
    private loadMealsOfWeek(ctx: StateContext<ScheduleStateModel>, payload: LoadMealsOfWeek) {
        return ctx.dispatch(new WeekLoading()).pipe(
            switchMap((_) => this.scheduleApiService.getMealsOfWeek(payload.startDate, payload.endDate)),
            tap((meals) => ctx.patchState({ mealsOfWeek: meals })),
            mergeMap((_) => ctx.dispatch(new WeekLoaded()))
        );
    }

    @Action(WeekLoading)
    private weekLoading(ctx: StateContext<ScheduleStateModel>) {
        ctx.patchState({ loading: true });
    }

    @Action(WeekLoaded)
    private weekLoaded(ctx: StateContext<ScheduleStateModel>) {
        ctx.patchState({ loading: false });
    }
}
