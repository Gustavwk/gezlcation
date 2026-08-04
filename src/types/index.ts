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

export type VacationFilter = {
  from: string;             // ISO date — period must start on or after
  to: string;              // ISO date — period must end on or before
  asOf: string;            // ISO date the balance is measured at (the Fra-date)
  balance: number;         // vacation days available as of asOf
  accrualPerMonth: number; // vacation days earned per calendar month going forward
};

export type Holiday = {
  date: string;
  localName: string;
  name: string;
};
