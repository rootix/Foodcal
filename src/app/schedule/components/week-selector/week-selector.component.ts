import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { Week } from '../../models/schedule.model';
import { getCurrentWeek } from '../../utils/week-utils';
import { NzIconDirective } from 'ng-zorro-antd/icon';
import { NzButtonComponent } from 'ng-zorro-antd/button';
import { NzDatePickerComponent, NzDatePickerModule } from 'ng-zorro-antd/date-picker';

@Component({
    selector: 'fc-week-selector',
    templateUrl: './week-selector.component.html',
    styleUrl: './week-selector.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [NzButtonComponent, NzDatePickerModule, FormsModule, DatePipe, NzIconDirective],
})
export class WeekSelectorComponent {
    @Input() week: Week = getCurrentWeek();
    @Output() switchToNextWeek = new EventEmitter();
    @Output() switchToPreviousWeek = new EventEmitter();
    @Output() switchToWeek = new EventEmitter<Date>();

    @ViewChild('weekPicker') picker!: NzDatePickerComponent;

    openPicker() {
        this.picker.open();
        this.picker.focus();
    }

    onWeekChange(date: Date) {
        if (date) {
            this.switchToWeek.emit(date);
        }
    }
}
