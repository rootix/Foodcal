import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngxs/store';
import { EMPTY, Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { RecipeState } from 'src/app/shared/state/recipe';
import { Recipe, RecipeFormValue } from '../../../model';
import { NzModalComponent } from 'ng-zorro-antd/modal';
import { NzFormControlComponent, NzFormDirective, NzFormItemComponent, NzFormLabelComponent } from 'ng-zorro-antd/form';
import { NzColDirective, NzRowDirective } from 'ng-zorro-antd/grid';
import { NzInputDirective } from 'ng-zorro-antd/input';
import { NzOptionComponent, NzSelectComponent } from 'ng-zorro-antd/select';
import { AsyncPipe } from '@angular/common';
import { NzButtonComponent } from 'ng-zorro-antd/button';
import { NzWaveDirective } from 'ng-zorro-antd/core/wave';

@Component({
    selector: 'fc-recipe-dialog',
    templateUrl: './recipe-dialog.component.html',
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
        NzOptionComponent,
        NzButtonComponent,
        NzWaveDirective,
        AsyncPipe,
    ],
})
export class RecipeDialogComponent {
    private store = inject(Store);

    tags$: Observable<string[]> = this.store.select(RecipeState.getTags);

    isOpen = false;
    isNew = false;

    readonly form = new FormGroup({
        id: new FormControl<number | null>(null),
        name: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
        url: new FormControl<string | null>(null),
        tags: new FormControl<string[] | null>(null),
        note: new FormControl<string | null>(null),
    });

    loading = false;

    private submitHandler: (recipe: RecipeFormValue) => Observable<void> = (_) => EMPTY;

    open(recipe: Partial<Recipe>, submitHandler: (recipe: RecipeFormValue) => Observable<void>) {
        this.form.reset();
        this.isNew = !recipe.id;
        this.submitHandler = submitHandler;
        this.form.patchValue({
            id: recipe.id ?? null,
            name: recipe.name ?? '',
            url: recipe.url ?? null,
            tags: recipe.tags ?? null,
            note: recipe.note ?? null,
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
