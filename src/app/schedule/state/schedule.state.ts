import { Injectable } from '@angular/core';
import { Action, NgxsOnInit, Selector, State, StateContext } from '@ngxs/store';
import { append, patch, removeItem, updateItem } from '@ngxs/store/operators';
import { addDays, eachDayOfInterval } from 'date-fns';
import { mergeMap, switchMap, tap } from 'rxjs/operators';
import { ScheduleApiService } from '../services/schedule-api.service';
import {
    CreateMeal,
    DeleteMeal,
    EnsureInitializeSchedule,
    LoadMealsOfWeek,
    SwitchToNextWeek,
    SwitchToPreviousWeek,
    UpdateMeal,
    WeekLoaded,
    WeekLoading,
} from './schedule.actions';
import { getCurrentWeek, getWeekForDate } from '../utils/week-utils';
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

    constructor(private scheduleApiService: ScheduleApiService) {}

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
            tap((timestamp) =>
                ctx.setState(
                    patch({
                        mealsOfWeek: updateItem<Meal>((m) => m.id === meal.id, patch(Object.assign({}, meal))),
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

    @Action(SwitchToNextWeek)
    private switchToNextWeek(ctx: StateContext<ScheduleStateModel>) {
        const currentStartDate = ctx.getState().week.startDate;
        const nextWeekStartDate = addDays(currentStartDate, 7);
        const nextWeek = getWeekForDate(nextWeekStartDate);
        ctx.patchState({ week: nextWeek });
        return ctx.dispatch(new LoadMealsOfWeek(nextWeek.startDate, nextWeek.endDate));
    }

    @Action(SwitchToPreviousWeek)
    private switchToPreviousWeek(ctx: StateContext<ScheduleStateModel>) {
        const currentStartDate = ctx.getState().week.startDate;
        const previousWeekStartDate = addDays(currentStartDate, -7);
        const previousWeek = getWeekForDate(previousWeekStartDate);
        ctx.patchState({ week: previousWeek });
        return ctx.dispatch(new LoadMealsOfWeek(previousWeek.startDate, previousWeek.endDate));
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
