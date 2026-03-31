/* eslint-disable @angular-eslint/no-output-on-prefix */
import {
  AfterContentInit,
  Component, computed, contentChild, contentChildren, effect, ElementRef,
  forwardRef, inject, input, model, OnDestroy, OnInit, output,
  signal, TemplateRef, untracked, viewChild
} from '@angular/core';
import { MotionEvent, MotionOptions } from '@primeuix/motion';
import moment, { isDate, isMoment } from 'jalali-moment';
import 'moment/locale/fa';
import { Bind, BindModule } from 'primeng/bind';
import { InputText } from 'primeng/inputtext';
import { MotionModule } from 'primeng/motion';
import { ZIndexUtils } from 'primeng/utils';
import { Subscription } from 'rxjs';
import { PersianDatepickerService } from '../service/persian-datepicker.service';


import { NgTemplateOutlet } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { OverlayService, SharedModule, TranslationKeys } from 'primeng/api';
import { AutoFocus } from 'primeng/autofocus';
import { PARENT_INSTANCE } from 'primeng/basecomponent';
import { BaseInput } from 'primeng/baseinput';
import { Button, ButtonModule } from 'primeng/button';
import { DatePickerButtonBarTemplateContext, DatePickerDateTemplateContext, DatePickerDecadeTemplateContext, DatePickerDisabledDateTemplateContext, DatePickerInputIconTemplateContext, DatePickerModule, DatePickerMonthChangeEvent, DatePickerPassThrough, DatePickerResponsiveOptions, DatePickerStyle, DatePickerTypeView, DatePickerYearChangeEvent, NavigationState } from 'primeng/datepicker';
import { blockBodyScroll, ConnectedOverlayScrollHandler, DomHandler } from 'primeng/dom';
import { CalendarIcon, ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon, ChevronUpIcon, TimesIcon } from 'primeng/icons';
import { Ripple } from 'primeng/ripple';
import { addStyle, formatDateMetaToDate, getIndex, hasClass, isDateArray, isDateBetween, isDateEquals, isToday, isValidDate, PrimeTemplate } from './shared';
import { Nullable } from 'primeng/ts-helpers';
import { DateMeta, ENGLISH_LOCALE, LocaleSettings, PERSIAN_LOCALE, VoidListener } from './model';

export const CALENDAR_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => PersianDatepickerComponent),
  multi: true
};

@Component({
  selector: 'persian-datepicker',
  templateUrl: './persian-datepicker.html',
  styleUrls: ['./persian-datepicker.scss'],
  providers: [PersianDatepickerService, DatePickerStyle, CALENDAR_VALUE_ACCESSOR, DomHandler, { provide: PARENT_INSTANCE, useExisting: PersianDatepickerComponent }],
  imports: [
    ButtonModule,
    NgTemplateOutlet,
    InputText, BindModule, NgTemplateOutlet, AutoFocus,
    DatePickerModule, SharedModule,
    Button,
    Ripple,
    ChevronLeftIcon, ChevronRightIcon, ChevronUpIcon, ChevronDownIcon, TimesIcon, CalendarIcon,
    MotionModule,
  ],
  hostDirectives: [Bind],
  // encapsulation: ViewEncapsulation.None,
  host: {
    '[class]': 'cn(cx("root"), styleClass())',
    '[style]': 'sx("root")'
  },

})
export class PersianDatepickerComponent extends BaseInput<DatePickerPassThrough> implements OnInit, OnDestroy, ControlValueAccessor, AfterContentInit {

  //#region Injections
  public domHandler = inject(DomHandler);
  private _componentStyle = inject(DatePickerStyle);
  private bindDirectiveInstance = inject(Bind, { self: true });
  public overlayService = inject(OverlayService);

  //#endregion Injections


  //#region Inputs

  iconDisplay = input<'input' | 'button'>('button');

  styleClass = input<string>();

  inputStyle = input<Record<string, any> | null | undefined>();

  inputId = input<string | undefined>();

  inputStyleClass = input<string | undefined>();

  placeholder = input<string | undefined>();

  ariaLabelledBy = input<string | undefined>();

  ariaLabel = input<string | undefined>();

  iconAriaLabel = input<string | undefined>();

  dateFormat = input<string>('yy/mm/dd');

  multipleSeparator = input<string>(',');

  rangeSeparator = input<string>('-');

  inline = input<boolean>(false);

  showOtherMonths = input<boolean>(true);

  selectOtherMonths = input<boolean | undefined>();

  showIcon = input<boolean | undefined>();

  icon = input<string | undefined>();

  readonlyInput = input<boolean | undefined>();

  shortYearCutoff = input<string>('+10');

  hourFormat = input<string>('24');

  timeOnly = input<boolean>();

  stepHour = input<number>(1);

  stepMinute = input<number>(1);

  stepSecond = input<number>(1);

  showSeconds = input<boolean>(false);

  showOnFocus = input<boolean>(true);

  showWeek = input<boolean>(false);

  showClear = input<boolean>(false);

  startWeekFromFirstDayOfYear = input<boolean>(true);

  dataType = input<string>('date');

  selectionMode = input<'single' | 'multiple' | 'range' | undefined>('single');

  maxDateCount = input<number>();

  showButtonBar = input<boolean>();

  todayButtonStyleClass = input<string | undefined>();

  clearButtonStyleClass = input<string | undefined>();

  autofocus = input<boolean>(false);

  autoZIndex = input<boolean>(true);

  baseZIndex = input<number>(0);

  panelStyleClass = input<string | undefined>();

  panelStyle = input<any>();

  keepInvalid = input<boolean>(false);

  hideOnDateTimeSelect = input<boolean>(true);

  touchUI = input<boolean | undefined>();

  timeSeparator = input<string>(':');

  focusTrap = input<boolean>(true);

  showTransitionOptions = input<string>('.12s cubic-bezier(0, 0, 0.2, 1)');

  hideTransitionOptions = input<string>('.1s linear');

  tabindex = input<number | undefined>();

  minDate = model<Date | undefined | null>(null);

  maxDate = model<Date | undefined | null>(null);

  disabledDates = model<Date[]>([]);

  disabledDays = model<number[]>([]);

  showTime = model<boolean>(false);

  responsiveOptions = input<DatePickerResponsiveOptions[]>([]);

  numberOfMonths = input<number>(1);

  view = model<DatePickerTypeView>('date');

  defaultDate = input<Date | null>();

  appendTo = input<HTMLElement | ElementRef | TemplateRef<any> | 'self' | 'body' | null | undefined | any>(undefined);

  motionOptions = input<MotionOptions | undefined>(undefined);

  computedMotionOptions = computed<MotionOptions>(() => {
    return {
      ...this.ptm('motion'),
      ...this.motionOptions()
    };
  });

  overlayEnterAnimation = computed(() => this.touchUI() ? 'p-datepicker-overlay-enter-touch' : 'p-datepicker-overlay-enter');

  overlayLeaveAnimation = computed(() => this.touchUI() ? 'p-datepicker-overlay-leave-touch' : 'p-datepicker-overlay-leave');


  locale = computed(() => {
    const customLocale = this.customLocale();
    if (!customLocale) {
      const isJalali = this.isJalali();
      return isJalali ? PERSIAN_LOCALE : ENGLISH_LOCALE;
    } else {
      return customLocale;
    }
  });

  firstDayOfWeek = computed(() => {
    const locale = this.locale();
    return locale.firstDayOfWeek ?? 0;
  })


  isJalali = input<boolean>(false);
  InitialValue = input<string>();
  style = input<string>();
  monthNavigator = input<boolean>();
  yearNavigator = input<boolean>();
  yearRange = input<string>();
  // required = input<boolean>();
  utc = input<boolean>(false);
  customLocale = input<LocaleSettings>();


  //#endregion Inputs

  //#region Private Props

  // @ContentChildren(PrimeTemplate) templates: QueryList<any>;
  templates = contentChildren(PrimeTemplate);

  _focusKey: Nullable<string> = null;

  _locale = signal<LocaleSettings>(PERSIAN_LOCALE);

  $newVariant = computed(() => {
    const variant = this.$variant();
    return variant ? variant : undefined;
  })

  inputfieldViewChild = viewChild<ElementRef>('inputfield');

  value: Date | Date[] | string | null = new Date();
  pm: Nullable<boolean>;
  mask = signal<Nullable<HTMLDivElement>>(null);
  maskClickListener: VoidListener;
  overlay: Nullable<HTMLElement>;
  responsiveStyleElement: HTMLStyleElement | undefined | null;
  overlayVisible = signal(false);
  overlayMinWidth: Nullable<number>;

  $appendTo = computed(() => this.appendTo() || this.config.overlayAppendTo());
  timePickerTimer: any;
  documentClickListener: VoidListener;
  animationEndListener: VoidListener;
  ticksTo1970: Nullable<number>;
  yearOptions: Nullable<number[]>
  focus: Nullable<boolean>;
  isKeydown: Nullable<boolean>;
  preventDocumentListener: Nullable<boolean>;

  //#endregion Private Props


  //#region Outputs

  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  onFocus = output<Event>();

  onBlur = output<Event>();

  onClose = output<HTMLElement>();

  onSelect = output<Date | Date[]>();

  onClear = output<any>();

  onInput = output<Event>();

  onTodayClick = output<Date>();

  onClearClick = output<any>();

  onMonthChange = output<DatePickerMonthChangeEvent>();

  onYearChange = output<DatePickerYearChangeEvent>();

  onClickOutside = output<any>();

  onShow = output<HTMLElement>();

  //#endregion Outputs



  //#region View & Content Queries

  inputfield = viewChild<Nullable<ElementRef>>('inputfield');

  contentWrapper = viewChild<Nullable<ElementRef>>('contentWrapper');

  dateTemplate = contentChild<Nullable<TemplateRef<DatePickerDateTemplateContext>>>('date');
  headerTemplate = contentChild<Nullable<TemplateRef<void>>>('header');
  footerTemplate = contentChild<Nullable<TemplateRef<void>>>('footer');
  disabledDateTemplate = contentChild<Nullable<TemplateRef<DatePickerDisabledDateTemplateContext>>>('disabledDate');
  decadeTemplate = contentChild<Nullable<TemplateRef<DatePickerDecadeTemplateContext>>>('decade');
  previousIconTemplate = contentChild<Nullable<TemplateRef<void>>>('previousicon');
  nextIconTemplate = contentChild<Nullable<TemplateRef<void>>>('nexticon');
  triggerIconTemplate = contentChild<Nullable<TemplateRef<void>>>('triggericon');
  clearIconTemplate = contentChild<Nullable<TemplateRef<void>>>('clearicon');
  decrementIconTemplate = contentChild<Nullable<TemplateRef<void>>>('decrementicon');
  incrementIconTemplate = contentChild<Nullable<TemplateRef<void>>>('incrementicon');
  inputIconTemplate = contentChild<Nullable<TemplateRef<DatePickerInputIconTemplateContext>>>('inputicon');
  buttonBarTemplate = contentChild<Nullable<TemplateRef<DatePickerButtonBarTemplateContext>>>('buttonbar');

  protected _dateTemplate = signal<TemplateRef<DatePickerDateTemplateContext> | undefined>(undefined);

  _headerTemplate: TemplateRef<void> | undefined;

  _footerTemplate: TemplateRef<void> | undefined;

  _disabledDateTemplate: TemplateRef<DatePickerDisabledDateTemplateContext> | undefined;

  _decadeTemplate: TemplateRef<DatePickerDecadeTemplateContext> | undefined;

  _previousIconTemplate: TemplateRef<void> | undefined;

  _nextIconTemplate: TemplateRef<void> | undefined;

  _triggerIconTemplate: TemplateRef<void> | undefined;

  _clearIconTemplate: TemplateRef<void> | undefined;

  _decrementIconTemplate: TemplateRef<void> | undefined;

  _incrementIconTemplate: TemplateRef<void> | undefined;

  _inputIconTemplate: TemplateRef<DatePickerInputIconTemplateContext> | undefined;

  _buttonBarTemplate: TemplateRef<DatePickerButtonBarTemplateContext> | undefined;



  //#endregion View & Content Queries

