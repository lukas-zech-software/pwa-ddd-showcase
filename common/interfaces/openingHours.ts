export type OpeningHourEntry = {
  from: number;
  to: number;
};

export type OpeningHoursDay = OpeningHourEntry[] | undefined;

export const ALL_OPENING_HOURS_WEEK: (keyof OpeningHoursWeek)[] = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
];

export type OpeningHours = Names<OpeningHoursWeek>;

export type Names<T> = {
  [P in keyof T]: string;
};

export type OpeningHoursWeek = {
  monday?: OpeningHoursDay;
  tuesday?: OpeningHoursDay;
  wednesday?: OpeningHoursDay;
  thursday?: OpeningHoursDay;
  friday?: OpeningHoursDay;
  saturday?: OpeningHoursDay;
  sunday?: OpeningHoursDay;
};
