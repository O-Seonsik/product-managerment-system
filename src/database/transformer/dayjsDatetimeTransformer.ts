import * as dayjs from 'dayjs';
export const DayjsDatetimeTransformer = {
  // TypeORM -> DB
  to(value: dayjs.Dayjs | undefined): string | undefined {
    if (value) return value.format('YYYY-MM-DD hh:mm:ss');
    return value as undefined;
  },

  // DB -> TypeORM
  from(value: string): dayjs.Dayjs | any {
    const date = dayjs(value);
    if (date.isValid()) {
      return date;
    }
    return null;
  },
};

export const DayjsDateTransformer = {
  // TypeORM -> DB
  to(value: dayjs.Dayjs | undefined): string | undefined {
    if (value) return value.format('YYYY-MM-DD');
    return value as undefined;
  },

  // DB -> TypeORM
  from(value: string): dayjs.Dayjs | any {
    const date = dayjs(value);
    if (date.isValid()) {
      return date;
    }
    return null;
  },
};