  contentViewChild = computed(() => {
    const contentWrapper = this.contentWrapper();

    if (contentWrapper && this.overlay) {
      if (this.isMonthNavigate()) {
        Promise.resolve(null).then(() => this.updateFocus());
        untracked(() => this.isMonthNavigate.set(false));
      } else {
        if (!this.focus && !this.inline()) {
          this.initFocusableCell();
        }
      }
      return contentWrapper;
    }
    return undefined;
  })

  scrollHandler: Nullable<ConnectedOverlayScrollHandler>;

  documentResizeListener: VoidListener;

  navigationState: Nullable<NavigationState> = null;

  isMonthNavigate = signal<boolean>(false);

  initialized: Nullable<boolean>;

  translationSubscription: Nullable<Subscription>;

  attributeSelector: Nullable<string>;

  panelId: Nullable<string>;

  preventFocus: Nullable<boolean>;


  dayClass(date: Date) {
    return this._componentStyle.classes.day({ instance: this, date: date });
  }

  monthPickerValues = computed(() => {
    this.view();
    this.customLocale();
    const monthPickerValues = [];
    for (let i = 0; i <= 11; i++) {
      monthPickerValues.push(this.locale().monthNamesShort[i]);
    }
    return monthPickerValues;
  });

  invalidDates: Nullable<Date[]>;

  datepickerClick: Nullable<boolean>;

  rangeDates: Nullable<Date[]>;

  inputFieldValue = signal<string | null>(null);

  iconButtonAriaLabel = computed(() => {
    const iconAriaLabel = this.iconAriaLabel();
    return iconAriaLabel ? iconAriaLabel : this.getTranslation('chooseDate');
  });

  prevIconAriaLabel = computed(() => {
    return this.view() === 'year' ? this.getTranslation('prevDecade') : this.view() === 'month' ? this.getTranslation('prevYear') : this.getTranslation('prevMonth');
  });

  nextIconAriaLabel = computed(() => {
    return this.view() === 'year' ? this.getTranslation('nextDecade') : this.view() === 'month' ? this.getTranslation('nextYear') : this.getTranslation('nextMonth');
  });

  currentMonth = signal<number>(1);
  currentYear = signal<number>(new Date().getFullYear());
  currentHour = signal<number>(0);
  currentMinute = signal<number>(0);
  currentSecond = signal<number>(0);


  constructor() {
    super();

    const defaultDate = this.defaultDate();

    if (this.initialized) {
      const date = defaultDate || new Date();
      this.currentMonth.set(date.getMonth());
      this.currentYear.set(date.getFullYear());
      this.initTime(date);
    }

    //! should be refactored
    effect(() => {
      this.dateFormat();
      this.hourFormat();
      if (this.initialized) {
        this.updateInputfield();
      }
    });

    //! should be refactored
    // effect(() => {
    //   this.minDate();
    //   this.maxDate();
    //   this.disabledDates();
    //   this.disabledDays();

    //   if (this.currentMonth() != undefined && this.currentMonth() != null && this.currentYear()) {
    //     this.createMonths(this.currentMonth, this.currentYear);
    //   }
    // });

    //! should be refactored
    effect(() => {
      this.showTime();

      if (this.currentHour() === undefined) {
        this.initTime(this.value || new Date());
      }
      this.updateInputfield();
    });

    //! should be refactored
    effect(() => {
      this.responsiveOptions();
      this.numberOfMonths();

      this.destroyResponsiveStyleElement();
      this.createResponsiveStyle();
    });
  }




  override ngOnInit() {
    this.attributeSelector = 'pn_id_' + crypto.randomUUID();
    this.panelId = `${this.attributeSelector}_panel`;

    const date = moment(this.InitialValue()) || moment();
    if (this.isJalali()) {
      this.currentMonth.set(date.jMonth());
      this.currentYear.set(date.jYear());
    }
    else {
      this.currentMonth.set(date.month());
      this.currentYear.set(date.year());
    }
    const yearRange = this.yearRange();
    if (this.yearNavigator() && yearRange) {

      const years = yearRange.split(':');
      const yearStart = parseInt(years[0]);
      const yearEnd = parseInt(years[1]);
      this.populateYearOptions(yearStart, yearEnd);
    }

    if (this.view() === 'date') {
      this.initTime(date.toDate());
      this.ticksTo1970 = (((1970 - 1) * 365 + Math.floor(1970 / 4) - Math.floor(1970 / 100) + Math.floor(1970 / 400)) * 24 * 60 * 60 * 10000000);

    }
    this.initialized = true;
  }

  override onAfterViewInit() {
    const contentViewChild = this.contentViewChild();
    if (this.inline()) {
      contentViewChild?.nativeElement.setAttribute(this.attributeSelector, '');
    } else {
      if (!this.$disabled() && this.overlay) {
        this.initFocusableCell();
        if (this.numberOfMonths() === 1) {
          if (contentViewChild && contentViewChild.nativeElement) {
            contentViewChild.nativeElement.style.width = DomHandler.getOuterWidth(this.el?.nativeElement) + 'px';
          }
        }
      }
    }
  }

  override onAfterViewChecked() {
    this.bindDirectiveInstance.setAttrs(this.ptms(['host', 'root']));
  }

  override ngAfterContentInit() {
    this.templates().forEach((item) => {
      switch (item.getType()) {
        case 'date':
          this._dateTemplate.set(item.template);
          break;

        case 'decade':
          this._decadeTemplate = item.template;
          break;

        case 'disabledDate':
          this._disabledDateTemplate = item.template;
          break;

        case 'header':
          this._headerTemplate = item.template;
          break;

        case 'inputicon':
          this._inputIconTemplate = item.template;
          break;

        case 'buttonbar':
          this._buttonBarTemplate = item.template;
          break;

        case 'previousicon':
          this._previousIconTemplate = item.template;
          break;

        case 'nexticon':
          this._nextIconTemplate = item.template;
          break;

        case 'triggericon':
          this._triggerIconTemplate = item.template;
          break;

        case 'clearicon':
          this._clearIconTemplate = item.template;
          break;

        case 'decrementicon':
          this._decrementIconTemplate = item.template;
          break;

        case 'incrementicon':
          this._incrementIconTemplate = item.template;
          break;

        case 'footer':
          this._footerTemplate = item.template;
          break;

        default:
          this._dateTemplate.set(item.template);
          break;
      }
    });
  }

  getTranslation(option: string) {
    return this.config.getTranslation(option);
  }

  populateYearOptions(start: number, end: number) {

    this.yearOptions = [];

    for (let i = start; i <= end; i++) {
      this.yearOptions.push(i);
    }
  }

  weekDays = computed(() => {
    this.view();
    let dayIndex = this.firstDayOfWeek();
    const weekDays = [];
    if (dayIndex) {
      for (let i = 0; i < 7; i++) {
        weekDays.push(this.locale().dayNamesMin[dayIndex]);
        dayIndex = dayIndex == 6 ? 0 : ++dayIndex;
      }
    }
    return weekDays;
  });

  yearPickerValues() {
    const yearPickerValues: any[] = [];
    const base = this.currentYear() - (this.currentYear() % 10);
    for (let i = 0; i < 10; i++) {
      yearPickerValues.push(base + i);
    }

    return yearPickerValues;
  }

  months = computed(() => {
    const currentYear = this.currentYear();
    const currentMonth = this.currentMonth();
    this.view();
    this.disabledDates();
    this.disabledDays();

    let months = [];
    for (let i = 0; i < this.numberOfMonths(); i++) {
      let m = (currentMonth ?? 0) + i;
      let y = currentYear;
      if (m > 11) {
        m = m % 12;
        y = currentYear + Math.floor((currentMonth + i) / 12);
      }

      months.push(this.createMonth(m, y));
    }
    return months;
  });

  getWeekNumber(date: Date) {
    const checkDate = new Date(date.getTime());
    if (this.startWeekFromFirstDayOfYear()) {
      const firstDayOfWeek: number = this.firstDayOfWeek();
      checkDate.setDate(checkDate.getDate() + 6 + firstDayOfWeek - checkDate.getDay());
    } else {
      checkDate.setDate(checkDate.getDate() + 4 - (checkDate.getDay() || 7));
    }
    const time = checkDate.getTime();
    checkDate.setMonth(0);
    checkDate.setDate(1);
    return Math.floor(Math.round((time - checkDate.getTime()) / 86400000) / 7) + 1;
  }

  createMonth(month: number, year: number): { month: number, year: number, dates: any[], weekNumbers: number[] } {

    const dates = [];
    const firstDay = this.getFirstDayOfMonthIndex(month, year);
    const daysLength = this.getDaysCountInMonth(month, year);
    const prevMonthDaysLength = this.getDaysCountInPrevMonth(month, year);
    let dayNo = 1;
    const today = new Date();
    const weekNumbers: number[] = [];
    const monthRows: number = Math.ceil((daysLength + firstDay) / 7);

    for (let i = 0; i < monthRows; i++) {
      const week: any[] = [];

      if (i == 0) {
        for (let j = (prevMonthDaysLength - firstDay + 1); j <= prevMonthDaysLength; j++) {
          const prev = this.getPreviousMonthAndYear(month, year);
          week.push({
            day: j,
            month: prev.month,
            year: prev.year,
            otherMonth: true,
            today: isToday(today, j, prev.month, prev.year),
            selectable: this.isSelectable(j, prev.month, prev.year, true)
          });
        }

        const remainingDaysLength = 7 - week.length;
        for (let j = 0; j < remainingDaysLength; j++) {
          week.push({
            day: dayNo,
            month: month,
            year: year,
            today: isToday(today, dayNo, month, year),
            selectable: this.isSelectable(dayNo, month, year, false)
          });
          dayNo++;
        }
      }
      else {
        for (let j = 0; j < 7; j++) {
          if (dayNo > daysLength) {
            const next = this.getNextMonthAndYear(month, year);
            week.push({
              day: dayNo - daysLength,
              month: next.month,
              year: next.year,
              otherMonth: true,
              today: isToday(today, dayNo - daysLength, next.month, next.year),
              selectable: this.isSelectable((dayNo - daysLength), next.month, next.year, true)
            });
          }
          else {
            week.push({
              day: dayNo,
              month: month,
              year: year,
              today: isToday(today, dayNo, month, year),
              selectable: this.isSelectable(dayNo, month, year, false)
            });
          }

          dayNo++;
        }
      }

      if (this.showWeek()) {
        (weekNumbers as number[]).push(this.getWeekNumber(new Date(week[0].year, week[0].month, week[0].day)));
      }

      dates.push(week);

    }

    return {
      month: month,
      year: year,
      dates: dates as any[],
      weekNumbers: weekNumbers
    };
  }

  initTime(date: Date | Date[] | string) {
    if (typeof this.value === 'string') {
      this.value = this.parseValueFromString(this.value);
    }

    if (isDate(date)) {
      this.pm = date.getHours() > 11;

      if (this.showTime()) {
        this.currentMinute.set(date.getMinutes());
        this.currentSecond.set(date.getSeconds());

        if (this.hourFormat() == '12')
          this.currentHour.set(date.getHours() == 0 ? 12 : date.getHours() % 12);
        else
          this.currentHour.set(date.getHours());
      }
      else if (this.timeOnly()) {
        this.currentMinute.set(0);
        this.currentHour.set(0);
        this.currentSecond.set(0);
      }

    } else if (isMoment(date)) {
      this.pm = date.hours() > 11;

      if (this.showTime()) {
        this.currentMinute.set(date.minutes());
        this.currentSecond.set(date.seconds());

        if (this.hourFormat() == '12')
          this.currentHour.set(date.hours() == 0 ? 12 : date.hours() % 12);
        else
          this.currentHour.set(date.hours());
      }
      else if (this.timeOnly()) {
        this.currentMinute.set(0);
        this.currentHour.set(0);
        this.currentSecond.set(0);
      }
    }

  }

  navBackward(event: Event | undefined) {
    if (this.$disabled()) {
      if (event) {
        event.preventDefault();
      }
      return;
    }

    this.isMonthNavigate.set(true);

    if (this.view() === 'month') {
      this.decrementYear();
      setTimeout(() => {
        this.updateFocus();
      }, 1);
    } else if (this.view() === 'year') {
      this.decrementDecade();
      setTimeout(() => {
        this.updateFocus();
      }, 1);
    } else {
      if (this.currentMonth() === 0) {
        this.currentMonth.set(11);
        this.decrementYear();
      } else {
        this.currentMonth.update(month => month - 1);
      }

      this.onMonthChange.emit({ month: this.currentMonth() + 1, year: this.currentYear() });
      // this.createMonths(this.currentMonth, this.currentYear);
    }
  }

