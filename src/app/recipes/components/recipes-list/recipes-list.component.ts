import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { RecipeState } from 'src/app/shared/state/recipe';
import {
    NzTableCellDirective,
    NzTableComponent,
    NzTableFixedRowComponent,
    NzTbodyComponent,
    NzTdAddOnComponent,
    NzThAddOnComponent,
    NzTheadComponent,
    NzThMeasureDirective,
    NzTrDirective,
    NzTrExpandDirective,
} from 'ng-zorro-antd/table';
import { Recipe } from '../../../model';
import { NzButtonComponent } from 'ng-zorro-antd/button';
import { NzWaveDirective } from 'ng-zorro-antd/core/wave';
import { NzIconDirective } from 'ng-zorro-antd/icon';
import { AsyncPipe, DatePipe, NgFor, NgIf } from '@angular/common';
import { NzTagComponent } from 'ng-zorro-antd/tag';

@Component({
    selector: 'fc-recipes-list',
    templateUrl: './recipes-list.component.html',
    styleUrls: ['./recipes-list.component.scss'],
    imports: [
        NzButtonComponent,
        NzWaveDirective,
        NzIconDirective,
        NzTableComponent,
        NzTheadComponent,
        NzTrDirective,
        NzTableCellDirective,
        NzThMeasureDirective,
        NzThAddOnComponent,
        NzTbodyComponent,
        NgFor,
        NgIf,
        NzTdAddOnComponent,
        NzTagComponent,
        NzTrExpandDirective,
        NzTableFixedRowComponent,
        AsyncPipe,
        DatePipe,
    ],
})
export class RecipesListComponent {
    @Input() recipes: Recipe[] = [];
    @Input() loading = false;
    @Output() createRecipe = new EventEmitter();
    @Output() editRecipe = new EventEmitter<Recipe>();
    @Output() deleteRecipe = new EventEmitter<Recipe>();

    tags$: Observable<{ text: string; value: string }[]> = this.store.select(RecipeState.getTags).pipe(
        map((tags) => [...tags].sort()),
        map((tags) => tags.map((tag) => ({ text: tag, value: tag })))
    );

    expandSet = new Set<number>();
    @ViewChild(NzTableComponent, { static: true }) recipeTable?: NzTableComponent<Recipe>;

    constructor(private store: Store) {}

    sortByName(a: Recipe, b: Recipe) {
        return a.name.localeCompare(b.name);
    }

    sortByLastPreparation(a: Recipe, b: Recipe) {
        if (!a.last_preparation && !b.last_preparation) {
            return 0;
        } else if (!a.last_preparation) {
            return -1;
        } else if (!b.last_preparation) {
            return 1;
        }

        return a.last_preparation > b.last_preparation ? 1 : a.last_preparation === b.last_preparation ? 0 : -1;
    }

    filterByTags(tags: string[], recipe: Recipe) {
        if (!recipe.tags) {
            return false;
        }

        return tags.some((tag) => (recipe.tags ? recipe.tags.indexOf(tag) !== -1 : false));
    }

    onExpandChange(id: number, checked: boolean): void {
        if (checked) {
            this.expandSet.add(id);
        } else {
            this.expandSet.delete(id);
        }
    }
}
