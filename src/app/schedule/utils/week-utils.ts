import { addDays, getWeek, startOfWeek } from "date-fns";
import { Week } from "../models/schedule.model";

export function getCurrentWeek(): Week {
  return getWeekForDate(new Date());
}

export function getWeekForDate(date: Date): Week {
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
}

export function getCalendarWeek(date: Date): number {
  return getWeek(date, { weekStartsOn: 1 });
}
