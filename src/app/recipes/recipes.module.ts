import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { RecipeDialogComponent } from './components/recipe-dialog/recipe-dialog.component';
import { RecipesListComponent } from './components/recipes-list/recipes-list.component';
import { TagFilterComponent } from './components/tag-filter/tag-filter.component';
import { RECIPES_ROUTES } from './recipes.routing';
import { RecipesViewComponent } from './views/recipes-view/recipes-view.component';

@NgModule({
    imports: [SharedModule, RECIPES_ROUTES],
    declarations: [RecipesViewComponent, RecipesListComponent, RecipeDialogComponent, TagFilterComponent],
})
export class RecipesModule {}
