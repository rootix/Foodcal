import { format, parseISO } from 'date-fns';

export const toDateFromApi = (date: string) => parseISO(date);
export const toApiStringFromDate = (date: Date) => format(date, 'yyyy-MM-dd');
