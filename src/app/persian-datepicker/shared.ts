import { AfterContentInit, Component, contentChild, contentChildren, Directive, inject, input, NgModule, output, TemplateRef } from '@angular/core';
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
