import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import {
    NzTableCellDirective,
    NzTableComponent,
    NzTbodyComponent,
    NzThAddOnComponent,
    NzTheadComponent,
    NzThMeasureDirective,
    NzTrDirective,
} from 'ng-zorro-antd/table';
import { Dish } from '../../../model';
import { NzButtonComponent } from 'ng-zorro-antd/button';
import { NzWaveDirective } from 'ng-zorro-antd/core/wave';
import { NzIconDirective } from 'ng-zorro-antd/icon';
import { DatePipe } from '@angular/common';

@Component({
    selector: 'fc-dishes-list',
    templateUrl: './dishes-list.component.html',
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
        DatePipe,
    ],
})
export class DishesListComponent {
    @Input() dishes: Dish[] = [];
    @Input() loading = false;
    @Output() createDish = new EventEmitter();
    @Output() editDish = new EventEmitter<Dish>();
    @Output() deleteDish = new EventEmitter<Dish>();

    @ViewChild(NzTableComponent, { static: true }) dishTable?: NzTableComponent<Dish>;

    sortByName(a: Dish, b: Dish) {
        return a.name.localeCompare(b.name);
    }

    sortByLastPreparation(a: Dish, b: Dish) {
        if (!a.last_preparation && !b.last_preparation) {
            return 0;
        } else if (!a.last_preparation) {
            return -1;
        } else if (!b.last_preparation) {
            return 1;
        }

        return a.last_preparation > b.last_preparation ? 1 : a.last_preparation === b.last_preparation ? 0 : -1;
    }
}
