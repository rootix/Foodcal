import { Meal } from '../../model';

export interface Week {
    calendarWeek: number;
    isCurrentWeek: boolean;
    startDate: Date;
    endDate: Date;
}

export interface MealsPerDay {
    date: Date;
    meals: Meal[];
}
