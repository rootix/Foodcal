import { Component } from '@angular/core';
import { ReactiveFormsModule, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Store } from '@ngxs/store';
import { EMPTY, Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { RecipeState } from 'src/app/shared/state/recipe';
import { Recipe } from '../../../model';
import { NzModalComponent } from 'ng-zorro-antd/modal';
import { NzFormControlComponent, NzFormDirective, NzFormItemComponent, NzFormLabelComponent } from 'ng-zorro-antd/form';
import { NzColDirective, NzRowDirective } from 'ng-zorro-antd/grid';
import { NzInputDirective } from 'ng-zorro-antd/input';
import { NzOptionComponent, NzSelectComponent } from 'ng-zorro-antd/select';
import { AsyncPipe, NgFor } from '@angular/common';
import { NzButtonComponent } from 'ng-zorro-antd/button';
import { NzWaveDirective } from 'ng-zorro-antd/core/wave';

@Component({
    selector: 'fc-recipe-dialog',
    templateUrl: './recipe-dialog.component.html',
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
        NzInputDirective,
        NzSelectComponent,
        NgFor,
        NzOptionComponent,
        NzButtonComponent,
        NzWaveDirective,
        AsyncPipe,
    ],
})
export class RecipeDialogComponent {
    tags$: Observable<string[]> = this.store.select(RecipeState.getTags);

    isOpen = false;
    isNew = false;

    readonly form = new UntypedFormGroup({
        id: new UntypedFormControl(null, Validators.required),
        name: new UntypedFormControl(null, Validators.required),
        url: new UntypedFormControl(),
        tags: new UntypedFormControl(),
        note: new UntypedFormControl(),
    });

    loading = false;

    constructor(private store: Store) {}

    private submitHandler: (recipe: Recipe) => Observable<void> = (_) => EMPTY;

    open(recipe: Recipe, submitHandler: (recipe: Recipe) => Observable<void>) {
        this.form.reset();
        this.isNew = !recipe.id;
        this.submitHandler = submitHandler;
        if (!this.isNew) {
            this.form.patchValue(recipe);
        } else {
            this.form.patchValue({ id: 0 });
        }

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

        this.loading = true;
        this.submitHandler({ ...this.form.value })
            .pipe(finalize(() => (this.loading = false)))
            .subscribe((_) => {
                this.isOpen = false;
            });
    }
}
