import { AfterContentInit, Component, contentChild, contentChildren, Directive, inject, input, output, TemplateRef } from '@angular/core';
import moment, { isDate, isMoment } from 'jalali-moment';
import { DateMeta, DateValueType } from './model';
import { Nullable } from 'primeng/ts-helpers';
// @dynamic
@Component({
  selector: 'p-header',
  template: '<ng-content></ng-content>'
})
export class Header { }

// @dynamic
@Component({
  selector: 'p-footer',
  template: '<ng-content></ng-content>'
})
export class Footer { }

@Directive({
  selector: '[pTemplate]',
  host: {
  }
})
export class PrimeTemplate {

  public template = inject(TemplateRef<any>);

  type = input<string>();

  name = input<string>('', { alias: 'pTemplate' });


  getType(): string {
    return this.name();
  }
}
// @dynamic
/* Deprecated */
@Component({
  selector: 'p-column',
  template: ''
})
export class Column implements AfterContentInit {
  field = input<string>();
  colId = input<string>();
  sortField = input<string>();
  filterField = input<string>();
  header = input<string>();
  footer = input<string>();
  sortable = input<boolean>();
  editable = input<boolean>();
  filter = input<boolean>();
  filterMatchMode = input<string>();
  filterType = input<string>('text');
  excludeGlobalFilter = input<boolean>();
  rowspan = input<number>();
  colspan = input<number>();
  scope = input<string>();
  style = input<string>();
  styleClass = input<string>();
  exportable = input<boolean>(true);
  headerStyle = input<string>();
  headerStyleClass = input<string>();
  bodyStyle = input<string>();
  bodyStyleClass = input<string>();
  footerStyle = input<string>();
  footerStyleClass = input<string>();
  hidden = input<boolean>();
  expander = input<boolean>();
  selectionMode = input<string>();
  filterPlaceholder = input<string>();
  filterMaxlength = input<number>();
  frozen = input<boolean>();
  resizable = input<boolean>(true);
  sortFunction = output<() => void>();
  templates = contentChildren(PrimeTemplate);
  template = contentChild(TemplateRef);

  public headerTemplate?: TemplateRef<PrimeTemplate>;
  public bodyTemplate?: TemplateRef<PrimeTemplate>;
  public footerTemplate?: TemplateRef<PrimeTemplate>;
  public filterTemplate?: TemplateRef<PrimeTemplate>;
  public editorTemplate?: TemplateRef<PrimeTemplate>;

  ngAfterContentInit(): void {
    this.templates().forEach((item) => {
      switch (item.getType()) {
        case 'header':
          this.headerTemplate = item.template;
          break;

        case 'body':
          this.bodyTemplate = item.template;
          break;

        case 'footer':
          this.footerTemplate = item.template;
          break;

        case 'filter':
          this.filterTemplate = item.template;
          break;

        case 'editor':
          this.editorTemplate = item.template;
          break;

        default:
          this.bodyTemplate = item.template;
          break;
      }
    });
  }
}
// @dynamic
/* Deprecated */
@Component({
  selector: 'p-row',
  template: ``
})
export class Row {

  columns = contentChildren(Column);

}
// @dynamic
/* Deprecated */
@Component({
  selector: 'p-headerColumnGroup',
  template: ``
})
export class HeaderColumnGroup {

  frozen = input<boolean>();

  rows = contentChildren(Row);
}
// @dynamic
/* Deprecated */
@Component({
  selector: 'p-footerColumnGroup',
  template: ``
})
export class FooterColumnGroup {

  frozen = input<boolean>();

  rows = contentChildren(Row);
}


export function addStyle(element: HTMLElement, style: string | object): void {
  if (element) {
    if (typeof style === 'string') {
      element.style.cssText = style;
    } else {
      Object.entries(style || {}).forEach(([key, value]: [string, string]) => ((element.style as any)[key] = value));
    }
  }
}


export function getIndex(element: HTMLElement): number {
  if (element) {
    const children = getParentNode(element)?.childNodes;
    let num = 0;

    if (children) {
      for (const child of children) {
        if (child === element) return num;
        if (child.nodeType === 1) num++;
      }
    }
  }

  return -1;
}

export function getParentNode(element: Node): ParentNode | null {
  if (element) {
    let parent = element.parentNode;

    if (parent && parent instanceof ShadowRoot && parent.host) {
      parent = parent.host;
    }

    return parent;
  }

  return null;
}

export function hasClass(element: Element, className: string): boolean {
  if (element) {
    if (element.classList) return element.classList.contains(className);
    else return new RegExp('(^| )' + className + '( |$)', 'gi').test(element.className);
  }

  return false;
}

// export function isDate(value: unknown): value is Date {
//   return value instanceof Date;
// }

// export function isMoment(value: unknown): value is moment.Moment {
//   return moment.isMoment(value);
// }

export function isDateArray(value: unknown): value is Date[] {
  return Array.isArray(value) && value.every(isDate);
}

export function isMomentArray(value: unknown): value is moment.Moment[] {
  return Array.isArray(value) && value.every(isMoment);
}

export function isValidDate(date: Nullable<DateValueType>): boolean {
  if (!date) {
    return false;
  }
  if (isDateArray(date)) {
    return date.every(isValidDate);
  }
  if (isDate(date)) {
    return !Number.isNaN(date.getTime());
  } else if (moment.isMoment(date)) {
    return date.isValid();
  }
  return false;
}

