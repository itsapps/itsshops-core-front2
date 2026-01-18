import slugifyString from '@sindresorhus/slugify';
import dayjs from 'dayjs';

export function someFilter(value: any) {
  return `filtered value: ${slugifyString(value)}---${dayjs(new Date()).toISOString()}`;
}

export const toIsoString = (dateString: string) => dayjs(dateString).toISOString();