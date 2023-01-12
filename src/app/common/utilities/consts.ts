import { NgxMatDateFormats } from '@angular-material-components/datetime-picker';

export const DATE_FORMAT = 'DD-MM-YYYY';
export const TIME_FORMAT = 'HH:mm';
export const DATE_AND_TIME_FORMAT = `${DATE_FORMAT} ${TIME_FORMAT}`;
export const DAY_AND_TIME_FORMAT = `ddd ${TIME_FORMAT}`;
export const DAY_AND_MONTH_FORMAT = 'D MMM';
export const WEEK_AND_MONTH_FORMAT = 'W [week,] MMM YYYY';
export const MONTH_AND_YEAR_FORMAT = 'MMM YYYY';
export const YEAR_FORMAT = 'YYYY';
export const DATE_A11_LABEL_FORMAT = 'LLLL';
export const MONTH_A11_LABEL_FORMAT = 'MMMM YYYY';

export const DATE_PICKER_FORMATS = {
  parse: {
    dateInput: DATE_FORMAT,
  },
  display: {
    dateInput: DATE_FORMAT,
    monthYearLabel: MONTH_AND_YEAR_FORMAT,
    dateA11yLabel: DATE_A11_LABEL_FORMAT,
    monthYearA11yLabel: MONTH_A11_LABEL_FORMAT,
  },
};

export const DATE_AND_TIME_PICKER_FORMATS: NgxMatDateFormats = {
  parse: {
    dateInput: DATE_AND_TIME_FORMAT,
  },
  display: {
    dateInput: DATE_AND_TIME_FORMAT,
    monthYearLabel: MONTH_AND_YEAR_FORMAT,
    dateA11yLabel: DATE_A11_LABEL_FORMAT,
    monthYearA11yLabel: MONTH_A11_LABEL_FORMAT,
  },
};

export const CRYPTO = 'crypto';
export const CRYPTO_BTC = 'btc';
export const CODE = 'code';
