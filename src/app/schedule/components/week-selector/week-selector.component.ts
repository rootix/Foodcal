import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { Week } from '../../models/schedule.model';
import { getCurrentWeek } from '../../utils/week-utils';
import { NzButtonComponent } from 'ng-zorro-antd/button';
import { NzIconDirective } from 'ng-zorro-antd/icon';
import { DatePipe } from '@angular/common';

@Component({
    selector: 'fc-week-selector',
    templateUrl: './week-selector.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [NzButtonComponent, NzIconDirective, DatePipe],
})
export class WeekSelectorComponent {
    @Input() week: Week = getCurrentWeek();
    @Output() switchToNextWeek = new EventEmitter();
    @Output() switchToPreviousWeek = new EventEmitter();
}
