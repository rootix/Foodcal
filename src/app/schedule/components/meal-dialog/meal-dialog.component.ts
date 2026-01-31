import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngxs/store';
import { EMPTY, Observable } from 'rxjs';
import { map, finalize } from 'rxjs/operators';
import { EnsureLoadAllRecipes, RecipeState } from 'src/app/shared/state/recipe';
import { Meal, MealFormValue, MealType, Recipe } from '../../../model';
import { NzModalComponent } from 'ng-zorro-antd/modal';
import { NzFormControlComponent, NzFormDirective, NzFormItemComponent, NzFormLabelComponent } from 'ng-zorro-antd/form';
import { NzColDirective, NzRowDirective } from 'ng-zorro-antd/grid';
import { NzOptionComponent, NzSelectComponent } from 'ng-zorro-antd/select';
import { AsyncPipe, DatePipe } from '@angular/common';
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
    providers: [DatePipe],
})
export class MealDialogComponent implements OnInit {
    private store = inject(Store);
    private datePipe = inject(DatePipe);

    allRecipes$: Observable<Recipe[]> = this.store
        .select(RecipeState.getAllRecipes)
        .pipe(map((recipes) => [...recipes].sort((a, b) => a.name.localeCompare(b.name))));
    allRecipesLoading$: Observable<boolean> = this.store.select(RecipeState.loading);

    isOpen = false;
    isNew = false;

    readonly form = new FormGroup({
        id: new FormControl<number | null>(null),
        date: new FormControl<Date | null>(null, { validators: [Validators.required] }),
        type: new FormControl<MealType | null>(null, { validators: [Validators.required] }),
        recipe: new FormControl<Recipe | null>(null, { validators: [Validators.required] }),
        notes: new FormControl<string | null>(null),
    });

    submitLoading = false;

    private submitHandler: (meal: MealFormValue) => Observable<void> = (_) => EMPTY;

    ngOnInit() {
        this.store.dispatch(new EnsureLoadAllRecipes());
    }

    open(meal: Partial<Meal>, submitHandler: (meal: MealFormValue) => Observable<void>) {
        this.form.reset();
        this.isNew = !meal.id;
        this.submitHandler = submitHandler;
        this.form.patchValue({
            id: meal.id ?? null,
            date: meal.date ?? null,
            type: meal.type ?? null,
            recipe: meal.recipe ?? null,
            notes: meal.notes ?? null,
        });
        this.isOpen = true;
    }

    onSubmit() {
        this.form.markAllAsTouched();

        if (this.form.invalid) {
            return;
        }

        const value = this.form.getRawValue();
        this.submitLoading = true;
        this.submitHandler(value as MealFormValue)
            .pipe(finalize(() => (this.submitLoading = false)))
            .subscribe((_) => {
                this.isOpen = false;
            });
    }

    recipeCompareFn(first: Recipe, second: Recipe) {
        return first && second && first.id === second.id;
    }

    formatRecipeLabel(recipe: Recipe): string {
        if (recipe.last_preparation) {
            return `${recipe.name} (${this.datePipe.transform(recipe.last_preparation, 'dd.MM.yyyy')})`;
        }
        return recipe.name;
    }
}
