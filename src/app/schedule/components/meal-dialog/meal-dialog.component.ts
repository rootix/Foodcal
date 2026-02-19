import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngxs/store';
import { EMPTY, Observable, firstValueFrom } from 'rxjs';
import { map, finalize } from 'rxjs/operators';
import { CreateDish, DishState, EnsureLoadAllDishes } from 'src/app/shared/state/dish';
import { Dish, Meal, MealFormValue, MealType } from '../../../model';
import { NzModalComponent } from 'ng-zorro-antd/modal';
import { NzFormControlComponent, NzFormDirective, NzFormItemComponent, NzFormLabelComponent } from 'ng-zorro-antd/form';
import { NzColDirective, NzRowDirective } from 'ng-zorro-antd/grid';
import { NzOptionComponent, NzSelectComponent } from 'ng-zorro-antd/select';
import { AsyncPipe } from '@angular/common';
import { NzSpinComponent } from 'ng-zorro-antd/spin';
import { NzInputDirective } from 'ng-zorro-antd/input';
import { NzButtonComponent } from 'ng-zorro-antd/button';
import { NzWaveDirective } from 'ng-zorro-antd/core/wave';

@Component({
    selector: 'fc-meal-dialog',
    templateUrl: './meal-dialog.component.html',
    imports: [
        NzModalComponent,
        ReactiveFormsModule,
        NzFormDirective,
        NzRowDirective,
        NzFormItemComponent,
        NzColDirective,
        NzFormLabelComponent,
        NzFormControlComponent,
        NzSelectComponent,
        NzOptionComponent,
        NzSpinComponent,
        NzInputDirective,
        NzButtonComponent,
        NzWaveDirective,
        AsyncPipe,
    ],
})
export class MealDialogComponent implements OnInit {
    private store = inject(Store);

    allDishes$: Observable<Dish[]> = this.store
        .select(DishState.getAllDishes)
        .pipe(map((dishes) => [...dishes].sort((a, b) => a.name.localeCompare(b.name))));
    allDishesLoading$: Observable<boolean> = this.store.select(DishState.loading);

    isOpen = false;
    isNew = false;

    readonly form = new FormGroup({
        id: new FormControl<number | null>(null),
        date: new FormControl<Date | null>(null, { validators: [Validators.required] }),
        type: new FormControl<MealType | null>(null, { validators: [Validators.required] }),
        dishes: new FormControl<string[]>([], { nonNullable: true }),
        notes: new FormControl<string | null>(null),
    });

    submitLoading = false;

    private submitHandler: (meal: MealFormValue) => Observable<void> = (_) => EMPTY;

    ngOnInit() {
        this.store.dispatch(new EnsureLoadAllDishes());
    }

    open(meal: Partial<Meal>, submitHandler: (meal: MealFormValue) => Observable<void>) {
        this.form.reset();
        this.isNew = !meal.id;
        this.submitHandler = submitHandler;
        this.form.patchValue({
            id: meal.id ?? null,
            date: meal.date ?? null,
            type: meal.type ?? null,
            dishes: meal.dishes ? meal.dishes.map((d) => d.name) : [],
            notes: meal.notes ?? null,
        });
        this.isOpen = true;
    }

    async onSubmit() {
        this.form.markAllAsTouched();

        if (this.form.invalid) {
            return;
        }

        const dishNames: string[] = this.form.value.dishes ?? [];
        const allDishes = this.store.selectSnapshot(DishState.getAllDishes);

        const resolvedDishes: Dish[] = [];
        for (const name of dishNames) {
            const existing = allDishes.find((d) => d.name === name);
            if (existing) {
                resolvedDishes.push(existing);
            } else {
                const newDish = await firstValueFrom(
                    this.store
                        .dispatch(new CreateDish({ id: null, name, url: null }))
                        .pipe(
                            map(() => this.store.selectSnapshot(DishState.getAllDishes).find((d) => d.name === name)!)
                        )
                );
                resolvedDishes.push(newDish);
            }
        }

        const mealValue = {
            ...this.form.getRawValue(),
            dishes: resolvedDishes,
        } as MealFormValue;

        this.submitLoading = true;
        this.submitHandler(mealValue)
            .pipe(finalize(() => (this.submitLoading = false)))
            .subscribe((_) => {
                this.isOpen = false;
            });
    }

}
