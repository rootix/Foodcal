import { Component, HostBinding, Input, ViewChild, inject } from '@angular/core';
import { addDays } from 'date-fns';
import { Store } from '@ngxs/store';
import { NzModalService } from 'ng-zorro-antd/modal';
import { CopyMeal, CreateMeal, DeleteMeal, MoveMeal, UpdateMeal } from '../../state/schedule.actions';
import { MealDialogComponent } from '../meal-dialog/meal-dialog.component';
import { MoveMealDialogComponent } from '../move-meal-dialog/move-meal-dialog.component';
import { MealsPerDay } from '../../models/schedule.model';
import { Meal, MealFormValue, MealType } from '../../../model';

import { NzSpinComponent } from 'ng-zorro-antd/spin';
import { DayContainerComponent } from '../day-container/day-container.component';
import { MealCardComponent } from '../meal-card/meal-card.component';

@Component({
    selector: 'fc-week-container',
    templateUrl: './week-container.component.html',
    styleUrls: ['./week-container.component.scss'],
    imports: [NzSpinComponent, DayContainerComponent, MealCardComponent, MealDialogComponent, MoveMealDialogComponent],
})
export class WeekContainerComponent {
    private store = inject(Store);
    private modalService = inject(NzModalService);

    @Input() mealsOfWeek: MealsPerDay[] = [];
    @ViewChild(MealDialogComponent) dialog?: MealDialogComponent;
    @ViewChild(MoveMealDialogComponent) moveDialog?: MoveMealDialogComponent;
    @HostBinding('class.loading') @Input() loading = false;

    onCreateMeal(meal: Meal) {
        if (!this.dialog) {
            throw Error('no dialog present');
        }

        this.dialog.open(meal, (m) => this.store.dispatch(new CreateMeal(m)));
    }

    onEditMeal(meal: Meal) {
        if (!this.dialog) {
            throw Error('no dialog present');
        }

        this.dialog.open(meal, (m) => this.store.dispatch(new UpdateMeal(m as MealFormValue & { id: number })));
    }

    onCopyMeal(meal: Meal) {
        this.moveDialog!.open(
            addDays(meal.date, 1),
            MealType.Lunch,
            ({ targetDate, targetType }) =>
                this.store.dispatch(
                    new CopyMeal({
                        id: null,
                        date: targetDate,
                        type: targetType,
                        dishes: meal.dishes,
                        notes: meal.notes,
                    })
                ),
            'Menü kopieren',
            'Kopieren'
        );
    }

    onMoveMeal(meal: Meal) {
        this.moveDialog!.open(meal.date, meal.type, ({ targetDate, targetType }) =>
            this.store.dispatch(new MoveMeal(meal.id, targetDate, targetType))
        );
    }

    onDeleteMeal(meal: Meal) {
        if (!meal.id) {
            return;
        }

        this.modalService.confirm({
            nzTitle: 'Bestätigen',
            nzContent: 'Soll das Menu wirklich gelöscht werden?',
            nzOkText: 'Löschen',
            nzOnOk: () => this.store.dispatch(new DeleteMeal(meal.id)),
            nzCancelText: 'Abbrechen',
            nzOkDanger: true,
        });
    }
}