  navForward(event: Event | undefined) {
    if (this.$disabled()) {
      if (event) {
        event.preventDefault();
      }
      return;
    }

    this.isMonthNavigate.set(true);

    if (this.view() === 'month') {
      this.incrementYear();
      setTimeout(() => {
        this.updateFocus();
      }, 1);
    } else if (this.view() === 'year') {
      this.incrementDecade();
      setTimeout(() => {
        this.updateFocus();
      }, 1);
    } else {
      if (this.currentMonth() === 11) {
        this.currentMonth.set(0);
        this.incrementYear();
      } else {
        this.currentMonth.update(month => month + 1);
      }

      this.onMonthChange.emit({ month: this.currentMonth() + 1, year: this.currentYear() });
      // this.createMonths(this.currentMonth, this.currentYear);
    }
  }

  decrementYear() {

    this.currentYear.update(year => year - 1);
    const yearOptions = this.yearOptions;


    if (yearOptions && yearOptions.length > 0 && this.yearNavigator() && this.currentYear() < yearOptions[0]) {
      const difference = yearOptions[yearOptions.length - 1] - yearOptions[0];
      this.populateYearOptions(yearOptions[0] - difference, yearOptions[yearOptions.length - 1] - difference);
    }
  }

  incrementYear() {
    this.currentYear.update(year => year + 1);
    const yearOptions = this.yearOptions;

    if (yearOptions && yearOptions.length > 0 && this.yearNavigator() && this.currentYear() > yearOptions[yearOptions.length - 1]) {
      const difference = yearOptions[yearOptions.length - 1] - yearOptions[0];
      this.populateYearOptions(yearOptions[0] + difference, yearOptions[yearOptions.length - 1] + difference);
    }
  }

  decrementDecade() {
    this.currentYear.update(year => year - 10);
  }

  incrementDecade() {
    this.currentYear.update(year => year + 10);
  }

  switchToMonthView(event: Event) {
    this.setCurrentView('month');
    event.preventDefault();
  }

  switchToYearView(event: Event) {
    this.setCurrentView('year');
    event.preventDefault();
  }


  onDateSelect(event: Event, dateMeta: DateMeta) {
    if (this.$disabled() || !dateMeta.selectable) {
      event.preventDefault();
      return;
    }

    if (isDateArray(this.value) && this.isMultipleSelection() && this.isSelected(dateMeta)) {
      this.value = this.value?.filter((date: Date) => {
        return !isDateEquals(date, dateMeta);
      });
      if (this.value?.length === 0) {
        this.value = null;
      }
      this.updateModel(this.value);
    } else {
      if (this.shouldSelectDate()) {
        this.selectDate(dateMeta);
      }
    }

    if (this.hideOnDateTimeSelect() && (this.isSingleSelection() || (this.isRangeSelection() && isDateArray(this.value) && this.value[1]))) {
      setTimeout(() => {
        event.preventDefault();
        this.hideOverlay();

        if (this.mask()) {
          this.disableModality();
        }

        this.cd.markForCheck();
      }, 150);
    }

    this.updateInputfield();
    event.preventDefault();
  }

  shouldSelectDate(): boolean {
    const maxDateCount = this.maxDateCount();
    if (this.isMultipleSelection() && isDateArray(this.value))
      return !maxDateCount || !this.value || (!!maxDateCount && maxDateCount > this.value.length);
    else
      return true;
  }

  onMonthSelect(event: Event, index: number) {
    if (this.view() === 'month') {
      this.onDateSelect(event, { year: this.currentYear(), month: index, day: 1, selectable: true });
    } else {
      this.currentMonth.set(index);
      // this.createMonths(this.currentMonth, this.currentYear);
      this.setCurrentView('date');
      this.onMonthChange.emit({ month: this.currentMonth() + 1, year: this.currentYear() });
    }
  }

  onYearSelect(event: Event, year: number) {
    if (this.view() === 'year') {
      this.onDateSelect(event, { year: year, month: 0, day: 1, selectable: true });
    } else {
      this.currentYear.set(year);
      this.setCurrentView('month');
      this.onYearChange.emit({ month: this.currentMonth() + 1, year: this.currentYear() });
    }
  }

  updateInputfield() {

    let formattedValue = '';

    if (this.value) {
      if (this.isSingleSelection()) {
        formattedValue = this.formatDateTime(this.value);
      }
      else if (this.isMultipleSelection() && isDateArray(this.value)) {
        for (let i = 0; i < this.value.length; i++) {
          const dateAsString = this.formatDateTime(this.value[i]);
          formattedValue += dateAsString;
          if (i !== (this.value.length - 1)) {
            formattedValue += this.multipleSeparator + ' ';
          }
        }
      }
      else if (this.isRangeSelection() && isDateArray(this.value)) {
        if (this.value && this.value.length) {
          const startDate = this.value[0];
          const endDate = this.value[1];

          formattedValue = this.formatDateTime(startDate);
          if (endDate) {
            formattedValue += ' ' + this.rangeSeparator + ' ' + this.formatDateTime(endDate);
          }
        }
      }
    }
    this.writeModelValue(formattedValue);

    this.inputFieldValue.set(formattedValue);
    // this.updateFilledState();
    const inputfieldViewChild = this.inputfieldViewChild();
    if (inputfieldViewChild && inputfieldViewChild.nativeElement) {
      inputfieldViewChild.nativeElement.value = this.inputFieldValue();
    }
  }

  formatDateTime(date: any) {
    let formattedValue = this.keepInvalid() ? date : null;
    const isDateValid = this.isValidDateForTimeConstraints(date);

    if (isValidDate(date)) {
      if (this.timeOnly()) {
        formattedValue = this.formatTime(date);
      } else {
        formattedValue = this.formatDate(date, this.getDateFormat());
        if (this.showTime()) {
          formattedValue += ' ' + this.formatTime(date);
        }
      }
    } else if (this.dataType() === 'string') {
      formattedValue = date;
    }
    formattedValue = isDateValid ? formattedValue : '';
    return formattedValue;
  }

  formatDateKey(date: Date): string {
    return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
  }

  formatDataAndMetaData(date: any) {

    return this.formatDateKey(formatDateMetaToDate(date));
  }

  setCurrentHourPM(hours: number) {
    if (this.hourFormat() == '12') {
      this.pm = hours > 11;
      if (hours >= 12) {
        this.currentHour.set(hours == 12 ? 12 : hours - 12);
      } else {
        this.currentHour.set(hours == 0 ? 12 : hours);
      }
    } else {
      this.currentHour.set(hours);
    }
  }

  setCurrentView(currentView: DatePickerTypeView) {
    this.view.set(currentView);
    this.cd.detectChanges();
    this.alignOverlay();
  }

  selectDate(dateMeta: DateMeta) {
    const date = formatDateMetaToDate(dateMeta);

    if (this.showTime()) {
      if (this.hourFormat() == '12') {
        if (this.currentHour() === 12) date.setHours(this.pm ? 12 : 0);
        else date.setHours(this.pm ? this.currentHour() + 12 : this.currentHour());
      } else {
        date.setHours(this.currentHour());
      }

      date.setMinutes(this.currentMinute());
      date.setSeconds(this.currentSecond());
    }

    const minDate = this.minDate();
    if (minDate && minDate > date) {
      this.setCurrentHourPM(minDate.getHours());
      this.currentMinute.set(minDate.getMinutes());
      this.currentSecond.set(minDate.getSeconds());
    }

    const maxDate = this.maxDate();
    if (maxDate && maxDate < date) {
      this.setCurrentHourPM(maxDate.getHours());
      this.currentMinute.set(maxDate.getMinutes());
      this.currentSecond.set(maxDate.getSeconds());
    }

    if (this.isSingleSelection()) {
      this.updateModel(date);
    } else if (isDateArray(this.value) && this.isMultipleSelection()) {
      this.updateModel(this.value ? [...this.value, date] : [date]);
    } else if (this.isRangeSelection()) {
      if (this.value && isDateArray(this.value)) {
        let startDate = this.value[0];
        let endDate = this.value[1];

        if (!endDate && date.getTime() >= startDate.getTime()) {
          endDate = date;
        } else {
          startDate = date;
          // endDate = null;
        }

        this.updateModel([startDate, endDate]);
      } else {
        this.updateModel([date, null]);
      }
    }

    this.onSelect.emit(date);
  }

  updateModel(value: any) {
    this.value = value;

    if (this.dataType() == 'date') {
      this.writeModelValue(this.value);
      this.onModelChange(this.value);
    } else if (this.dataType() == 'string') {
      if (this.isSingleSelection()) {
        this.onModelChange(this.formatDateTime(this.value));
      } else {
        let stringArrValue: any[] | null = null;
        if (isDateArray(this.value)) {
          stringArrValue = this.value.map((date: Date) => this.formatDateTime(date));
        }
        this.writeModelValue(stringArrValue);
        this.onModelChange(stringArrValue);
      }
    }
  }

  getFirstDayOfMonthIndex(month: number, year: number) {

    if (this.isJalali()) {
      const day = moment();
      day.jDate(1);
      day.jMonth(month);
      day.jYear(year);
      const dayIndex = day.jDay() + this.getSundayIndex();
      return dayIndex >= 7 ? dayIndex - 7 : dayIndex;
    }
    else {
      const day = new Date();
      day.setDate(1);
      day.setMonth(month);
      day.setFullYear(year);
      const dayIndex = day.getDay() + this.getSundayIndex();
      return dayIndex >= 7 ? dayIndex - 7 : dayIndex;
    }
  }

  getDaysCountInMonth(month: number, year: number) {

    if (this.isJalali()) {
      const newDate = moment().jYear(year).jMonth(month).jDate(32);

      const temp = this.daylightSavingAdjust(newDate).jDate();

      return 32 - temp;
    }
    else {
      const newDate = moment().year(year).month(month).date(32);

      const temp = this.daylightSavingAdjust(newDate).date();

      return 32 - temp;
    }
  }

  getDaysCountInPrevMonth(month: number, year: number) {
    const prev = this.getPreviousMonthAndYear(month, year);
    return this.getDaysCountInMonth(prev.month, prev.year);
  }

  getPreviousMonthAndYear(month: number, year: number) {

    let m: number, y: number;

    if (month === 0) {
      m = 11;
      y = year - 1;
    }
    else {
      m = month - 1;
      y = year;
    }

    return { 'month': m, 'year': y };
  }

  getNextMonthAndYear(month: number, year: number) {

    let m, y;

    if (month === 11) {
      m = 0;
      y = year + 1;
    }
    else {
      m = month + 1;
      y = year;
    }

    return { 'month': m, 'year': y };
  }

  getSundayIndex() {
    const firstDayOfWeek = this.firstDayOfWeek();
    if (firstDayOfWeek) {
      return firstDayOfWeek > 0 ? 7 - firstDayOfWeek : 0;
    }
    return 0;

  }

  isSelected(dateMeta: DateMeta): boolean {
    if (this.value) {
      if (this.isSingleSelection()) {
        return isDateEquals(this.value, dateMeta);
      }
      else if (isDateArray(this.value) && this.isMultipleSelection()) {
        let selected = false;
        for (const date of this.value) {
          selected = isDateEquals(date, dateMeta);
          if (selected) {
            break;
          }
        }
        return selected;
      }
      else if (isDateArray(this.value) && this.isRangeSelection()) {
        if (this.value[1])
          return isDateEquals(this.value[0], dateMeta) || isDateEquals(this.value[1], dateMeta) || isDateBetween(this.value[0], this.value[1], dateMeta);
        else
          return isDateEquals(this.value[0], dateMeta)
      }
    }
    return false;
  }

  isComparable() {
    return this.value != null && typeof this.value !== 'string';
  }

