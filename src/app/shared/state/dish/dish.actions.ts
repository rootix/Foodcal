import { Dish, DishFormValue } from '../../../model';

export class CreateDish {
    static readonly type = '[Dish] Create Dish';
    constructor(public dish: DishFormValue) {}
}

export class UpdateDish {
    static readonly type = '[Dish] Update Dish';
    constructor(public dish: DishFormValue & { id: number }) {}
}

export class DeleteDish {
    static readonly type = '[Dish] Delete Dish';
    constructor(public dish: Dish) {}
}

export class LoadAllDishes {
    static readonly type = '[Dish] Load All Dishes';
}

export class EnsureLoadAllDishes {
    static readonly type = '[Dish] Ensure Load All Dishes';
}

export class DishLoading {
    static readonly type = '[Dish] Dishes Loading';
}

export class DishLoaded {
    static readonly type = '[Dish] Dishes Loaded';
}
