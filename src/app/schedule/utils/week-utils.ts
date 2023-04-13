import { addDays, getWeek, startOfWeek } from 'date-fns';
import { Week } from '../models/schedule.model';

export const getCurrentWeek = () => getWeekForDate(new Date());

export const getWeekForDate = (date: Date): Week => {
    const monday = startOfWeek(date, { weekStartsOn: 1 });
    const sunday = addDays(monday, 6);
    const calendarWeek = getCalendarWeek(date);
    const isCurrentWeek = getCalendarWeek(new Date()) === calendarWeek;
    return {
        startDate: monday,
        endDate: sunday,
        calendarWeek,
        isCurrentWeek,
    };
};

export const getCalendarWeek = (date: Date): number => getWeek(date, { weekStartsOn: 1 });
