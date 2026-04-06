import moment from "jalali-moment";

export declare type VoidListener = VoidFunction | null | undefined;

export declare type DateValueType = Date | Date[] | string | moment.Moment;

export declare interface DateMeta {
  day: number,
  month: number,
  year: number,
  today?: boolean,
  selectable: boolean,
  otherMonth?: boolean,
}


export interface LocaleSettings {
  firstDayOfWeek?: number;
  dayNames: string[];
  dayNamesShort: string[];
  dayNamesMin: string[];
  monthNames: string[];
  monthNamesShort: string[];
  today: string;
  clear: string;
  dateFormat?: string;
}

export const PERSIAN_LOCALE: LocaleSettings = {
  firstDayOfWeek: 0,
  dayNames: [" شنبه", "یک شنبه", "دو شنبه ", "سه شنبه", "چهار شنبه", " پنج شنبه", " جمعه"],
  dayNamesShort: ["شن", "یک", "دو ", "س", "چ", " پ", " ج"],
  dayNamesMin: ["  شنبه", "یک شنبه", "دو شنبه ", "سه شنبه", "چهار شنبه", " پنج شنبه", " جمعه"],
  monthNames: ["فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور", "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند"],
  monthNamesShort: ["فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور", "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند"],
  today: 'امروز',
  clear: 'پاک کردن',
  dateFormat: 'yy/mm/dd'
};

export const ENGLISH_LOCALE: LocaleSettings = {
  firstDayOfWeek: 0,
  dayNames: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
  dayNamesShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  dayNamesMin: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
  monthNames: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
  monthNamesShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  today: 'Today',
  clear: 'Clear',
  dateFormat: 'mm/dd/yy'
};
