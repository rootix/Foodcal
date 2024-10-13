import { Component, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngxs/store';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { Observable } from 'rxjs';
import { CreateRecipe, DeleteRecipe, LoadAllRecipes, RecipeState, UpdateRecipe } from 'src/app/shared/state/recipe';
import { RecipeDialogComponent } from '../../components/recipe-dialog/recipe-dialog.component';
import { Recipe } from '../../../model';
import { RecipesListComponent } from '../../components/recipes-list/recipes-list.component';
import { AsyncPipe } from '@angular/common';

@Component({
    selector: 'fc-recipes-view',
    templateUrl: './recipes-view.component.html',
    standalone: true,
    imports: [RecipesListComponent, RecipeDialogComponent, AsyncPipe, NzModalModule],
})
export class RecipesViewComponent implements OnInit {
    @ViewChild(RecipeDialogComponent) dialog?: RecipeDialogComponent;

    recipes$: Observable<Recipe[]> = this.store.select(RecipeState.getAllRecipes);
    loading$: Observable<boolean> = this.store.select(RecipeState.loading);

    constructor(
        private store: Store,
        private modalService: NzModalService
    ) {}

    ngOnInit() {
        this.store.dispatch(new LoadAllRecipes());
    }

    onCreateRecipe() {
        if (!this.dialog) {
            throw Error('no dialog present');
        }

        this.dialog.open({} as Recipe, (r) => this.store.dispatch(new CreateRecipe(r)));
    }

    onEditRecipe(recipe: Recipe) {
        if (!this.dialog) {
            throw Error('no dialog present');
        }

        this.dialog.open(recipe, (r) => this.store.dispatch(new UpdateRecipe(r)));
    }

    onDeleteRecipe(recipe: Recipe) {
        this.modalService.confirm({
            nzTitle: 'Bestätigen',
            nzContent: 'Soll das Rezept wirklich gelöscht werden?',
            nzOkText: 'Löschen',
            nzOnOk: () => this.store.dispatch(new DeleteRecipe(recipe)),
            nzCancelText: 'Abbrechen',
            nzOkDanger: true,
        });
    }
}
