import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { Observable, map } from 'rxjs';
import { MealsPerDay, Week } from '../../models/schedule.model';
import { NavigateToWeek } from '../../state/schedule.actions';
import { WeekSelectorComponent } from '../../components/week-selector/week-selector.component';
import { WeekContainerComponent } from '../../components/week-container/week-container.component';
import { AsyncPipe } from '@angular/common';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { ScheduleState } from '../../state/schedule.state';
import { getCurrentWeek, getWeekByYearAndWeek } from '../../utils/week-utils';

@Component({
    selector: 'fc-schedule-view',
    templateUrl: './schedule-view.component.html',
    imports: [NzModalModule, WeekSelectorComponent, WeekContainerComponent, AsyncPipe],
})
export class ScheduleViewComponent implements OnInit {
    private store = inject(Store);
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private destroyRef = inject(DestroyRef);

    week$: Observable<Week> = this.store.select(ScheduleState.week);
    mealsOfWeek$: Observable<MealsPerDay[]> = this.store.select(ScheduleState.mealsOfWeek);
    loading$: Observable<boolean> = this.store.select(ScheduleState.loading);

    ngOnInit() {
        this.route.params
            .pipe(
                takeUntilDestroyed(this.destroyRef),
                map((params) => ({
                    year: params['year'] ? parseInt(params['year'], 10) : null,
                    week: params['week'] ? parseInt(params['week'], 10) : null,
                }))
            )
            .subscribe(({ year, week }) => {
                if (year && week) {
                    this.store.dispatch(new NavigateToWeek(year, week));
                } else {
                    const currentWeek = getCurrentWeek();
                    this.router.navigate(['/schedule', currentWeek.year, currentWeek.calendarWeek], {
                        replaceUrl: true,
                    });
                }
            });
    }

    onSwitchToNextWeek() {
        const week = this.store.selectSnapshot(ScheduleState.week);
        const nextWeek = getWeekByYearAndWeek(week.year, week.calendarWeek + 1);
        this.router.navigate(['/schedule', nextWeek.year, nextWeek.calendarWeek]);
    }

    onSwitchToPreviousWeek() {
        const week = this.store.selectSnapshot(ScheduleState.week);
        const previousWeek = getWeekByYearAndWeek(week.year, week.calendarWeek - 1);
        this.router.navigate(['/schedule', previousWeek.year, previousWeek.calendarWeek]);
    }
}
