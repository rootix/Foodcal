import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { Store } from '@ngxs/store';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { Observable } from 'rxjs';
import { CreateDish, DeleteDish, DishState, LoadAllDishes, UpdateDish } from 'src/app/shared/state/dish';
import { DishDialogComponent } from '../../components/dish-dialog/dish-dialog.component';
import { Dish, DishFormValue } from '../../../model';
import { DishesListComponent } from '../../components/dishes-list/dishes-list.component';
import { AsyncPipe } from '@angular/common';

@Component({
    selector: 'fc-dishes-view',
    templateUrl: './dishes-view.component.html',
    imports: [DishesListComponent, DishDialogComponent, AsyncPipe, NzModalModule],
})
export class DishesViewComponent implements OnInit {
    private store = inject(Store);
    private modalService = inject(NzModalService);

    @ViewChild(DishDialogComponent) dialog?: DishDialogComponent;

    dishes$: Observable<Dish[]> = this.store.select(DishState.getAllDishes);
    loading$: Observable<boolean> = this.store.select(DishState.loading);

    ngOnInit() {
        this.store.dispatch(new LoadAllDishes());
    }

    onCreateDish() {
        if (!this.dialog) {
            throw Error('no dialog present');
        }

        this.dialog.open({} as Dish, (d) => this.store.dispatch(new CreateDish(d)));
    }

    onEditDish(dish: Dish) {
        if (!this.dialog) {
            throw Error('no dialog present');
        }

        this.dialog.open(dish, (d) => this.store.dispatch(new UpdateDish(d as DishFormValue & { id: number })));
    }

    onDeleteDish(dish: Dish) {
        this.modalService.confirm({
            nzTitle: 'Bestätigen',
            nzContent: 'Soll die Speise wirklich gelöscht werden?',
            nzOkText: 'Löschen',
            nzOnOk: () => this.store.dispatch(new DeleteDish(dish)),
            nzCancelText: 'Abbrechen',
            nzOkDanger: true,
        });
    }
}
