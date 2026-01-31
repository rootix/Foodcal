import { addDays, getWeek, getYear, setWeek, startOfWeek } from 'date-fns';
import { Week } from '../models/schedule.model';

export const getCurrentWeek = () => getWeekForDate(new Date());

export const getWeekForDate = (date: Date): Week => {
    const monday = startOfWeek(date, { weekStartsOn: 1 });
    const sunday = addDays(monday, 6);
    const calendarWeek = getCalendarWeek(date);
    const year = getYear(monday);
    const currentWeek = getCurrentWeekInfo();
    const isCurrentWeek = currentWeek.year === year && currentWeek.calendarWeek === calendarWeek;

    return {
        year,
        startDate: monday,
        endDate: sunday,
        calendarWeek,
        isCurrentWeek,
    };
};

export const getWeekByYearAndWeek = (year: number, week: number): Week => {
    const dateInYear = new Date(year, 0, 4); // Jan 4 is always in week 1
    const dateInWeek = setWeek(dateInYear, week, { weekStartsOn: 1 });
    return getWeekForDate(dateInWeek);
};

export const getCalendarWeek = (date: Date): number => getWeek(date, { weekStartsOn: 1 });

const getCurrentWeekInfo = () => {
    const now = new Date();
    const monday = startOfWeek(now, { weekStartsOn: 1 });
    return {
        year: getYear(monday),
        calendarWeek: getCalendarWeek(now),
    };
};
