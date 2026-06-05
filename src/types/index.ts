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

export type VacationFilter = {
  from: string;    // ISO date — period must start on or after
  to: string;      // ISO date — period must end on or before
  budget: number;  // max vacation days to spend
};

export type Holiday = {
  date: string;
  localName: string;
  name: string;
};
