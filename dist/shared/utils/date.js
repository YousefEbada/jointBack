import dayjs from 'dayjs';
export const startOfDay = (d) => dayjs(d).startOf('day').toDate();
export const endOfDay = (d) => dayjs(d).endOf('day').toDate();
// export const convertToUTC = (d: Date) => dayjs.utc(d).toDate();
