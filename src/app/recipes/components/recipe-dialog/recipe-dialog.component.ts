import { Component } from '@angular/core';
import { FormControl, FormGroup, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Select } from '@ngxs/store';
import { EMPTY, Observable } from "rxjs";
import { finalize } from 'rxjs/operators';
import { Recipe } from 'src/app/shared/models';
import { RecipeState } from 'src/app/shared/state/recipe';

@Component({
    selector: 'fc-recipe-dialog',
    templateUrl: './recipe-dialog.component.html',
})
export class RecipeDialogComponent {
    @Select(RecipeState.getTags) tags$!: Observable<string[]>;

    isOpen = false;
    isNew = false;

    readonly form = new UntypedFormGroup({
        _id: new UntypedFormControl(null, Validators.required),
        name: new UntypedFormControl(null, Validators.required),
        url: new UntypedFormControl(),
        tags: new UntypedFormControl(),
        note: new UntypedFormControl(),
    });

    loading = false;
    private submitHandler: (recipe: Recipe) => Observable<void> = (_) => EMPTY;

    open(recipe: Recipe, submitHandler: (recipe: Recipe) => Observable<void>) {
        this.form.reset();
        this.isNew = recipe._id === undefined;
        this.submitHandler = submitHandler;
        this.form.patchValue({ _id: 0 });
        if (!this.isNew) {
            this.form.patchValue(recipe);
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

        this.loading = true;
        this.submitHandler({ ...this.form.value })
            .pipe(finalize(() => (this.loading = false)))
            .subscribe((_) => {
                this.isOpen = false;
            });
    }
}
