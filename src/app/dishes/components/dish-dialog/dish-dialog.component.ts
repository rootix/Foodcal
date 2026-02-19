import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EMPTY, Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { Dish, DishFormValue } from '../../../model';
import { NzModalComponent } from 'ng-zorro-antd/modal';
import { NzFormControlComponent, NzFormDirective, NzFormItemComponent, NzFormLabelComponent } from 'ng-zorro-antd/form';
import { NzColDirective, NzRowDirective } from 'ng-zorro-antd/grid';
import { NzInputDirective } from 'ng-zorro-antd/input';
import { NzButtonComponent } from 'ng-zorro-antd/button';
import { NzWaveDirective } from 'ng-zorro-antd/core/wave';

@Component({
    selector: 'fc-dish-dialog',
    templateUrl: './dish-dialog.component.html',
    imports: [
        NzModalComponent,
        ReactiveFormsModule,
        NzFormDirective,
        NzRowDirective,
        NzFormItemComponent,
        NzColDirective,
        NzFormLabelComponent,
        NzFormControlComponent,
        NzInputDirective,
        NzButtonComponent,
        NzWaveDirective,
    ],
})
export class DishDialogComponent {
    isOpen = false;
    isNew = false;

    readonly form = new FormGroup({
        id: new FormControl<number | null>(null),
        name: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
        url: new FormControl<string | null>(null),
    });

    loading = false;

    private submitHandler: (dish: DishFormValue) => Observable<void> = (_) => EMPTY;

    open(dish: Partial<Dish>, submitHandler: (dish: DishFormValue) => Observable<void>) {
        this.form.reset();
        this.isNew = !dish.id;
        this.submitHandler = submitHandler;
        this.form.patchValue({
            id: dish.id ?? null,
            name: dish.name ?? '',
            url: dish.url ?? null,
        });
        this.isOpen = true;
    }

    onSubmit() {
        this.form.markAllAsTouched();

        if (this.form.invalid) {
            return;
        }

        this.loading = true;
        this.submitHandler(this.form.getRawValue())
            .pipe(finalize(() => (this.loading = false)))
            .subscribe((_) => {
                this.isOpen = false;
            });
    }
}
