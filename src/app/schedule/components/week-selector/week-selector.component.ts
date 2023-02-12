import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { Week } from '../../models/schedule.model';
import { getCurrentWeek } from "../../utils/week-utils";

@Component({
    selector: 'fc-week-selector',
    templateUrl: './week-selector.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WeekSelectorComponent {
    @Input() week: Week = getCurrentWeek();
    @Output() switchToNextWeek = new EventEmitter();
    @Output() switchToPreviousWeek = new EventEmitter();
}
