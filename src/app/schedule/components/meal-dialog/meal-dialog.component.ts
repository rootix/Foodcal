import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Select, Store } from '@ngxs/store';
import { EMPTY, Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { EnsureLoadAllRecipes, RecipeState } from 'src/app/shared/state/recipe';
import { Meal, Recipe } from '../../../model';

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
            if (this.form.controls.hasOwnProperty(i)) {
                this.form.controls[i].markAsDirty();
                this.form.controls[i].updateValueAndValidity();
            }
        }

        if (this.form.invalid) {
            console.log(this.form.controls);
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
