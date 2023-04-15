import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Select, Store } from '@ngxs/store';
import { EMPTY, Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { EnsureLoadAllRecipes, RecipeState } from 'src/app/shared/state/recipe';
import { Meal, Recipe } from '../../../api.generated';

@Component({
    selector: 'fc-meal-dialog',
    templateUrl: './meal-dialog.component.html',
})
export class MealDialogComponent implements OnInit {
    @Select(RecipeState.getAllRecipes) allRecipes$!: Observable<Recipe[]>;
    @Select(RecipeState.loading) allRecipesLoading$!: Observable<boolean>;

    isOpen = false;
    isNew = false;

    readonly form = new UntypedFormGroup({
        _id: new UntypedFormControl(0, Validators.required),
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
        this.isNew = meal._id === undefined;
        this.submitHandler = submitHandler;
        this.form.patchValue(meal);
        if (this.isNew) {
            this.form.patchValue({ _id: 0 });
        }
        this.isOpen = true;
    }

    onSubmit() {
        for (const i in this.form.controls) {
            if (this.form.controls.hasOwnProperty(i)) {
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
        return first && second && first._id === second._id;
    }
}
