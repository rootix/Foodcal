import { FormStyle, getLocaleDayNames, TranslationWidth } from '@angular/common';
import { LOCALE_ID, Pipe, PipeTransform, inject } from '@angular/core';

@Pipe({
    name: 'dayName',
    standalone: true,
})
export class DayNamePipe implements PipeTransform {
    private locale = inject(LOCALE_ID);

    transform(value: Date) {
        return getLocaleDayNames(this.locale, FormStyle.Standalone, TranslationWidth.Wide)[value.getDay()];
    }
}