  isMonthSelected(month: number): boolean {
    if (!this.isComparable()) return false;

    if (!this.value) {
      return false;
    }

    //! should be refactored
    if (this.isMultipleSelection() && isDateArray(this.value)) {
      return this.value?.some((currentValue: any) => currentValue.getMonth() === month && currentValue.getFullYear() === this.currentYear());
    } else if (this.isRangeSelection()) {
      if (isDateArray(this.value) && !this.value[1]) {
        return this.value[0]?.getFullYear() === this.currentYear() && this.value[0]?.getMonth() === month;
      } else {
        const currentDate = new Date(this.currentYear(), month, 1);
        const startDate = isDateArray(this.value) ? new Date(this.value[0].getFullYear(), this.value[0].getMonth(), 1) : new Date();
        const endDate = isDateArray(this.value) ? new Date(this.value[1].getFullYear(), this.value[1].getMonth(), 1) : new Date();

        return currentDate >= startDate && currentDate <= endDate;
      }
    } else {

      if (this.isJalali() && isMoment(this.value)) {
        return this.value ? (this.value.jMonth() === month && this.value.jYear() === this.currentYear()) : false;
      } else {
        return isDate(this.value) ? (this.value.getMonth() === month && this.value.getFullYear() === this.currentYear()) : false;
      }

    }
  }

  isMonthDisabled(month: number, year?: number) {
    const yearToCheck = year ?? this.currentYear();

    for (let day = 1; day < this.getDaysCountInMonth(month, yearToCheck) + 1; day++) {
      if (this.isSelectable(day, month, yearToCheck, false)) {
        return false;
      }
    }
    return true;
  }

  isYearDisabled(year: number) {
    return Array(12)
      .fill(0)
      .every((_, month) => this.isMonthDisabled(month, year));
  }

  isYearSelected(year: number) {
    if (this.isComparable()) {
      const value = (this.isRangeSelection() && isDateArray(this.value)) ? this.value[0] : this.value;

      return (!this.isMultipleSelection() && isDate(value)) ? value.getFullYear() === year : false;
    }

    return false;
  }

  isSingleSelection(): boolean {
    return this.selectionMode() === 'single';
  }

  isRangeSelection(): boolean {
    return this.selectionMode() === 'range';
  }

  isMultipleSelection(): boolean {
    return this.selectionMode() === 'multiple';
  }

  isSelectable(day: number, month: number, year: number, otherMonth: any): boolean {
    let validMin = true;
    let validMax = true;
    let validDate = true;
    let validDay = true;

    if (otherMonth && !this.selectOtherMonths()) {
      return false;
    }
    const minDate = this.minDate();
    if (minDate) {
      if (this.isJalali()) {
        if (minDate.getFullYear() > year) {
          validMin = false;
        }
        else if (minDate.getFullYear() === year) {
          if (minDate.getMonth() > month) {
            validMin = false;
          }
          else if (minDate.getMonth() === month) {
            if (minDate.getDate() > day) {
              validMin = false;
            }
          }
        }
      }
      else {
        if (minDate.getFullYear() > year) {
          validMin = false;
        }
        else if (minDate.getFullYear() === year) {
          if (minDate.getMonth() > month) {
            validMin = false;
          }
          else if (minDate.getMonth() === month) {
            if (minDate.getDate() > day) {
              validMin = false;
            }
          }
        }
      }

    }
    const maxDate = this.maxDate();
    if (maxDate) {
      if (this.isJalali()) {
        if (maxDate.getFullYear() < year) {
          validMax = false;
        }
        else if (maxDate.getFullYear() === year) {
          if (maxDate.getMonth() < month) {
            validMax = false;
          }
          else if (maxDate.getMonth() === month) {
            if (maxDate.getDate() < day) {
              validMax = false;
            }
          }
        }
      }
      else {
        if (this.isJalali()) {
          if (maxDate.getFullYear() < year) {
            validMax = false;
          }
          else if (maxDate.getFullYear() === year) {
            if (maxDate.getMonth() < month) {
              validMax = false;
            }
            else if (maxDate.getMonth() === month) {
              if (maxDate.getDate() < day) {
                validMax = false;
              }
            }
          }
        }
      }

    }

    if (this.disabledDates()) {
      validDate = !this.isDateDisabled(day, month, year);
    }

    if (this.disabledDays()) {
      validDay = !this.isDayDisabled(day, month, year)
    }

    return validMin && validMax && validDate && validDay;
  }

  isDateDisabled(day: number, month: number, year: number): boolean {
    if (this.disabledDates()) {
      for (const disabledDate of this.disabledDates()) {
        if (this.isJalali()) {
          if (disabledDate.getFullYear() === year && disabledDate.getMonth() === month && disabledDate.getDate() === day) {
            return true;
          }
        }
        else {
          if (disabledDate.getFullYear() === year && disabledDate.getMonth() === month && disabledDate.getDate() === day) {
            return true;
          }
        }

      }
    }

    return false;
  }

  isDayDisabled(day: number, month: number, year: number): boolean {
    if (this.disabledDays()) {
      const weekday = moment([year, month, day]);
      if (this.isJalali()) {
        const weekdayNumber = weekday.jDay();
        return this.disabledDays().indexOf(weekdayNumber) !== -1;
      } else {
        const weekdayNumber = weekday.day();
        return this.disabledDays().indexOf(weekdayNumber) !== -1;
      }


    }
    return false;
  }

  onInputFocus(event: Event) {
    this.focus = true;
    if (this.showOnFocus()) {
      this.showOverlay();
    }
    this.onFocus.emit(event);
  }

  onInputClick() {
    //! should be refactored
    this.datepickerClick = true;
    if (this.overlay && this.autoZIndex()) {
      this.overlay.style.zIndex = String(this.baseZIndex() + (++DomHandler.zindex));
    }
    if (this.showOnFocus() && !this.overlayVisible()) {
      this.showOverlay();
    }
  }

  onInputBlur(event: Event) {

    this.focus = false;
    this.onBlur.emit(event);
    if (!this.keepInvalid()) {
      this.updateInputfield();
    }
    this.onModelTouched();
  }

  onButtonClick(event: Event, inputfield: HTMLInputElement) {
    event.preventDefault();
    if (this.$disabled()) {
      return;
    }
    if (!this.overlayVisible()) {
      inputfield.focus();
      this.showOverlay();
    }
    else {
      this.hideOverlay();
    }
  }

  clear() {
    this.value = null;
    this.inputFieldValue.set(null);
    this.writeModelValue(this.value);
    this.onModelChange(this.value);
    this.updateInputfield();
    this.onClear.emit(null);
  }

  onOverlayClick(event: Event) {
    this.overlayService.add({
      originalEvent: event,
      target: this.el.nativeElement
    });
  }

  getMonthName(index: number) {
    //! should be refactored
    return this.config.getTranslation('monthNames')[index];
  }

  getYear(month: any) {
    return this.view() === 'month' ? this.currentYear() : month.year;
  }

  switchViewButtonDisabled() {
    return this.numberOfMonths() > 1 || this.$disabled();
  }

  onPrevButtonClick(event: Event) {
    this.navigationState = { backward: true, button: true };
    this.navBackward(event);
  }

  onNextButtonClick(event: Event) {
    this.navigationState = { backward: false, button: true };
    this.navForward(event);
  }

  onContainerButtonKeydown(event: KeyboardEvent) {
    console.log(event, '#######################')
    switch (event.which) {
      //tab
      case 9:
        if (!this.inline()) {
          this.trapFocus(event);
        }
        if (this.inline()) {
          const headerElements = DomHandler.findSingle(this.el?.nativeElement, '.p-datepicker-header');
          const element = event.target;
          if (this.timeOnly()) {
            return;
          } else {
            if (headerElements?.children && element == headerElements.children[headerElements.children.length! - 1]) {
              this.initFocusableCell();
            }
          }
        }
        break;

      //escape
      case 27:
        this.inputfieldViewChild()?.nativeElement.focus();
        this.overlayVisible.set(false);
        event.preventDefault();
        break;

      default:
        //Noop
        break;
    }
  }


  onInputKeydown(event: KeyboardEvent) {
    this.isKeydown = true;
    if (event.keyCode === 40 && this.contentViewChild()) {
      this.trapFocus(event);
    } else if (event.keyCode === 27) {
      if (this.overlayVisible()) {
        this.inputfieldViewChild()?.nativeElement.focus();
        this.overlayVisible.set(false);
        event.preventDefault();
      }
    } else if (event.keyCode === 13) {
      if (this.overlayVisible()) {
        this.overlayVisible.set(false);
        event.preventDefault();
      }
    } else if (event.keyCode === 9 && this.contentViewChild()) {
      DomHandler.getFocusableElements(this.contentViewChild()?.nativeElement).forEach((el: any) => (el.tabIndex = '-1'));
      if (this.overlayVisible()) {
        this.overlayVisible.set(false);
      }
    }
  }

  onDateCellKeydown(event: any, dateMeta: DateMeta, groupIndex: number) {
    const cellContent = event.currentTarget;
    const cell = cellContent.parentElement;
    const currentDate = formatDateMetaToDate(dateMeta);
    switch (event.which) {
      //down arrow
      case 40: {
        cellContent.tabIndex = '-1';
        const cellIndex = getIndex(cell);
        const nextRow = cell.parentElement.nextElementSibling;
        if (nextRow) {
          const focusCell = nextRow.children[cellIndex].children[0];
          if (hasClass(focusCell, 'p-disabled')) {
            this.navigationState = { backward: false };
            this.navForward(event);
          } else {
            nextRow.children[cellIndex].children[0].tabIndex = '0';
            nextRow.children[cellIndex].children[0].focus();
          }
        } else {
          this.navigationState = { backward: false };
          this.navForward(event);
        }
        event.preventDefault();
        break;
      }

      //up arrow
      case 38: {
        cellContent.tabIndex = '-1';
        const cellIndex = getIndex(cell);
        const prevRow = cell.parentElement.previousElementSibling;
        if (prevRow) {
          const focusCell = prevRow.children[cellIndex].children[0];
          if (hasClass(focusCell, 'p-disabled')) {
            this.navigationState = { backward: true };
            this.navBackward(event);
          } else {
            focusCell.tabIndex = '0';
            focusCell.focus();
          }
        } else {
          this.navigationState = { backward: true };
          this.navBackward(event);
        }
        event.preventDefault();
        break;
      }

      //left arrow
      case 37: {
        cellContent.tabIndex = '-1';
        const prevCell = cell.previousElementSibling;
        if (prevCell) {
          const focusCell = prevCell.children[0];
          if (hasClass(focusCell, 'p-disabled') || hasClass(focusCell.parentElement, 'p-datepicker-weeknumber')) {
            this.navigateToMonth(true, groupIndex);
          } else {
            focusCell.tabIndex = '0';
            focusCell.focus();
          }
        } else {
          this.navigateToMonth(true, groupIndex);
        }
        event.preventDefault();
        break;
      }

      //right arrow
      case 39: {
        cellContent.tabIndex = '-1';
        const nextCell = cell.nextElementSibling;
        if (nextCell) {
          const focusCell = nextCell.children[0];
          if (hasClass(focusCell, 'p-disabled')) {
            this.navigateToMonth(false, groupIndex);
          } else {
            focusCell.tabIndex = '0';
            focusCell.focus();
          }
        } else {
          this.navigateToMonth(false, groupIndex);
        }
        event.preventDefault();
        break;
      }

      //enter
      //space
      case 13:
      case 32: {
        this.onDateSelect(event, dateMeta);
        event.preventDefault();
        break;
      }

      //escape
      case 27: {
        this.inputfieldViewChild()?.nativeElement.focus();
        this.overlayVisible.set(false);
        event.preventDefault();
        break;
      }

      //tab
      case 9: {
        if (!this.inline()) {
          this.trapFocus(event);
        }
        break;
      }

      // page up
      case 33: {
        cellContent.tabIndex = '-1';
        const dateToFocus = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, currentDate.getDate());
        const focusKey = this.formatDateKey(dateToFocus);
        this.navigateToMonth(true, groupIndex, `span[data-date='${focusKey}']:not(.p-disabled):not(.p-ink)`);
        event.preventDefault();
        break;
      }

      // page down
      case 34: {
        cellContent.tabIndex = '-1';
        const dateToFocus = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, currentDate.getDate());
        const focusKey = this.formatDateKey(dateToFocus);
        this.navigateToMonth(false, groupIndex, `span[data-date='${focusKey}']:not(.p-disabled):not(.p-ink)`);
        event.preventDefault();
        break;
      }

