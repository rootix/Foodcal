import { Routes } from '@angular/router';
import { ScheduleViewComponent } from './views/schedule-view/schedule-view.component';
import { provideStates } from '@ngxs/store';
import { ScheduleState } from './state/schedule.state';

export const routes: Routes = [
    { path: ':year/:week', component: ScheduleViewComponent, providers: [provideStates([ScheduleState])] },
    { path: '', component: ScheduleViewComponent, providers: [provideStates([ScheduleState])] },
];
