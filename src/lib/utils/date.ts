import { format as fnsFormat, isValid } from 'date-fns';

export const formatDate = (date: string | Date | null | undefined, formatStr: string = 'MMM d, yyyy'): string => {
  if (!date) return 'N/A';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (!isValid(dateObj)) {
    console.warn('Invalid date:', date);
    return 'Invalid date';
  }
  
  try {
    return fnsFormat(dateObj, formatStr);
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid date';
  }
};

export const formatDateTime = (date: string | Date | null | undefined): string => {
  return formatDate(date, 'MMM d, h:mm a');
};