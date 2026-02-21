import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { Observable, filter, map, take } from 'rxjs';
import { MealsPerDay, Week } from '../../models/schedule.model';
import { NavigateToWeek } from '../../state/schedule.actions';
import { WeekSelectorComponent } from '../../components/week-selector/week-selector.component';
import { WeekContainerComponent } from '../../components/week-container/week-container.component';
import { AsyncPipe, DOCUMENT } from '@angular/common';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzButtonComponent } from 'ng-zorro-antd/button';
import { NzIconDirective } from 'ng-zorro-antd/icon';
import { NzTooltipDirective } from 'ng-zorro-antd/tooltip';
import { NzFloatButtonComponent } from 'ng-zorro-antd/float-button';
import { ScheduleState } from '../../state/schedule.state';
import { getCalendarWeek, getCurrentWeek, getWeekByYearAndWeek } from '../../utils/week-utils';

@Component({
    selector: 'fc-schedule-view',
    templateUrl: './schedule-view.component.html',
    styleUrl: './schedule-view.component.scss',
    imports: [
        NzModalModule,
        WeekSelectorComponent,
        WeekContainerComponent,
        AsyncPipe,
        NzButtonComponent,
        NzIconDirective,
        NzTooltipDirective,
        NzFloatButtonComponent,
    ],
})
export class ScheduleViewComponent implements OnInit {
    private store = inject(Store);
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private destroyRef = inject(DestroyRef);
    private document = inject(DOCUMENT);

    week$: Observable<Week> = this.store.select(ScheduleState.week);
    mealsOfWeek$: Observable<MealsPerDay[]> = this.store.select(ScheduleState.mealsOfWeek);
    loading$: Observable<boolean> = this.store.select(ScheduleState.loading);

    showTodayButton = signal(false);
    private intersectionObserver: IntersectionObserver | null = null;
    private observerSetupId = 0;

    ngOnInit() {
        this.week$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((week) => {
            this.intersectionObserver?.disconnect();
            this.intersectionObserver = null;
            const setupId = ++this.observerSetupId;

            if (!week.isCurrentWeek) {
                this.showTodayButton.set(true);
                return;
            }

            requestAnimationFrame(() => {
                if (this.observerSetupId !== setupId) return;
                const todayEl = this.document.querySelector('.day-information.current');
                if (!todayEl) return;
                this.intersectionObserver = new IntersectionObserver(([entry]) =>
                    this.showTodayButton.set(!entry.isIntersecting)
                );
                this.intersectionObserver.observe(todayEl);
            });
        });

        this.destroyRef.onDestroy(() => this.intersectionObserver?.disconnect());

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

    onReload() {
        const week = this.store.selectSnapshot(ScheduleState.week);
        this.store.dispatch(new NavigateToWeek(week.year, week.calendarWeek));
    }

    onSwitchToWeek(date: Date) {
        const week = getWeekByYearAndWeek(date.getFullYear(), getCalendarWeek(date));
        this.router.navigate(['/schedule', week.year, week.calendarWeek]);
    }

    onGoToToday() {
        const week = this.store.selectSnapshot(ScheduleState.week);
        if (!week.isCurrentWeek) {
            const currentWeek = getCurrentWeek();
            void this.router.navigate(['/schedule', currentWeek.year, currentWeek.calendarWeek]);
            this.week$
                .pipe(
                    filter((w) => w.isCurrentWeek),
                    take(1)
                )
                .subscribe(() => requestAnimationFrame(() => this.scrollToToday()));
        } else {
            this.scrollToToday();
        }
    }

    private scrollToToday() {
        const todayEl = this.document.querySelector('.day-information.current');
        todayEl?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}
