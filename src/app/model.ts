export enum MealType {
    Dinner = 'Dinner',
    Lunch = 'Lunch',
}

export interface Dish {
    id: number;
    name: string;
    url: string | null;
    last_preparation?: Date | null;
    deleted: boolean;
}

export interface Meal {
    id: number;
    date: Date;
    notes: string | null;
    dishes: Dish[];
    type: MealType;
}

// Form value types - id is optional for create operations
export type DishFormValue = Omit<Dish, 'id' | 'deleted' | 'last_preparation'> & { id: number | null };
export type MealFormValue = Omit<Meal, 'id'> & { id: number | null };
