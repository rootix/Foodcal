export enum MealType {
    Dinner = 'Dinner',
    Lunch = 'Lunch',
}

export interface Recipe {
    id: number;
    name: string;
    note: string | null;
    tags: string[] | null;
    url: string | null;
    last_preparation?: Date | null;
    deleted: boolean;
}

export interface Meal {
    id: number;
    date: Date;
    notes: string | null;
    recipe: Recipe;
    type: MealType;
}
