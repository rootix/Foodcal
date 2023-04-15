import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { RecipeState } from 'src/app/shared/state/recipe';
import { NzTableComponent } from 'ng-zorro-antd/table';
import { RecipeWithLastPreparation } from '../../../shared/models/recipe.model';

@Component({
    selector: 'fc-recipes-list',
    templateUrl: './recipes-list.component.html',
    styleUrls: ['./recipes-list.component.scss'],
})
export class RecipesListComponent {
    @Input() recipes: RecipeWithLastPreparation[] = [];
    @Input() loading = false;
    @Output() createRecipe = new EventEmitter();
    @Output() editRecipe = new EventEmitter<RecipeWithLastPreparation>();
    @Output() deleteRecipe = new EventEmitter<RecipeWithLastPreparation>();

    @Select(RecipeState.getTags) private tagsFromStore$!: Observable<string[]>;
    tags$: Observable<{ text: string; value: string }[]>;

    expandSet = new Set<string>();
    @ViewChild(NzTableComponent) recipeTable?: NzTableComponent<RecipeWithLastPreparation>;

    constructor() {
        this.tags$ = this.tagsFromStore$.pipe(
            map((tags) => [...tags].sort()),
            map((tags) => tags.map((tag) => ({ text: tag, value: tag })))
        );
    }

    sortByName(a: RecipeWithLastPreparation, b: RecipeWithLastPreparation) {
        return a.name.localeCompare(b.name);
    }

    sortByLastPreparation(a: RecipeWithLastPreparation, b: RecipeWithLastPreparation) {
        if (!a.lastPreparation && !b.lastPreparation) {
            return 0;
        } else if (!a.lastPreparation) {
            return -1;
        } else if (!b.lastPreparation) {
            return 1;
        }

        return a.lastPreparation > b.lastPreparation ? 1 : a.lastPreparation === b.lastPreparation ? 0 : -1;
    }

    filterByTags(tags: string[], recipe: RecipeWithLastPreparation) {
        if (!recipe.tags) {
            return false;
        }

        return tags.some((tag) => (recipe.tags ? recipe.tags.indexOf(tag) !== -1 : false));
    }

    onExpandChange(id: string, checked: boolean): void {
        if (checked) {
            this.expandSet.add(id);
        } else {
            this.expandSet.delete(id);
        }
    }
}
