import { Component, EventEmitter, Input, Output, ViewChild } from "@angular/core";
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Recipe } from 'src/app/shared/models';
import { RecipeState } from 'src/app/shared/state/recipe';
import { NzTableComponent } from "ng-zorro-antd/table";

@Component({
    selector: 'fc-recipes-list',
    templateUrl: './recipes-list.component.html',
    styleUrls: ['./recipes-list.component.scss'],
})
export class RecipesListComponent {
    @Input() recipes: Recipe[] = [];
    @Input() loading = false;
    @Output() createRecipe = new EventEmitter();
    @Output() editRecipe = new EventEmitter<Recipe>();
    @Output() deleteRecipe = new EventEmitter<Recipe>();

    @Select(RecipeState.getTags) private tagsFromStore$!: Observable<string[]>;
    tags$: Observable<{ text: string; value: string }[]>;

    expandSet = new Set<string>();
    @ViewChild(NzTableComponent) recipeTable?: NzTableComponent<Recipe>

    constructor() {
        this.tags$ = this.tagsFromStore$.pipe(
            map((tags) => [...tags].sort()),
            map((tags) => tags.map((tag) => ({ text: tag, value: tag })))
        );
    }

    sortByName(a: Recipe, b: Recipe) {
        return a.name.localeCompare(b.name);
    }

    sortByLastPreparation(a: Recipe, b: Recipe) {
        if (!a.lastPreparation && !b.lastPreparation) {
            return 0;
        } else if (!a.lastPreparation) {
            return -1;
        } else if (!b.lastPreparation) {
            return 1;
        }

        return a.lastPreparation > b.lastPreparation ? 1 : a.lastPreparation === b.lastPreparation ? 0 : -1;
    }

    filterByTags(tags: string[], recipe: Recipe) {
        if (!recipe.tags) {
            return false;
        }

        return tags.some((tag) => recipe.tags!.indexOf(tag) !== -1);
    }

    onExpandChange(id: string, checked: boolean): void {
        if (checked) {
            this.expandSet.add(id);
        } else {
            this.expandSet.delete(id);
        }
    }
}
