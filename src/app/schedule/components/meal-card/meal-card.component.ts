import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Meal, MealType } from '../../../model';
import { NgIf } from '@angular/common';
import { NzCardComponent } from 'ng-zorro-antd/card';
import { NzIconDirective } from 'ng-zorro-antd/icon';

@Component({
    selector: 'fc-meal-card',
    templateUrl: './meal-card.component.html',
    styleUrls: ['./meal-card.component.scss'],
    imports: [NgIf, NzCardComponent, NzIconDirective],
})
export class MealCardComponent {
    @Input() meal?: Meal;

    @Output() createMeal = new EventEmitter<Meal>();
    @Output() editMeal = new EventEmitter<Meal>();
    @Output() deleteMeal = new EventEmitter<Meal>();

    MealType = MealType;

    get isNew() {
        return !this.meal || !this.meal?.id;
    }
}
