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
    recipe?: Recipe;
    type: MealType;
}

// Form value types - id is optional for create operations
export type RecipeFormValue = Omit<Recipe, 'id' | 'deleted' | 'last_preparation'> & { id: number | null };
export type MealFormValue = Omit<Meal, 'id'> & { id: number | null };
