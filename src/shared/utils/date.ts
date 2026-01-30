import dayjs from 'dayjs';
export const startOfDay = (d: Date) => dayjs(d).startOf('day').toDate();
export const endOfDay = (d: Date) => dayjs(d).endOf('day').toDate();
// export const convertToUTC = (d: Date) => dayjs.utc(d).toDate();