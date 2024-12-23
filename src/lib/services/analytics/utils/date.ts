import { eachDayOfInterval, format, startOfDay, endOfDay, subDays } from 'date-fns';

export const getDateRange = (days: number) => {
  const endDate = endOfDay(new Date());
  const startDate = startOfDay(subDays(endDate, days));

  return {
    startDate,
    endDate,
    dateRange: eachDayOfInterval({ start: startDate, end: endDate })
      .map(date => format(date, 'yyyy-MM-dd'))
  };
};

export const getPeriods = (entries: any[], days: number) => {
  const now = new Date();
  const periodStart = subDays(now, days);
  
  const currentPeriod = entries.filter(item => 
    new Date(item.created_at) >= periodStart
  );

  const previousPeriod = entries.filter(item => {
    const date = new Date(item.created_at);
    return date >= subDays(periodStart, days) && date < periodStart;
  });

  return { currentPeriod, previousPeriod };
};