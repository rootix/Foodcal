import { Component, OnInit, OnDestroy, inject } from '@angular/core';
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
import { NzIconDirective } from 'ng-zorro-antd/icon';

@Component({
    selector: 'fc-meal-dialog',
    templateUrl: './meal-dialog.component.html',
    styleUrl: './meal-dialog.component.scss',
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
        NzIconDirective,
        AsyncPipe,
    ],
})
export class MealDialogComponent implements OnInit, OnDestroy {
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
    isSelectOpen = false;
    isCreatingDish = false;
    isReorderVisible = false;
    searchText = '';

    private submitHandler: (meal: MealFormValue) => Observable<void> = (_) => EMPTY;

    private readonly captureEnter = (event: KeyboardEvent): void => {
        if (event.key !== 'Enter' || !this.isSelectOpen || !this.searchText.trim()) return;
        const allDishes = this.store.selectSnapshot(DishState.getAllDishes);
        const selectedNames = this.form.controls.dishes.value ?? [];
        const hasMatch = allDishes.some(
            (d) => !selectedNames.includes(d.name) && d.name.toLowerCase().includes(this.searchText.toLowerCase())
        );
        if (hasMatch) return;
        event.preventDefault();
        event.stopPropagation();
        void this.createAndAddDish(this.searchText.trim());
    };

    ngOnInit() {
        document.addEventListener('keydown', this.captureEnter, true);
        this.store.dispatch(new EnsureLoadAllDishes());
    }

    ngOnDestroy() {
        document.removeEventListener('keydown', this.captureEnter, true);
    }

    open(meal: Partial<Meal>, submitHandler: (meal: MealFormValue) => Observable<void>) {
        this.form.reset();
        this.isReorderVisible = false;
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

    get selectedDishes(): string[] {
        return this.form.controls.dishes.value ?? [];
    }

    isSelected(name: string): boolean {
        return this.selectedDishes.includes(name);
    }

    moveDish(index: number, direction: -1 | 1): void {
        const dishes = [...this.selectedDishes];
        const target = index + direction;
        [dishes[index], dishes[target]] = [dishes[target], dishes[index]];
        this.form.controls.dishes.setValue(dishes);
    }

    addNewDish(event: MouseEvent): void {
        event.preventDefault(); // prevent blur before mousedown completes
        void this.createAndAddDish(this.searchText.trim());
    }

    private async createAndAddDish(name: string): Promise<void> {
        if (!name || this.isCreatingDish) return;
        const current = this.form.controls.dishes.value ?? [];
        if (current.includes(name)) return;

        this.isCreatingDish = true;
        try {
            await firstValueFrom(this.store.dispatch(new CreateDish({ id: null, name, url: null })));
            this.form.controls.dishes.setValue([...current, name]);
            this.searchText = '';
            this.isSelectOpen = false;
        } finally {
            this.isCreatingDish = false;
        }
    }

    async onSubmit() {
        this.form.markAllAsTouched();

        if (this.form.invalid) {
            return;
        }

        const dishNames: string[] = this.form.value.dishes ?? [];
        const allDishes = this.store.selectSnapshot(DishState.getAllDishes);
        const resolvedDishes: Dish[] = dishNames.map((name) => allDishes.find((d) => d.name === name)!);

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