      //home
      case 36: {
        cellContent.tabIndex = '-1';
        const firstDayDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const firstDayDateKey = this.formatDateKey(firstDayDate);
        const firstDayCell = DomHandler.findSingle(cellContent.offsetParent, `span[data-date='${firstDayDateKey}']:not(.p-disabled):not(.p-ink)`);
        if (firstDayCell) {
          firstDayCell.tabIndex = '0';
          firstDayCell.focus();
        }
        event.preventDefault();
        break;
      }
      //end
      case 35: {
        cellContent.tabIndex = '-1';
        const lastDayDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
        const lastDayDateKey = this.formatDateKey(lastDayDate);
        const lastDayCell = DomHandler.findSingle(cellContent.offsetParent, `span[data-date='${lastDayDateKey}']:not(.p-disabled):not(.p-ink)`);
        if (lastDayDate) {
          lastDayCell.tabIndex = '0';
          lastDayCell.focus();
        }
        event.preventDefault();
        break;
      }
      default:
        //no op
        break;
    }
  }

  onMonthCellKeydown(event: any, index: number) {
    const cell = event.currentTarget;
    switch (event.which) {
      //arrows
      case 38:
      case 40: {
        cell.tabIndex = '-1';
        const cells = cell.parentElement.children;
        const cellIndex = getIndex(cell);
        const nextCell = cells[event.which === 40 ? cellIndex + 3 : cellIndex - 3];
        if (nextCell) {
          nextCell.tabIndex = '0';
          nextCell.focus();
        }
        event.preventDefault();
        break;
      }

      //left arrow
      case 37: {
        cell.tabIndex = '-1';
        const prevCell = cell.previousElementSibling;
        if (prevCell) {
          prevCell.tabIndex = '0';
          prevCell.focus();
        } else {
          this.navigationState = { backward: true };
          this.navBackward(event);
        }

        event.preventDefault();
        break;
      }

      //right arrow
      case 39: {
        cell.tabIndex = '-1';
        const nextCell = cell.nextElementSibling;
        if (nextCell) {
          nextCell.tabIndex = '0';
          nextCell.focus();
        } else {
          this.navigationState = { backward: false };
          this.navForward(event);
        }

        event.preventDefault();
        break;
      }

      //enter
      //space
      case 13:
      case 32: {
        this.onMonthSelect(event, index);
        event.preventDefault();
        break;
      }

      //escape
      case 27: {
        this.inputfieldViewChild()?.nativeElement.focus();
        this.overlayVisible.set(false);
        event.preventDefault();
        break;
      }

      //tab
      case 9: {
        if (!this.inline()) {
          this.trapFocus(event);
        }
        break;
      }

      default:
        //no op
        break;
    }
  }

  onYearCellKeydown(event: any, index: number) {
    const cell = event.currentTarget;

    switch (event.which) {
      //arrows
      case 38:
      case 40: {
        cell.tabIndex = '-1';
        const cells = cell.parentElement.children;
        const cellIndex = getIndex(cell);
        const nextCell = cells[event.which === 40 ? cellIndex + 2 : cellIndex - 2];
        if (nextCell) {
          nextCell.tabIndex = '0';
          nextCell.focus();
        }
        event.preventDefault();
        break;
      }

      //left arrow
      case 37: {
        cell.tabIndex = '-1';
        const prevCell = cell.previousElementSibling;
        if (prevCell) {
          prevCell.tabIndex = '0';
          prevCell.focus();
        } else {
          this.navigationState = { backward: true };
          this.navBackward(event);
        }

        event.preventDefault();
        break;
      }

      //right arrow
      case 39: {
        cell.tabIndex = '-1';
        const nextCell = cell.nextElementSibling;
        if (nextCell) {
          nextCell.tabIndex = '0';
          nextCell.focus();
        } else {
          this.navigationState = { backward: false };
          this.navForward(event);
        }

        event.preventDefault();
        break;
      }

      //enter
      //space
      case 13:
      case 32: {
        this.onYearSelect(event, index);
        event.preventDefault();
        break;
      }

      //escape
      case 27: {
        this.inputfieldViewChild()?.nativeElement.focus();
        this.overlayVisible.set(false);
        event.preventDefault();
        break;
      }

      //tab
      case 9: {
        this.trapFocus(event);
        break;
      }

      default:
        //no op
        break;
    }
  }

  navigateToMonth(prev: boolean, groupIndex: number, focusKey?: string) {
    if (prev) {
      if (this.numberOfMonths() === 1 || groupIndex === 0) {
        this.navigationState = { backward: true };
        this._focusKey = focusKey;
        this.navBackward(event);
      } else {
        const prevMonthContainer = this.contentViewChild()?.nativeElement.children[groupIndex - 1];
        if (focusKey) {
          const firstDayCell = DomHandler.findSingle(prevMonthContainer, focusKey);
          firstDayCell.tabIndex = '0';
          firstDayCell.focus();
        } else {
          const cells = DomHandler.find(prevMonthContainer, '.p-datepicker-calendar td span:not(.p-disabled):not(.p-ink)');
          const focusCell = cells[cells.length - 1];
          focusCell.tabIndex = '0';
          focusCell.focus();
        }
      }
    } else {
      if (this.numberOfMonths() === 1 || groupIndex === this.numberOfMonths() - 1) {
        this.navigationState = { backward: false };
        this._focusKey = focusKey;
        this.navForward(event);
      } else {
        const nextMonthContainer = this.contentViewChild()?.nativeElement.children[groupIndex + 1];
        if (focusKey) {
          const firstDayCell = DomHandler.findSingle(nextMonthContainer, focusKey);
          firstDayCell.tabIndex = '0';
          firstDayCell.focus();
        } else {
          const focusCell = DomHandler.findSingle(nextMonthContainer, '.p-datepicker-calendar td span:not(.p-disabled):not(.p-ink)');
          focusCell.tabIndex = '0';
          focusCell.focus();
        }
      }
    }
  }

  updateFocus() {
    let cell;

    if (this.navigationState) {
      if (this.navigationState.button) {
        this.initFocusableCell();

        if (this.navigationState.backward) (DomHandler.findSingle(this.contentViewChild()?.nativeElement, '.p-datepicker-prev-button') as any).focus();
        else (DomHandler.findSingle(this.contentViewChild()?.nativeElement, '.p-datepicker-next-button') as any).focus();
      } else {
        if (this.navigationState.backward) {
          let cells;

          if (this.view() === 'month') {
            cells = DomHandler.find(this.contentViewChild()?.nativeElement, '.p-datepicker-month-view .p-datepicker-month:not(.p-disabled)');
          } else if (this.view() === 'year') {
            cells = DomHandler.find(this.contentViewChild()?.nativeElement, '.p-datepicker-year-view .p-datepicker-year:not(.p-disabled)');
          } else {
            cells = DomHandler.find(this.contentViewChild()?.nativeElement, this._focusKey || '.p-datepicker-calendar td span:not(.p-disabled):not(.p-ink)');
          }

          if (cells && cells.length > 0) {
            cell = cells[cells.length - 1];
          }
        } else {
          if (this.view() === 'month') {
            cell = DomHandler.findSingle(this.contentViewChild()?.nativeElement, '.p-datepicker-month-view .p-datepicker-month:not(.p-disabled)');
          } else if (this.view() === 'year') {
            cell = DomHandler.findSingle(this.contentViewChild()?.nativeElement, '.p-datepicker-year-view .p-datepicker-year:not(.p-disabled)');
          } else {
            cell = DomHandler.findSingle(this.contentViewChild()?.nativeElement, this._focusKey || '.p-datepicker-calendar td span:not(.p-disabled):not(.p-ink)');
          }
        }

        if (cell) {
          cell.tabIndex = '0';
          cell.focus();
        }
      }

      this.navigationState = null;
      this._focusKey = null;
    } else {
      this.initFocusableCell();
    }
  }

  initFocusableCell() {
    const contentEl = this.contentViewChild()?.nativeElement;
    let cell!: any;

    if (contentEl) {
      if (this.view() === 'month') {
        const cells = DomHandler.find(contentEl, '.p-datepicker-month-view .p-datepicker-month:not(.p-disabled)');
        const selectedCell = DomHandler.findSingle(contentEl, '.p-datepicker-month-view .p-datepicker-month.p-highlight');
        cells.forEach((cell: any) => (cell.tabIndex = -1));
        cell = selectedCell || cells[0];

        if (cells.length === 0) {
          const disabledCells = DomHandler.find(contentEl, '.p-datepicker-month-view .p-datepicker-month.p-disabled[tabindex = "0"]');
          disabledCells.forEach((cell: any) => (cell.tabIndex = -1));
        }
      } else if (this.view() === 'year') {
        const cells = DomHandler.find(contentEl, '.p-datepicker-year-view .p-datepicker-year:not(.p-disabled)');
        const selectedCell = DomHandler.findSingle(contentEl, '.p-datepicker-year-view .p-datepicker-year.p-highlight');
        cells.forEach((cell: any) => (cell.tabIndex = -1));
        cell = selectedCell || cells[0];

        if (cells.length === 0) {
          const disabledCells = DomHandler.find(contentEl, '.p-datepicker-year-view .p-datepicker-year.p-disabled[tabindex = "0"]');
          disabledCells.forEach((cell: any) => (cell.tabIndex = -1));
        }
      } else {
        cell = DomHandler.findSingle(contentEl, 'span.p-highlight');
        if (!cell) {
          const todayCell = DomHandler.findSingle(contentEl, 'td.p-datepicker-today span:not(.p-disabled):not(.p-ink)');
          if (todayCell) cell = todayCell;
          else cell = DomHandler.findSingle(contentEl, '.p-datepicker-calendar td span:not(.p-disabled):not(.p-ink)');
        }
      }
    }

    if (cell) {
      cell.tabIndex = '0';

      if (!this.preventFocus && (!this.navigationState || !this.navigationState.button)) {
        setTimeout(() => {
          if (!this.$disabled()) {
            cell.focus();
          }
        }, 1);
      }

      this.preventFocus = false;
    }
  }

  trapFocus(event: any) {
    const focusableElements = DomHandler.getFocusableElements(this.contentViewChild()?.nativeElement);

    if (focusableElements && focusableElements.length > 0) {
      if (!focusableElements[0].ownerDocument.activeElement) {
        focusableElements[0].focus();
      } else {
        const focusedIndex = focusableElements.indexOf(focusableElements[0].ownerDocument.activeElement);

        if (event.shiftKey) {
          if (focusedIndex == -1 || focusedIndex === 0) {
            if (this.focusTrap()) {
              focusableElements[focusableElements.length - 1].focus();
            } else {
              if (focusedIndex === -1) return this.hideOverlay();
              else if (focusedIndex === 0) return;
            }
          } else {
            focusableElements[focusedIndex - 1].focus();
          }
        } else {
          if (focusedIndex == -1) {
            if (this.timeOnly()) {
              focusableElements[0].focus();
            } else {
              let spanIndex = 0;

              for (let i = 0; i < focusableElements.length; i++) {
                if (focusableElements[i].tagName === 'SPAN') spanIndex = i;
              }

              focusableElements[spanIndex].focus();
            }
          } else if (focusedIndex === focusableElements.length - 1) {
            if (!this.focusTrap && focusedIndex != -1) return this.hideOverlay();

            focusableElements[0].focus();
          } else {
            focusableElements[focusedIndex + 1].focus();
          }
        }
      }
    }

    event.preventDefault();
  }

  onMonthDropdownChange(event: Event) {
    const m = (event.target as HTMLInputElement).value;
    this.currentMonth.set(parseInt(m));
    this.onMonthChange.emit({ month: this.currentMonth() + 1, year: this.currentYear() });
    // this.createMonths(this.currentMonth, this.currentYear);
  }

  onYearDropdownChange(event: Event) {
    const y = (event.target as HTMLInputElement).value;
    this.currentYear.set(parseInt(y));
    this.onYearChange.emit({ month: this.currentMonth() + 1, year: this.currentYear() });
    // this.createMonths(this.currentMonth, this.currentYear);
  }

  convertTo24Hour(hours: number, pm: boolean): number {
    if (this.hourFormat() == '12') {
      if (hours === 12) {
        return pm ? 12 : 0;
      } else {
        return pm ? hours + 12 : hours;
      }
    }
    return hours;
  }

  constrainTime(hour: number, minute: number, second: number, pm: boolean): number[] {
    const returnTimeTriple: number[] = [hour, minute, second];
    let minHoursExceeds12: boolean = false;
    let value = this.value;
    const convertedHour = this.convertTo24Hour(hour, pm);
    const isRange = this.isRangeSelection(),
      isMultiple = this.isMultipleSelection(),
      isMultiValue = isRange || isMultiple;

    if (isMultiValue) {
      if (!this.value) {
        this.value = [new Date(), new Date()];
      }
      if (isDateArray(this.value) && isRange) {
        value = this.value[1] || this.value[0];
        value = this.value[this.value.length - 1];
      }
    }
    const valueDateString = (value && isDate(value)) ? value.toDateString() : null;
    const isMinDate = this.minDate() && valueDateString && this.minDate()?.toDateString() === valueDateString;
    const isMaxDate = this.maxDate() && valueDateString && this.maxDate()?.toDateString() === valueDateString;

    if (isMinDate) {
      minHoursExceeds12 = this.minDate()!.getHours() >= 12;
    }


    switch (
    true // intentional fall through
    ) {
      case isMinDate && minHoursExceeds12 && this.minDate()!.getHours() === 12 && this.minDate()!.getHours() > convertedHour:
        returnTimeTriple[0] = 11;
        break;
      case isMinDate && this.minDate()!.getHours() === convertedHour && this.minDate()!.getMinutes() > minute:
        returnTimeTriple[1] = this.minDate()!.getMinutes();
        break;
      case isMinDate && this.minDate()!.getHours() === convertedHour && this.minDate()!.getMinutes() === minute && this.minDate()!.getSeconds() > second:
        returnTimeTriple[2] = this.minDate()!.getSeconds();
        break;
      case isMinDate && !minHoursExceeds12 && this.minDate()!.getHours() - 1 === convertedHour && this.minDate()!.getHours() > convertedHour:
        returnTimeTriple[0] = 11;
        this.pm = true;
        break;
      case isMinDate && this.minDate()!.getHours() === convertedHour && this.minDate()!.getMinutes() > minute:
        returnTimeTriple[1] = this.minDate()!.getMinutes();
        break;
      case isMinDate && this.minDate()!.getHours() === convertedHour && this.minDate()!.getMinutes() === minute && this.minDate()!.getSeconds() > second:
        returnTimeTriple[2] = this.minDate()!.getSeconds();
        break;

      case isMinDate && minHoursExceeds12 && this.minDate()!.getHours() > convertedHour && convertedHour !== 12:
        this.setCurrentHourPM(this.minDate()!.getHours());
        returnTimeTriple[0] = this.currentHour() || 0;
        break;
      case isMinDate && this.minDate()!.getHours() === convertedHour && this.minDate()!.getMinutes() > minute:
        returnTimeTriple[1] = this.minDate()!.getMinutes();
        break;
      case isMinDate && this.minDate()!.getHours() === convertedHour && this.minDate()!.getMinutes() === minute && this.minDate()!.getSeconds() > second:
        returnTimeTriple[2] = this.minDate()!.getSeconds();
        break;
      case isMinDate && this.minDate()!.getHours() > convertedHour:
        returnTimeTriple[0] = this.minDate()!.getHours();
        break;
      case isMinDate && this.minDate()!.getHours() === convertedHour && this.minDate()!.getMinutes() > minute:
        returnTimeTriple[1] = this.minDate()!.getMinutes();
        break;
      case isMinDate && this.minDate()!.getHours() === convertedHour && this.minDate()!.getMinutes() === minute && this.minDate()!.getSeconds() > second:
        returnTimeTriple[2] = this.minDate()!.getSeconds();
        break;
      case isMaxDate && this.maxDate()!.getHours() < convertedHour:
        returnTimeTriple[0] = this.maxDate()!.getHours();
        break;
      case isMaxDate && this.maxDate()!.getHours() === convertedHour && this.maxDate()!.getMinutes() < minute:
        returnTimeTriple[1] = this.maxDate()!.getMinutes();
        break;
      case isMaxDate && this.maxDate()!.getHours() === convertedHour && this.maxDate()!.getMinutes() === minute && this.maxDate()!.getSeconds() < second:
        returnTimeTriple[2] = this.maxDate()!.getSeconds();
        break;
    }

    return returnTimeTriple;
  }

  incrementHour(event: Event) {
    const prevHour = this.currentHour() ?? 0;
    let newHour = (this.currentHour() ?? 0) + this.stepHour();
    let newPM = this.pm;
    if (this.hourFormat() == '24') newHour = newHour >= 24 ? newHour - 24 : newHour;
    else if (this.hourFormat() == '12') {
      // Before the AM/PM break, now after
      if (prevHour < 12 && newHour > 11) {
        newPM = !this.pm;
      }
      newHour = newHour >= 13 ? newHour - 12 : newHour;
    }
    this.toggleAMPMIfNotMinDate(newPM!);
    let time = this.constrainTime(newHour, this.currentMinute()!, this.currentSecond()!, newPM!);
    this.currentHour.set(time[0]);
    this.currentMinute.set(time[1]);
    this.currentSecond.set(time[2]);
    event.preventDefault();
  }

  toggleAMPMIfNotMinDate(newPM: boolean) {
    const value = this.value;
    const valueDateString = isDate(value) ? value.toDateString() : null;
    const isMinDate = this.minDate && valueDateString && this.minDate()?.toDateString() === valueDateString;
    if (isMinDate && this.minDate()!.getHours() >= 12) {
      this.pm = true;
    } else {
      this.pm = newPM;
    }
  }

  onTimePickerElementMouseDown(event: Event, type: number, direction: number) {
    if (!this.disabled()) {
      this.repeat(event, null, type, direction);
      event.preventDefault();
    }
  }

  onTimePickerElementMouseUp(event: Event) {
    event.preventDefault();
    if (!this.disabled()) {
      this.clearTimePickerTimer();
      this.updateTime();
    }
  }

  onTimePickerElementMouseLeave() {
    if (!this.$disabled() && this.timePickerTimer) {
      this.clearTimePickerTimer();
      this.updateTime();
    }
  }

  repeat(event: Event, interval: number | null, type: number, direction: number) {
    const i = interval || 500;

    this.clearTimePickerTimer();
    this.timePickerTimer = setTimeout(() => {
      this.repeat(event, 100, type, direction);
      this.cd.markForCheck();
    }, i);

    switch (type) {
      case 0:
        if (direction === 1)
          this.incrementHour(event);
        else
          this.decrementHour(event);
        break;

      case 1:
        if (direction === 1)
          this.incrementMinute(event);
        else
          this.decrementMinute(event);
        break;

      case 2:
        if (direction === 1)
          this.incrementSecond(event);
        else
          this.decrementSecond(event);
        break;
    }

    this.updateInputfield();
  }

  clearTimePickerTimer() {
    if (this.timePickerTimer) {
      clearTimeout(this.timePickerTimer);
      this.timePickerTimer = null;
    }
  }

  decrementHour(event: any) {
    let newHour = this.currentHour() - this.stepHour();
    let newPM = this.pm;
    if (this.hourFormat() == '24') newHour = newHour < 0 ? 24 + newHour : newHour;
    else if (this.hourFormat() == '12') {
      // If we were at noon/midnight, then switch
      if (this.currentHour() === 12) {
        newPM = !this.pm;
      }
      newHour = newHour <= 0 ? 12 + newHour : newHour;
    }
    this.toggleAMPMIfNotMinDate(newPM!);
    let time = this.constrainTime(newHour, this.currentMinute()!, this.currentSecond()!, newPM!);
    this.currentHour.set(time[0]);
    this.currentMinute.set(time[1]);
    this.currentSecond.set(time[2]);
    event.preventDefault();
  }

  incrementMinute(event: any) {
    let newMinute = this.currentMinute() + this.stepMinute();
    newMinute = newMinute > 59 ? newMinute - 60 : newMinute;
    let time = this.constrainTime(this.currentHour() || 0, newMinute, this.currentSecond()!, this.pm!);
    this.currentHour.set(time[0]);
    this.currentMinute.set(time[1]);
    this.currentSecond.set(time[2]);
    event.preventDefault();
  }

  decrementMinute(event: any) {
    let newMinute = this.currentMinute() - this.stepMinute();
    newMinute = newMinute < 0 ? 60 + newMinute : newMinute;
    let time = this.constrainTime(this.currentHour() || 0, newMinute, this.currentSecond() || 0, this.pm!);
    this.currentHour.set(time[0]);
    this.currentMinute.set(time[1]);
    this.currentSecond.set(time[2]);
    event.preventDefault();
  }

  incrementSecond(event: any) {
    let newSecond = this.currentSecond() + this.stepSecond();
    newSecond = newSecond > 59 ? newSecond - 60 : newSecond;
    const time = this.constrainTime(this.currentHour() || 0, this.currentMinute() || 0, newSecond, this.pm!);
    this.currentHour.set(time[0]);
    this.currentMinute.set(time[1]);
    this.currentSecond.set(time[2]);
    event.preventDefault();
  }

  decrementSecond(event: any) {
    let newSecond = this.currentSecond() - this.stepSecond();
    newSecond = newSecond < 0 ? 60 + newSecond : newSecond;
    const time = this.constrainTime(this.currentHour() || 0, this.currentMinute() || 0, newSecond, this.pm!);
    this.currentHour.set(time[0]);
    this.currentMinute.set(time[1]);
    this.currentSecond.set(time[2]);
    event.preventDefault();
  }

  updateTime() {
    let value: any = this.value;
    if (this.isRangeSelection() && isDateArray(this.value)) {
      value = this.value[1] || this.value[0];
    }
    if (this.isMultipleSelection() && isDateArray(this.value)) {
      value = this.value[this.value.length - 1];
    }
    value = isDate(value) ? new Date(value.getTime()) : new Date();

    if (this.hourFormat() == '12') {
      if (this.currentHour() === 12) value.setHours(this.pm ? 12 : 0);
      else value.setHours(this.pm ? this.currentHour() + 12 : this.currentHour());
    } else {
      value.setHours(this.currentHour());
    }

    value.setMinutes(this.currentMinute());
    value.setSeconds(this.currentSecond());
    if (this.isRangeSelection() && isDateArray(this.value)) {
      if (this.value[1]) value = [this.value[0], value];
      else value = [value, null] as Date[];
    }

    if (this.isMultipleSelection() && isDateArray(this.value)) {
      value = [...this.value.slice(0, -1), value];
    }

    this.updateModel(value);
    this.onSelect.emit(value);
    this.updateInputfield();
  }

  toggleAMPM(event: Event) {
    const newPM = !this.pm;
    this.pm = newPM;
    const time = this.constrainTime(this.currentHour() || 0, this.currentMinute() || 0, this.currentSecond() || 0, newPM);
    this.currentHour.set(time[0]);
    this.currentMinute.set(time[1]);
    this.currentSecond.set(time[2]);
    this.updateTime();
    event.preventDefault();
  }

  onUserInput(event: Event) {
    // IE 11 Workaround for input placeholder : https://github.com/primefaces/primeng/issues/2026


    if (!this.isKeydown) {
      return;
    }
    this.isKeydown = false;

    const val = (event.target as HTMLInputElement)?.value;
    try {
      const value = this.parseValueFromString(val);
      if (value) {
        if (this.isJalali() && isMoment(value)) {
          if (this.isSelectable(value.jDate(), value.jMonth(), value.jYear(), false)) {
            this.updateModel(value);
            this.updateUI();

          }
        }
        else {
          if (isDate(value) && this.isSelectable(value.getDate(), value.getMonth(), value.getFullYear(), false)) {
            this.updateModel(value);
            this.updateUI();

          }
        }
      } else {
        this.updateModel(null);
      }

    }
    catch (err) {
      //invalid date
      console.error(err)
      this.updateModel(null);
    }

    this.inputFieldValue.set(val);
    this.onInput.emit(event);
  }

  isValidSelection(value: any): boolean {
    if (this.isSingleSelection()) {
      return this.isSelectable(value.getDate(), value.getMonth(), value.getFullYear(), false);
    }
    let isValid = value.every((v: any) => this.isSelectable(v.getDate(), v.getMonth(), v.getFullYear(), false));
    if (isValid && this.isRangeSelection()) {
      isValid = value.length === 1 || (value.length > 1 && value[1] >= value[0]);
    }
    return isValid;
  }

  parseValueFromString(text: string): Date | Date[] | null {
    if (!text || text.trim().length === 0) {
      return null;
    }

    let value: Nullable<Date | Date[]> = null;

    if (this.isSingleSelection()) {
      value = this.parseDateTime(text);
    }
    else if (this.isMultipleSelection()) {
      const tokens = text.split(',');
      value = [];
      for (const token of tokens) {
        let parsedDate = this.parseDateTime(token.trim());
        if (isDate(parsedDate)) {
          value.push(parsedDate);
        }
      }
    }
    else if (this.isRangeSelection()) {
      const tokens = text.split(' - ');
      value = [];
      for (let i = 0; i < tokens.length; i++) {
        if (tokens[i].trim()) {
          let parsedValue = this.parseDateTime(tokens[i].trim());
          if (isDate(parsedValue)) {
            value.push(parsedValue);
          }
        }
      }
    }

    return value;
  }

  convertToJalali(value: Date | moment.Moment | moment.Moment[] | null): moment.Moment | moment.Moment[] | null {
    if (value instanceof Date) {
      return moment(value).locale('fa');
    } else if (Array.isArray(value)) {
      return value.map(v => moment(v).locale('fa'));
    }
    return null;
  }

  parseDateTime(text: string): Date | null {
    let date: Date | null;
    const parts: string[] = text.split(' ');

    if (this.timeOnly()) {
      date = new Date();
      this.populateTime(date, parts[0], parts[1]);
    }
    else {
      if (this.showTime()) {
        date = this.parseDate(parts[0], this.dateFormat());
        this.populateTime(date, parts[1], parts[2]);
      }
      else {
        date = this.parseDate(text, this.dateFormat());
      }
    }

    return date;
  }

  populateTime(value: any, timeString: any, ampm: any) {
    if (this.hourFormat() == '12' && !ampm) {
      throw 'Invalid Time';
    }

    this.pm = (ampm === 'PM' || ampm === 'pm');
    const time = this.parseTime(timeString);
    value.hour(time.hour);
    value.minute(time.minute);
    value.second(time.second);
  }

  updateUI() {
    let propValue: Date | null = null;

    if (isDateArray(this.value)) {
      propValue = this.value.length === 2 ? this.value[1] : this.value[0];
    } else if (typeof this.value === 'string') {
      const parsed = this.parseValueFromString(this.value);
      propValue = isDateArray(parsed) ? (parsed.length === 2 ? parsed[1] : parsed[0]) : parsed;
    }

    const defaultDate = this.defaultDate();

    const val = defaultDate && isValidDate(defaultDate) && !this.value
      ? this.defaultDate()
      : (propValue && isValidDate(propValue))
        ? propValue
        : new Date();

    if (val && val instanceof Date) {
      this.currentMonth.set(val.getMonth());
      this.currentYear.set(val.getFullYear());

      if (this.showTime() || this.timeOnly()) {
        this.setCurrentHourPM(val.getHours());
        this.currentMinute.set(val.getMinutes());
        this.currentSecond.set(this.showSeconds() ? val.getSeconds() : 0);
      }
    }
  }

  showOverlay() {
    if (!this.overlayVisible()) {
      this.updateUI();

      if (!this.touchUI()) {
        this.preventFocus = true;
      }

      this.overlayMinWidth = this.el.nativeElement.offsetWidth;
      this.overlayVisible.set(true);
    }
    this.cd.detectChanges();
  }

  hideOverlay() {
    this.inputfieldViewChild()?.nativeElement.focus();
    this.overlayVisible.set(false);
    this.clearTimePickerTimer();

    if (this.touchUI()) {
      this.disableModality();
    }

    this.cd.markForCheck();
  }

  toggle() {
    if (!this.inline()) {
      if (!this.overlayVisible()) {
        this.showOverlay();
        this.inputfieldViewChild()?.nativeElement.focus();
      } else {
        this.hideOverlay();
      }
    }
  }

  onDatePickerClick(event: Event) {
    event.preventDefault();
    this.datepickerClick = true;
  }


  onOverlayBeforeEnter(event: MotionEvent | undefined) {
    this.overlay = event?.element as HTMLElement;
    this.$attrSelector && this.overlay!.setAttribute(this.$attrSelector, '');
    const styles = !this.inline ? { position: 'absolute', top: '0', minWidth: `${this.overlayMinWidth}px` } : undefined;
    addStyle(this.overlay!, styles || {});
    this.appendOverlay();
    this.alignOverlay();
    this.setZIndex();
    this.updateFocus();
    this.bindListeners();
    this.onShow.emit(event?.element as HTMLElement);
  }

  onOverlayAfterLeave(event: MotionEvent | undefined) {
    if (this.autoZIndex()) {
      ZIndexUtils.clear(event?.element as HTMLElement);
    }
    this.restoreOverlayAppend();
    this.onOverlayHide();

    this.onClose.emit(event?.element as HTMLElement);
  }

  appendOverlay() {
    if (this.$appendTo() && this.$appendTo() !== 'self') {
      if (this.$appendTo() === 'body') this.document.body.appendChild(this.overlay as HTMLElement);
      else DomHandler.appendChild(this.$appendTo(), this.overlay!);
    }
  }

  restoreOverlayAppend() {
    if (this.overlay && this.$appendTo() !== 'self') {
      this.el.nativeElement.appendChild(this.overlay!);
    }
  }

  alignOverlay() {
    if (this.touchUI()) {
      this.enableModality(this.overlay);
    } else if (this.overlay) {
      if (this.$appendTo() && this.$appendTo() !== 'self') {
        DomHandler.absolutePosition(this.overlay, this.inputfieldViewChild()?.nativeElement);
      } else if (this.overlay && this.inputfieldViewChild()) {
        DomHandler.relativePosition(this.overlay, this.inputfieldViewChild()?.nativeElement);
      }
    }
  }

  bindListeners() {
    this.bindDocumentClickListener();
    this.bindDocumentResizeListener();
    this.bindScrollListener();
  }

  setZIndex() {
    if (this.autoZIndex()) {
      if (this.touchUI()) ZIndexUtils.set('modal', this.overlay, this.baseZIndex() || this.config.zIndex.modal);
      else ZIndexUtils.set('overlay', this.overlay, this.baseZIndex() || this.config.zIndex.overlay);
    }
  }

  enableModality(element: Nullable<HTMLElement>) {
    if (!this.mask() && this.touchUI()) {
      this.mask.set(this.renderer.createElement('div'));
      this.renderer.setStyle(this.mask, 'zIndex', String(parseInt(element?.style?.zIndex ?? '0') - 1));
      let maskStyleClass = 'p-overlay-mask p-datepicker-mask p-datepicker-mask-scrollblocker p-overlay-mask p-overlay-mask-enter-active';
      DomHandler.addClass(this.mask!, maskStyleClass);

      this.maskClickListener = this.renderer.listen(this.mask, 'click', () => {
        this.disableModality();
        this.overlayVisible.set(false);
      });
      this.renderer.appendChild(this.document.body, this.mask);
      blockBodyScroll();
    }
  }

  disableModality() {
    if (this.mask()) {
      DomHandler.addClass(this.mask(), 'p-overlay-mask-leave');
      if (!this.animationEndListener) {
        this.animationEndListener = this.renderer.listen(this.mask(), 'animationend', this.destroyMask.bind(this));
      }
    }
  }

  destroyMask() {
    if (!this.mask()) {
      return;
    }
    this.renderer.removeChild(this.document.body, this.mask());
    const bodyChildren = this.document.body.children;
    let hasBlockerMasks!: boolean;
    for (const bodyChild of bodyChildren) {
      if (DomHandler.hasClass(bodyChild, 'p-datepicker-mask-scrollblocker')) {
        hasBlockerMasks = true;
        break;
      }
    }

    if (!hasBlockerMasks) {
      DomHandler.unblockBodyScroll();
    }

    this.unbindAnimationEndListener();
    this.unbindMaskClickListener();
    this.mask.set(null);
  }

  unbindMaskClickListener() {
    if (this.maskClickListener) {
      this.maskClickListener();
      this.maskClickListener = null;
    }
  }

  override writeValue(value: any): void {
    this.value = value;
    if (this.value && typeof this.value === 'string') {
      this.value = this.parseValueFromString(this.value);
    }

    this.updateInputfield();
    this.updateUI();
  }

  override registerOnChange(fn: () => void): void {
    this.onModelChange = fn;
  }

  override registerOnTouched(fn: () => void): void {
    this.onModelTouched = fn;
  }

  unbindAnimationEndListener() {
    if (this.animationEndListener && this.mask()) {
      this.animationEndListener();
      this.animationEndListener = null;
    }
  }

  getDateFormat() {
    return this.dateFormat() || this.locale().dateFormat;
  }

  getFirstDateOfWeek() {
    return this.firstDayOfWeek() || this.getTranslation(TranslationKeys.FIRST_DAY_OF_WEEK);
  }

  // Ported from jquery-ui datepicker formatDate
  formatDate(date: any, format: any) {
    if (!date) {
      return '';
    }

    let iFormat!: any;
    const lookAhead = (match: string) => {
      const matches = iFormat + 1 < format.length && format.charAt(iFormat + 1) === match;
      if (matches) {
        iFormat++;
      }
      return matches;
    },
      formatNumber = (match: string, value: any, len: any) => {
        let num = '' + value;
        if (lookAhead(match)) {
          while (num.length < len) {
            num = '0' + num;
          }
        }
        return num;
      },
      formatName = (match: string, value: any, shortNames: any, longNames: any) => {
        return lookAhead(match) ? longNames[value] : shortNames[value];
      };
    let output = '';
    let literal = false;

    //! should be refactored
    if (date && date instanceof Date) {
      for (iFormat = 0; iFormat < format.length; iFormat++) {
        if (literal) {
          if (format.charAt(iFormat) === "'" && !lookAhead("'")) {
            literal = false;
          } else {
            output += format.charAt(iFormat);
          }
        } else {
          switch (format.charAt(iFormat)) {
            case 'd':
              output += formatNumber('d', date.getDate(), 2);
              break;
            case 'D':
              output += formatName('D', date.getDay(), this.getTranslation(TranslationKeys.DAY_NAMES_SHORT), this.getTranslation(TranslationKeys.DAY_NAMES));
              break;
            case 'o':
              output += formatNumber('o', Math.round((new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86400000), 3);
              break;
            case 'm':
              output += formatNumber('m', date.getMonth() + 1, 2);
              break;
            case 'M':
              output += formatName('M', date.getMonth(), this.getTranslation(TranslationKeys.MONTH_NAMES_SHORT), this.getTranslation(TranslationKeys.MONTH_NAMES));
              break;
            case 'y':
              output += lookAhead('y') ? date.getFullYear() : (date.getFullYear() % 100 < 10 ? '0' : '') + (date.getFullYear() % 100);
              break;
            case '@':
              output += date.getTime();
              break;
            case '!':
              output += date.getTime() * 10000 + (this.ticksTo1970 ?? 0) as number;
              break;
            case "'":
              if (lookAhead("'")) {
                output += "'";
              } else {
                literal = true;
              }
              break;
            default:
              output += format.charAt(iFormat);
          }
        }
      }
    }
    return output;
  }

  formatTime(date: Date | null) {
    if (!date) {
      return '';
    }

    let output = '';
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();

    if (this.hourFormat() == '12' && hours > 11 && hours != 12) {
      hours -= 12;
    }

    if (this.hourFormat() == '12') {
      output += hours === 0 ? 12 : (hours < 10) ? '0' + hours : hours;
    } else {
      output += (hours < 10) ? '0' + hours : hours;
    }
    output += ':';
    output += (minutes < 10) ? '0' + minutes : minutes;

    if (this.showSeconds()) {
      output += ':';
      output += (seconds < 10) ? '0' + seconds : seconds;
    }

    if (this.hourFormat() == '12') {
      output += date.getHours() > 11 ? ' PM' : ' AM';
    }

    return output;
  }

  parseTime(value: any): { hour: number, minute: number, second: number | null } {
    const tokens: string[] = value.split(':');
    const validTokenLength = this.showSeconds() ? 3 : 2;

    if (tokens.length !== validTokenLength) {
      throw 'Invalid time';
    }

    let h = parseInt(tokens[0]);
    const m = parseInt(tokens[1]);
    const s = this.showSeconds() ? parseInt(tokens[2]) : null;

    if (isNaN(h) || isNaN(m) || h > 23 || m > 59 || (this.hourFormat() == '12' && h > 12) || (this.showSeconds() && (isNaN(<any>s) || <any>s > 59))) {
      throw 'Invalid time';
    } else {
      if (this.hourFormat() == '12') {
        if (h !== 12 && this.pm) {
          h += 12;
        } else if (!this.pm && h === 12) {
          h -= 12;
        }
      }

      return { hour: h, minute: m, second: s };
    }
  }


  // Ported from jquery-ui datepicker parseDate
  parseDate(value: any, format: any) {
    if (format == null || value == null) {
      throw 'Invalid arguments';
    }

    value = typeof value === 'object' ? value.toString() : value + '';
    if (value === '') {
      return null;
    }

    let iFormat!: any,
      dim,
      extra,
      iValue = 0;

    const shortYearCutoff = typeof this.shortYearCutoff() !== 'string' ? this.shortYearCutoff() : (new Date().getFullYear() % 100) + parseInt(this.shortYearCutoff(), 10);
    let year = -1,
      month = -1,
      day = -1,
      doy = -1,
      literal = false,
      date;
    const lookAhead = (match: any) => {
      const matches = iFormat + 1 < format.length && format.charAt(iFormat + 1) === match;
      if (matches) {
        iFormat++;
      }
      return matches;
    },
      getNumber = (match: any) => {
        const isDoubled = lookAhead(match),
          size = match === '@' ? 14 : match === '!' ? 20 : match === 'y' && isDoubled ? 4 : match === 'o' ? 3 : 2,
          minSize = match === 'y' ? size : 1,
          digits = new RegExp('^\\d{' + minSize + ',' + size + '}'),
          num = value.substring(iValue).match(digits);
        if (!num) {
          throw 'Missing number at position ' + iValue;
        }
        iValue += num[0].length;
        return parseInt(num[0], 10);
      },
      getName = (match: any, shortNames: any, longNames: any) => {
        let index = -1;
        const arr = lookAhead(match) ? longNames : shortNames;
        const names: any[][] = [];

        for (let i = 0; i < arr.length; i++) {
          (names as unknown[]).push([i, arr[i]]);
        }
        (names as unknown[]).sort((a, b) => {
          return -((a as any)[1].length - (b as any)[1].length);
        });

        for (const nameItem of names) {
          const name = nameItem[1];
          if (value.substr(iValue, (name as string).length).toLowerCase() === (name as string).toLowerCase()) {
            index = nameItem[0];
            iValue += (name as string).length;
            break;
          }
        }

        if (index !== -1) {
          return index + 1;
        } else {
          throw 'Unknown name at position ' + iValue;
        }
      },
      checkLiteral = () => {
        if (value.charAt(iValue) !== format.charAt(iFormat)) {
          throw 'Unexpected literal at position ' + iValue;
        }
        iValue++;
      };

    if (this.view() === 'month') {
      day = 1;
    }

    for (iFormat = 0; iFormat < format.length; iFormat++) {
      if (literal) {
        if (format.charAt(iFormat) === "'" && !lookAhead("'")) {
          literal = false;
        } else {
          checkLiteral();
        }
      } else {
        switch (format.charAt(iFormat)) {
          case 'd':
            day = getNumber('d');
            break;
          case 'D':
            getName('D', this.getTranslation(TranslationKeys.DAY_NAMES_SHORT), this.getTranslation(TranslationKeys.DAY_NAMES));
            break;
          case 'o':
            doy = getNumber('o');
            break;
          case 'm':
            month = getNumber('m');
            break;
          case 'M':
            month = getName('M', this.getTranslation(TranslationKeys.MONTH_NAMES_SHORT), this.getTranslation(TranslationKeys.MONTH_NAMES));
            break;
          case 'y':
            year = getNumber('y');
            break;
          case '@':
            date = new Date(getNumber('@'));
            year = date.getFullYear();
            month = date.getMonth() + 1;
            day = date.getDate();
            break;
          case '!':
            date = new Date((getNumber('!') - (this.ticksTo1970 ?? 0)) / 10000);
            year = date.getFullYear();
            month = date.getMonth() + 1;
            day = date.getDate();
            break;
          case "'":
            if (lookAhead("'")) {
              checkLiteral();
            } else {
              literal = true;
            }
            break;
          default:
            checkLiteral();
        }
      }
    }

    if (iValue < value.length) {
      extra = value.substr(iValue);
      if (!/^\s+/.test(extra)) {
        throw 'Extra/unparsed characters found in date: ' + extra;
      }
    }

    if (year === -1) {
      year = new Date().getFullYear();
    } else if (year < 100) {
      year += new Date().getFullYear() - (new Date().getFullYear() % 100) + (year <= Number(shortYearCutoff) ? 0 : -100);
    }

    if (doy > -1) {
      month = 1;
      day = doy;
      do {
        dim = this.getDaysCountInMonth(year, month - 1);
        if (day <= dim) {
          break;
        }
        month++;
        day -= dim;
      } while (true);
    }

    if (this.view() === 'year') {
      month = month === -1 ? 1 : month;
      day = day === -1 ? 1 : day;
    }

    date = this.daylightSavingAdjust(new Date(year, month - 1, day));

    if (date.getFullYear() !== year || date.getMonth() + 1 !== month || date.getDate() !== day) {
      throw 'Invalid date'; // E.g. 31/02/00
    }

    return date;
  }

  daylightSavingAdjust(date: Date): Date;
  daylightSavingAdjust(date: moment.Moment): moment.Moment;
  daylightSavingAdjust(date: any): any {

    if (!date) {
      return null;
    }

    if (moment.isMoment(date)) {
      date.set('hour', date.hour() > 12 ? date.hour() + 2 : 0);
      return date;
    } else {
      date.setHours(date.getHours() > 12 ? date.getHours() + 2 : 0);
      return date;
    }
  }

  // updateFilledState() {
  //   this.filled = !!this.inputFieldValue && this.inputFieldValue != '';
  // }

  filled = computed(() => {
    const inputFieldValue = this.inputFieldValue();
    return !!inputFieldValue && inputFieldValue !== '';
  });

  onTodayButtonClick(event: Event) {
    const date: Date = new Date();
    const dateMeta = {
      day: date.getDate(),
      month: date.getMonth(),
      year: date.getFullYear(),
      otherMonth: date.getMonth() !== this.currentMonth() || date.getFullYear() !== this.currentYear(),
      today: true,
      selectable: true
    };

    // this.createMonths(date.getMonth(), date.getFullYear());
    this.onDateSelect(event, dateMeta);
    this.onTodayClick.emit(date);
  }


  onClearButtonClick(event: Event) {
    this.updateModel(null);
    this.updateInputfield();
    this.hideOverlay();
    this.onClearClick.emit(event);
  }

  createResponsiveStyle() {
    if (this.numberOfMonths() > 1 && this.responsiveOptions()) {
      if (!this.responsiveStyleElement) {
        this.responsiveStyleElement = this.renderer.createElement('style');
        (<HTMLStyleElement>this.responsiveStyleElement).type = 'text/css';
        DomHandler.setAttribute(this.responsiveStyleElement!, 'nonce', this.config?.csp()?.nonce);
        this.renderer.appendChild(this.document.body, this.responsiveStyleElement);
      }

      let innerHTML = '';
      if (this.responsiveOptions()) {
        let responsiveOptions = [...this.responsiveOptions()].filter((o) => !!(o.breakpoint && o.numMonths)).sort((o1: any, o2: any) => -1 * o1.breakpoint.localeCompare(o2.breakpoint, undefined, { numeric: true }));

        for (let i = 0; i < responsiveOptions.length; i++) {
          let { breakpoint, numMonths } = responsiveOptions[i];
          let styles = `
                        .p-datepicker[${this.attributeSelector}] .p-datepicker-group:nth-child(${numMonths}) .p-datepicker-next {
                            display: inline-flex !important;
                        }
                    `;

          for (let j: number = <number>numMonths; j < this.numberOfMonths(); j++) {
            styles += `
                            .p-datepicker[${this.attributeSelector}] .p-datepicker-group:nth-child(${j + 1}) {
                                display: none !important;
                            }
                        `;
          }

          innerHTML += `
                        @media screen and (max-width: ${breakpoint}) {
                            ${styles}
                        }
                    `;
        }
      }

      (<HTMLStyleElement>this.responsiveStyleElement).innerHTML = innerHTML;
      DomHandler.setAttribute(this.responsiveStyleElement!, 'nonce', this.config?.csp()?.nonce);
    }
  }

  destroyResponsiveStyleElement() {
    if (this.responsiveStyleElement) {
      this.responsiveStyleElement.remove();
      this.responsiveStyleElement = null;
    }
  }

  bindDocumentClickListener() {
    if (!this.documentClickListener) {
      this.documentClickListener = this.renderer.listen('document', 'click', () => {
        if (!this.datepickerClick && this.overlayVisible()) {
          this.hideOverlay();
        }

        this.datepickerClick = false;
        this.cd.detectChanges();
      });
    }
  }

  unbindDocumentClickListener() {
    if (this.documentClickListener) {
      this.documentClickListener();
      this.documentClickListener = null;
    }
  }

  bindDocumentResizeListener() {
    if (!this.documentResizeListener && !this.touchUI()) {
      this.documentResizeListener = this.onWindowResize.bind(this);
      window.addEventListener('resize', this.documentResizeListener);
    }
  }

  unbindDocumentResizeListener() {
    if (this.documentResizeListener) {
      window.removeEventListener('resize', this.documentResizeListener);
      this.documentResizeListener = null;
    }
  }

  bindScrollListener() {
    if (!this.scrollHandler) {
      this.scrollHandler = new ConnectedOverlayScrollHandler(this.el?.nativeElement, () => {
        if (this.overlayVisible()) {
          this.hideOverlay();
        }
      });
    }

    this.scrollHandler.bindScrollListener();
  }

  unbindScrollListener() {
    if (this.scrollHandler) {
      this.scrollHandler.unbindScrollListener();
    }
  }


  isOutsideClicked(event: Event) {
    return !(this.el.nativeElement.isSameNode(event.target) || this.isNavIconClicked(event) || this.el.nativeElement.contains(event.target) || (this.overlay && this.overlay.contains(event.target as Node)));
  }

  isNavIconClicked(event: any) {
    return DomHandler.hasClass(event.target, 'p-datepicker-prev-button') || DomHandler.hasClass(event.target, 'p-datepicker-prev-icon') || DomHandler.hasClass(event.target, 'p-datepicker-next-button') || DomHandler.hasClass(event.target, 'p-datepicker-next-icon');
  }


  onWindowResize() {
    if (this.overlayVisible()) {
      this.hideOverlay();
    }
  }

  onOverlayHide() {
    if (this.mask()) {
      this.destroyMask();
    }

    this.unbindDocumentClickListener();
    this.unbindDocumentResizeListener();
    this.unbindScrollListener();
    this.overlay = null;
  }

  override ngOnDestroy() {
    this.restoreOverlayAppend();
    this.onOverlayHide();
  }


  override writeControlValue(value: any): void {
    this.value = value;
    if (this.value && typeof this.value === 'string') {
      try {
        this.value = this.parseValueFromString(this.value);
      } catch {
        if (this.keepInvalid()) {
          this.value = value;
        }
      }
    }

    this.updateInputfield();
    this.updateUI();
    this.cd.markForCheck();
  }

  isValidDateForTimeConstraints(selectedDate: Date) {
    if (this.keepInvalid()) {
      return true; // If we are keeping invalid dates, we don't need to check for time constraints
    }
    const minDate = this.minDate();
    const maxDate = this.maxDate();
    return (!minDate || selectedDate >= minDate) && (!maxDate || selectedDate <= maxDate);
  }

  override onDestroy() {
    if (this.scrollHandler) {
      this.scrollHandler.destroy();
      this.scrollHandler = null;
    }

    if (this.translationSubscription) {
      this.translationSubscription.unsubscribe();
    }

    if (this.overlay && this.autoZIndex()) {
      ZIndexUtils.clear(this.overlay);
    }

    this.destroyResponsiveStyleElement();
    this.clearTimePickerTimer();
    this.restoreOverlayAppend();
    this.onOverlayHide();
  }
}
