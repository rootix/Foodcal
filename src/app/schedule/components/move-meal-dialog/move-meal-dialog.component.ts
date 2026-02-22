import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EMPTY, Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { MealType } from '../../../model';
import { NzModalComponent } from 'ng-zorro-antd/modal';
import { NzFormControlComponent, NzFormDirective, NzFormItemComponent, NzFormLabelComponent } from 'ng-zorro-antd/form';
import { NzColDirective, NzRowDirective } from 'ng-zorro-antd/grid';
import { NzDatePickerComponent } from 'ng-zorro-antd/date-picker';
import { NzOptionComponent, NzSelectComponent } from 'ng-zorro-antd/select';
import { NzButtonComponent } from 'ng-zorro-antd/button';
import { NzWaveDirective } from 'ng-zorro-antd/core/wave';

@Component({
    selector: 'fc-move-meal-dialog',
    templateUrl: './move-meal-dialog.component.html',
    imports: [
        NzModalComponent,
        ReactiveFormsModule,
        NzFormDirective,
        NzRowDirective,
        NzFormItemComponent,
        NzColDirective,
        NzFormLabelComponent,
        NzFormControlComponent,
        NzDatePickerComponent,
        NzSelectComponent,
        NzOptionComponent,
        NzButtonComponent,
        NzWaveDirective,
    ],
})
export class MoveMealDialogComponent {
    isOpen = false;
    loading = false;
    title = '';
    submitLabel = '';
    MealType = MealType;

    readonly form = new FormGroup({
        targetDate: new FormControl<Date | null>(null, [Validators.required]),
        targetType: new FormControl<MealType | null>(null, [Validators.required]),
    });

    private submitHandler: (v: { targetDate: Date; targetType: MealType }) => Observable<void> = () => EMPTY;

    open(
        initialDate: Date,
        initialType: MealType,
        submitHandler: typeof this.submitHandler,
        title = 'Menü verschieben',
        submitLabel = 'Verschieben'
    ): void {
        this.form.reset();
        this.form.patchValue({ targetDate: initialDate, targetType: initialType });
        this.submitHandler = submitHandler;
        this.title = title;
        this.submitLabel = submitLabel;
        this.isOpen = true;
    }

    onSubmit(): void {
        this.form.markAllAsTouched();
        if (this.form.invalid) return;
        this.loading = true;
        this.submitHandler(this.form.getRawValue() as { targetDate: Date; targetType: MealType })
            .pipe(finalize(() => (this.loading = false)))
            .subscribe(() => {
                this.isOpen = false;
            });
    }
}
