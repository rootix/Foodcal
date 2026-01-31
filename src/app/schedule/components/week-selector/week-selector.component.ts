import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Week } from '../../models/schedule.model';
import { getCurrentWeek } from '../../utils/week-utils';
import { NzButtonComponent } from 'ng-zorro-antd/button';
import { NzIconDirective } from 'ng-zorro-antd/icon';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { DatePipe } from '@angular/common';

@Component({
    selector: 'fc-week-selector',
    templateUrl: './week-selector.component.html',
    styleUrl: './week-selector.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [NzButtonComponent, NzIconDirective, NzDatePickerModule, FormsModule, DatePipe],
})
export class WeekSelectorComponent {
    @Input() week: Week = getCurrentWeek();
    @Output() switchToNextWeek = new EventEmitter();
    @Output() switchToPreviousWeek = new EventEmitter();
    @Output() switchToWeek = new EventEmitter<Date>();

    pickerOpen = false;

    onWeekChange(date: Date) {
        if (date) {
            this.switchToWeek.emit(date);
        }
        this.pickerOpen = false;
    }

    onPickerOpenChange(open: boolean) {
        this.pickerOpen = open;
    }
}
