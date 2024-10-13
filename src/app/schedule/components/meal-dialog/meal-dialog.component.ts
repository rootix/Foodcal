import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Store } from '@ngxs/store';
import { EMPTY, Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { EnsureLoadAllRecipes, RecipeState } from 'src/app/shared/state/recipe';
import { Meal, Recipe } from '../../../model';
import { NzModalComponent } from 'ng-zorro-antd/modal';
import { NzFormControlComponent, NzFormDirective, NzFormItemComponent, NzFormLabelComponent } from 'ng-zorro-antd/form';
import { NzColDirective, NzRowDirective } from 'ng-zorro-antd/grid';
import { NzOptionComponent, NzSelectComponent } from 'ng-zorro-antd/select';
import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { NzSpinComponent } from 'ng-zorro-antd/spin';
import { NzInputDirective } from 'ng-zorro-antd/input';
import { NzButtonComponent } from 'ng-zorro-antd/button';
import { NzWaveDirective } from 'ng-zorro-antd/core/wave';

@Component({
    selector: 'fc-meal-dialog',
    templateUrl: './meal-dialog.component.html',
    standalone: true,
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
        NgFor,
        NzOptionComponent,
        NgIf,
        NzSpinComponent,
        NzInputDirective,
        NzButtonComponent,
        NzWaveDirective,
        AsyncPipe,
    ],
})
export class MealDialogComponent implements OnInit {
    allRecipes$: Observable<Recipe[]> = this.store.select(RecipeState.getAllRecipes);
    allRecipesLoading$: Observable<boolean> = this.store.select(RecipeState.loading);

    isOpen = false;
    isNew = false;

    readonly form = new UntypedFormGroup({
        id: new UntypedFormControl(0, Validators.required),
        date: new UntypedFormControl(null, Validators.required),
        type: new UntypedFormControl(null, Validators.required),
        recipe: new UntypedFormControl(null, Validators.required),
        notes: new UntypedFormControl(),
    });

    submitLoading = false;

    constructor(private store: Store) {}

    private submitHandler: (meal: Meal) => Observable<void> = (_) => EMPTY;

    ngOnInit() {
        this.store.dispatch(new EnsureLoadAllRecipes());
    }

    open(meal: Meal, submitHandler: (meal: Meal) => Observable<void>) {
        this.form.reset();
        this.isNew = !meal.id;
        this.submitHandler = submitHandler;
        if (this.isNew) {
            this.form.patchValue({ id: 0 });
        }
        this.form.patchValue(meal);
        this.isOpen = true;
    }

    onSubmit() {
        for (const i in this.form.controls) {
            if (Object.prototype.hasOwnProperty.call(this.form.controls, i)) {
                this.form.controls[i].markAsDirty();
                this.form.controls[i].updateValueAndValidity();
            }
        }

        if (this.form.invalid) {
            return;
        }

        this.submitLoading = true;
        this.submitHandler({ ...this.form.value })
            .pipe(finalize(() => (this.submitLoading = false)))
            .subscribe((_) => {
                this.isOpen = false;
            });
    }

    recipeCompareFn(first: Recipe, second: Recipe) {
        return first && second && first.id === second.id;
    }
}
