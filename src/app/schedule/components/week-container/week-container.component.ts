import { Component, HostBinding, Input, ViewChild } from '@angular/core';
import { Store } from '@ngxs/store';
import { NzModalService } from 'ng-zorro-antd/modal';
import { CreateMeal, DeleteMeal, UpdateMeal } from '../../state/schedule.actions';
import { MealDialogComponent } from '../meal-dialog/meal-dialog.component';
import { MealsPerDay } from '../../models/schedule.model';
import { Meal } from '../../../model';
import { NgIf, NgFor } from '@angular/common';
import { NzSpinComponent } from 'ng-zorro-antd/spin';
import { DayContainerComponent } from '../day-container/day-container.component';
import { MealCardComponent } from '../meal-card/meal-card.component';

@Component({
    selector: 'fc-week-container',
    templateUrl: './week-container.component.html',
    styleUrls: ['./week-container.component.scss'],
    imports: [NgIf, NzSpinComponent, NgFor, DayContainerComponent, MealCardComponent, MealDialogComponent],
})
export class WeekContainerComponent {
    @Input() mealsOfWeek: MealsPerDay[] = [];
    @ViewChild(MealDialogComponent) dialog?: MealDialogComponent;
    @HostBinding('class.loading') @Input() loading = false;

    constructor(
        private store: Store,
        private modalService: NzModalService
    ) {}

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

        this.dialog.open(meal, (m) => this.store.dispatch(new UpdateMeal(m)));
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
