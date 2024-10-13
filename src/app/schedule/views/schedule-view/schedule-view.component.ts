import { Component, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { MealsPerDay, Week } from '../../models/schedule.model';
import { EnsureInitializeSchedule, SwitchToNextWeek, SwitchToPreviousWeek } from '../../state/schedule.actions';
import { WeekSelectorComponent } from '../../components/week-selector/week-selector.component';
import { WeekContainerComponent } from '../../components/week-container/week-container.component';
import { AsyncPipe } from '@angular/common';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { ScheduleState } from '../../state/schedule.state';

@Component({
    selector: 'fc-schedule-view',
    templateUrl: './schedule-view.component.html',
    standalone: true,
    imports: [NzModalModule, WeekSelectorComponent, WeekContainerComponent, AsyncPipe],
})
export class ScheduleViewComponent implements OnInit {
    week$: Observable<Week> = this.store.select(ScheduleState.week);
    mealsOfWeek$: Observable<MealsPerDay[]> = this.store.select(ScheduleState.mealsOfWeek);
    loading$: Observable<boolean> = this.store.select(ScheduleState.loading);

    constructor(private store: Store) {}

    ngOnInit() {
        this.store.dispatch(new EnsureInitializeSchedule());
    }

    onSwitchToNextWeek() {
        this.store.dispatch(new SwitchToNextWeek());
    }

    onSwitchToPreviousWeek() {
        this.store.dispatch(new SwitchToPreviousWeek());
    }
}
