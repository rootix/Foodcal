import { Component, Input } from '@angular/core';
import { isToday } from 'date-fns';
import { DatePipe } from '@angular/common';
import { DayNamePipe } from '../../../shared/pipes/day-name.pipe';

@Component({
    selector: 'fc-day-container',
    templateUrl: './day-container.component.html',
    styleUrls: ['./day-container.component.scss'],
    imports: [DatePipe, DayNamePipe],
})
export class DayContainerComponent {
    @Input() date: Date = new Date();

    get isToday() {
        return this.date && isToday(this.date);
    }
}