export function isDateEquals(value: any, dateMeta: DateMeta): boolean {
  if (value) {
    if (isDate(value)) {
      return value.getDate() === dateMeta.day && value.getMonth() === dateMeta.month && value.getFullYear() === dateMeta.year;
    } else if (moment.isMoment(value)) {
      return value.date() === dateMeta.day && value.month() === dateMeta.month && value.year() === dateMeta.year;
    }
  }
  return false;
}

export function isDateBetween(start: Date, end: Date, dateMeta: DateMeta): boolean;
export function isDateBetween(start: moment.Moment, end: moment.Moment, dateMeta: DateMeta): boolean;
export function isDateBetween(start: any, end: any, dateMeta: DateMeta): boolean {
  const between: boolean = false;
  if (isDate(start) && isDate(end)) {
    const date: Date = formatDateMetaToDate(dateMeta);
    return start.getTime() <= date.getTime() && end.getTime() >= date.getTime();
  }

  if (moment.isMoment(start) && moment.isMoment(end)) {
    const date: moment.Moment = moment([dateMeta.year, dateMeta.month, dateMeta.day]);
    return start.unix() <= date.unix() && end.unix() >= date.unix();
  }

  return between;
}


export function formatDateMetaToDate(dateMeta: DateMeta): Date {
  return new Date(dateMeta.year, dateMeta.month, dateMeta.day);
}

export function isToday(today: Date | moment.Moment, day: number, month: number, year: number): boolean {
  if (isMoment(today))
    return today.jDate() === day && today.jMonth() === month && today.jYear() === year;
  else if (isDate(today)) {
    return today.getDay() === day && today.getMonth() === month && today.getFullYear() === year;
  }
  return false;
}


const lastIds: { [key: string]: number } = {};

export function uuid(prefix: string = 'pui_id_'): string {
  if (!Object.hasOwn(lastIds, prefix)) {
    lastIds[prefix] = 0;
  }

  lastIds[prefix]++;

  return `${prefix}${lastIds[prefix]}`;
}


export function formatDateKey(date: Date): string {
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
}

export function convertTo24Hour(hours: number, pm: boolean, hourFormat: string): number {
  if (hourFormat == '12') {
    if (hours === 12) {
      return pm ? 12 : 0;
    } else {
      return pm ? hours + 12 : hours;
    }
  }
  return hours;
}

export function convertToJalali(value: Nullable<DateValueType>): moment.Moment | moment.Moment[] | null {
  if (value instanceof Date) {
    return moment(value).locale('fa');
  } else if (Array.isArray(value)) {
    return value.map(v => moment(v).locale('fa'));
  }
  return null;
}

export function getFullYear(value: Nullable<DateValueType>): number | number[] | null {
  if (isDate(value)) {
    return value.getFullYear();
  } else if (isDateArray(value)) {
    return value.map(dateValue => dateValue.getFullYear());
  } else if (isMoment(value)) {
    return value.year();
  } else if (isMomentArray(value)) {
    return value.map(momentValue => momentValue.year());
  } else if (typeof value === 'string') {
    return moment(value).year();
  }
  return null;
}

export function getMonths(value: Nullable<DateValueType>) {
  if (isDate(value)) {
    return value.getMonth();
  } else if (isDateArray(value)) {
    return value.map(dateValue => dateValue.getMonth());
  } else if (isMoment(value)) {
    return value.month();
  } else if (isMomentArray(value)) {
    return value.map(momentValue => momentValue.month());
  } else if (typeof value === 'string') {
    return moment(value).month();
  }
  return null;
}
export function getDays(value: Nullable<DateValueType>) {
  if (isDate(value)) {
    return value.getDay();
  } else if (isDateArray(value)) {
    return value.map(dateValue => dateValue.getDay());
  } else if (isMoment(value)) {
    return value.day();
  } else if (isMomentArray(value)) {
    return value.map(momentValue => momentValue.day());
  } else if (typeof value === 'string') {
    return moment(value).day();
  }
  return null;
}
export function getHours(value: Nullable<DateValueType>) {
  if (isDate(value)) {
    return value.getHours();
  } else if (isDateArray(value)) {
    return value.map(dateValue => dateValue.getHours());
  } else if (isMoment(value)) {
    return value.hour();
  } else if (isMomentArray(value)) {
    return value.map(momentValue => momentValue.hour());
  } else if (typeof value === 'string') {
    return moment(value).hour();
  }
  return null;
}
export function getMinutes(value: Nullable<DateValueType>) {
  if (isDate(value)) {
    return value.getMinutes();
  } else if (isDateArray(value)) {
    return value.map(dateValue => dateValue.getMinutes());
  } else if (isMoment(value)) {
    return value.minute();
  } else if (isMomentArray(value)) {
    return value.map(momentValue => momentValue.minute());
  } else if (typeof value === 'string') {
    return moment(value).minute();
  }
  return null;
}
export function getSeconds(value: Nullable<DateValueType>) {
  if (isDate(value)) {
    return value.getSeconds();
  } else if (isDateArray(value)) {
    return value.map(dateValue => dateValue.getSeconds());
  } else if (isMoment(value)) {
    return value.second();
  } else if (isMomentArray(value)) {
    return value.map(momentValue => momentValue.second());
  } else if (typeof value === 'string') {
    return moment(value).second();
  }
  return null;
}

export function daylightSavingAdjust(date: Date): Date;
export function daylightSavingAdjust(date: moment.Moment): moment.Moment;
export function daylightSavingAdjust(date: any): any {

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
