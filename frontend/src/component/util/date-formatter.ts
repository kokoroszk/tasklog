import { compose } from 'ramda';

const pad2 = (n: number) => n.toString().padStart(2, '0');
const month = compose(pad2, (d: Date) => d.getMonth() + 1);
const date = compose(pad2, (d: Date) => d.getDate());
const hours = compose(pad2, (d: Date) => d.getHours());
const minutes = compose(pad2, (d: Date) => d.getMinutes());
const seconds = compose(pad2, (d: Date) => d.getSeconds());

type Nullable<T> = T | undefined | null;
export const fmtDate = (d: Nullable<Date>) => (d ? `${d.getFullYear()}/${month(d)}/${date(d)}` : '-');
export const fmtDateTime = (d: Nullable<Date>) => (d ? `${fmtDate(d)} ${hours(d)}:${minutes(d)}:${seconds(d)}` : '-');
