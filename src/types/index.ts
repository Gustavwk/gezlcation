export type Day = {
  date: string;
  isWeekend: boolean;
  isHoliday: boolean;
};

export type Period = {
  start: string;
  end: string;
  totalDays: number;
  requiredVacationDays: number;
  roi: number;
  vacationDates: string[];
  holidayDates: string[];
};

export type Country = {
  countryCode: string;
  name: string;
};

export type Holiday = {
  date: string;
  localName: string;
  name: string;
};
