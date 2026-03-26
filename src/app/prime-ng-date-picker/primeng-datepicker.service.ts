import { Injectable } from '@angular/core';
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ElementType = HTMLElement | any;
// @dynamic
@Injectable({
  providedIn: 'root'
})
export class PrimengDatepickerService {

  public zindex: number = 1000;
  public static zindex: number = 1000;

  private static calculatedScrollbarWidth: number | null = null;

  private static calculatedScrollbarHeight: number | null = null;

  private static browser: any | null = null;

  public static addClass(element: ElementType, className: string): void {
    if (element.classList)
      element.classList.add(className);
    else
      element.className += ' ' + className;
  }

  public static addMultipleClasses(element: ElementType, className: string): void {
    if (element.classList) {
      const styles: string[] = className.split(' ');
      for (const style of styles) {
        element.classList.add(style);
      }

    }
    else {
      const styles: string[] = className.split(' ');
      for (const style of styles) {
        element.className += ' ' + style;
      }
    }
  }

  public static removeClass(element: ElementType, className: string): void {
    if (element.classList)
      element.classList.remove(className);
    else
      element.className = element.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
  }

  public static hasClass(element: ElementType, className: string): boolean {
    if (element.classList)
      return element.classList.contains(className);
    else
      return new RegExp('(^| )' + className + '( |$)', 'gi').test(element.className);
  }

  public static siblings(element: ElementType) {
    return Array.prototype.filter.call(element.parentNode.children, function (child) {
      return child !== element;
    });
  }

  public static find(element: ElementType, selector: string): ElementType[] {
    return Array.from(element.querySelectorAll(selector));
  }

  public static findSingle(element: ElementType, selector: string): ElementType {
    return element.querySelector(selector);
  }

  public static index(element: ElementType): number {
    const children: ElementType[] = element.parentNode.childNodes;
    let num = 0;
    for (const child of children) {
      if (child == element) return num;
      if (child.nodeType == 1) num++;
    }
    return -1;
  }

  public static indexWithinGroup(element: ElementType, attributeName: string): number {
    const children: any[] = element.parentNode.childNodes;
    let num = 0;
    for (const child of children) {
      if (child == element) return num;
      if (child.attributes && child.attributes[attributeName] && child.nodeType == 1) num++;
    }
    return -1;
  }

  public static relativePosition(element: ElementType, target: any): void {
    const elementDimensions = element.offsetParent ? { width: element.offsetWidth, height: element.offsetHeight } : this.getHiddenElementDimensions(element);
    const targetHeight = target.offsetHeight;
    const targetWidth = target.offsetWidth;
    const targetOffset = target.getBoundingClientRect();
    const windowScrollTop = this.getWindowScrollTop();
    const viewport = this.getViewport();
    let top, left;

    if ((targetOffset.top + targetHeight + elementDimensions.height) > viewport.height) {
      top = -1 * (elementDimensions.height);
      if (targetOffset.top + top < 0) {
        top = 0;
      }
    }
    else {
      top = targetHeight;
    }


    if ((targetOffset.left + elementDimensions.width) > viewport.width)
      left = targetWidth - elementDimensions.width;
    else
      left = 0;

    element.style.top = top + 'px';
    element.style.left = left + 'px';
  }

  public static absolutePosition(element: ElementType, target: any): void {
    const elementDimensions = element.offsetParent ? { width: element.offsetWidth, height: element.offsetHeight } : this.getHiddenElementDimensions(element);
    const elementOuterHeight = elementDimensions.height;
    const elementOuterWidth = elementDimensions.width;
    const targetOuterHeight = target.offsetHeight;
    const targetOuterWidth = target.offsetWidth;
    const targetOffset = target.getBoundingClientRect();
    const windowScrollTop = this.getWindowScrollTop();
    const windowScrollLeft = this.getWindowScrollLeft();
    const viewport = this.getViewport();
    let top, left;

    if (targetOffset.top + targetOuterHeight + elementOuterHeight > viewport.height) {
      top = targetOffset.top + windowScrollTop - elementOuterHeight;
      if (top < 0) {
        top = 0 + windowScrollTop;
      }
    }
    else {
      top = targetOuterHeight + targetOffset.top + windowScrollTop;
    }

    if (targetOffset.left + targetOuterWidth + elementOuterWidth > viewport.width)
      left = targetOffset.left + windowScrollLeft + targetOuterWidth - elementOuterWidth;
    else
      left = targetOffset.left + windowScrollLeft;

    element.style.top = top + 'px';
    element.style.left = left + 'px';
  }

  public static getHiddenElementOuterHeight(element: ElementType): number {
    element.style.visibility = 'hidden';
    element.style.display = 'block';
    const elementHeight = element.offsetHeight;
    element.style.display = 'none';
    element.style.visibility = 'visible';

    return elementHeight;
  }

  public static getHiddenElementOuterWidth(element: ElementType): number {
    element.style.visibility = 'hidden';
    element.style.display = 'block';
    const elementWidth = element.offsetWidth;
    element.style.display = 'none';
    element.style.visibility = 'visible';

    return elementWidth;
  }

  public static getHiddenElementDimensions(element: ElementType): any {
    const dimensions: any = {};
    element.style.visibility = 'hidden';
    element.style.display = 'block';
    dimensions.width = element.offsetWidth;
    dimensions.height = element.offsetHeight;
    element.style.display = 'none';
    element.style.visibility = 'visible';

    return dimensions;
  }

  public static scrollInView(container: any, item: any) {
    const borderTopValue: string = getComputedStyle(container).getPropertyValue('borderTopWidth');
    const borderTop: number = borderTopValue ? parseFloat(borderTopValue) : 0;
    const paddingTopValue: string = getComputedStyle(container).getPropertyValue('paddingTop');
    const paddingTop: number = paddingTopValue ? parseFloat(paddingTopValue) : 0;
    const containerRect = container.getBoundingClientRect();
    const itemRect = item.getBoundingClientRect();
    const offset = (itemRect.top + document.body.scrollTop) - (containerRect.top + document.body.scrollTop) - borderTop - paddingTop;
    const scroll = container.scrollTop;
    const elementHeight = container.clientHeight;
    const itemHeight = this.getOuterHeight(item);

    if (offset < 0) {
      container.scrollTop = scroll + offset;
    }
    else if ((offset + itemHeight) > elementHeight) {
      container.scrollTop = scroll + offset - elementHeight + itemHeight;
    }
  }

  public static fadeIn(element: ElementType, duration: number): void {
    element.style.opacity = 0;

    let last = +Date.now();
    let opacity = 0;
    const tick = () => {
      opacity = parseFloat(element.style.opacity.replace(",", ".")) + (Date.now() - last) / duration;
      element.style.opacity = opacity.toString();
      last = +Date.now();

      if (+opacity < 1) {
        requestAnimationFrame(tick);
      }
    };

    tick();
  }

  public static fadeOut(element: ElementType, ms: number) {
    let opacity = 1;
    const interval = 50,
      duration = ms,
      gap = interval / duration;

    const fading = setInterval(() => {
      opacity = opacity - gap;

      if (opacity <= 0) {
        opacity = 0;
        clearInterval(fading);
      }

      element.style.opacity = opacity;
    }, interval);
  }

  public static getWindowScrollTop(): number {
    const doc = document.documentElement;
    return (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0);
  }

  public static getWindowScrollLeft(): number {
    const doc = document.documentElement;
    return (window.pageXOffset || doc.scrollLeft) - (doc.clientLeft || 0);
  }

  public static matches(element: Element, selector: string): boolean {
    return element.matches(selector);
  }

  public static getOuterWidth(el: ElementType, margin?: any) {
    let width = el.offsetWidth;

    if (margin) {
      const style = getComputedStyle(el);
      width += parseFloat(style.marginLeft) + parseFloat(style.marginRight);
    }

    return width;
  }

  public static getHorizontalPadding(el: ElementType) {
    const style = getComputedStyle(el);
    return parseFloat(style.paddingLeft) + parseFloat(style.paddingRight);
  }

  public static getHorizontalMargin(el: ElementType) {
    const style = getComputedStyle(el);
    return parseFloat(style.marginLeft) + parseFloat(style.marginRight);
  }

  public static innerWidth(el: ElementType) {
    let width = el.offsetWidth;
    const style = getComputedStyle(el);

    width += parseFloat(style.paddingLeft) + parseFloat(style.paddingRight);
    return width;
  }

  public static width(el: ElementType) {
    let width = el.offsetWidth;
    const style = getComputedStyle(el);

    width -= parseFloat(style.paddingLeft) + parseFloat(style.paddingRight);
    return width;
  }

  public static getInnerHeight(el: ElementType) {
    let height = el.offsetHeight;
    const style = getComputedStyle(el);

    height += parseFloat(style.paddingTop) + parseFloat(style.paddingBottom);
    return height;
  }

  public static getOuterHeight(el: ElementType, margin?: any) {
    let height = el.offsetHeight;

    if (margin) {
      const style = getComputedStyle(el);
      height += parseFloat(style.marginTop) + parseFloat(style.marginBottom);
    }

    return height;
  }

  public static getHeight(el: ElementType): number {
    let height = el.offsetHeight;
    const style = getComputedStyle(el);

    height -= parseFloat(style.paddingTop) + parseFloat(style.paddingBottom) + parseFloat(style.borderTopWidth) + parseFloat(style.borderBottomWidth);

    return height;
  }

  public static getWidth(el: ElementType): number {
    let width = el.offsetWidth;
    const style = getComputedStyle(el);

    width -= parseFloat(style.paddingLeft) + parseFloat(style.paddingRight) + parseFloat(style.borderLeftWidth) + parseFloat(style.borderRightWidth);

    return width;
  }

  public static getViewport(): any {
    const win = window,
      d = document,
      e = d.documentElement,
      g = d.getElementsByTagName('body')[0],
      w = win.innerWidth || e.clientWidth || g.clientWidth,
      h = win.innerHeight || e.clientHeight || g.clientHeight;

    return { width: w, height: h };
  }

  public static getOffset(el: ElementType) {
    const rect = el.getBoundingClientRect();

    return {
      top: rect.top + document.body.scrollTop,
      left: rect.left + document.body.scrollLeft
    };
  }

  public static replaceElementWith(element: ElementType, replacementElement: ElementType): any {
    const parentNode = element.parentNode;
    if (!parentNode)
      throw `Can't replace element`;
    return parentNode.replaceChild(replacementElement, element);
  }

  public static getUserAgent(): string {
    return navigator.userAgent;
  }

  public static isIE() {
    const ua = window.navigator.userAgent;

    const msie = ua.indexOf('MSIE ');
    if (msie > 0) {
      // IE 10 or older => return version number
      return true;
    }

    const trident = ua.indexOf('Trident/');
    if (trident > 0) {
      // IE 11 => return version number
      const rv = ua.indexOf('rv:');
      return true;
    }

    const edge = ua.indexOf('Edge/');
    if (edge > 0) {
      // Edge (IE 12+) => return version number
      return true;
    }

    // other browser
    return false;
  }

  public static appendChild(element: ElementType, target: any) {
    if (this.isElement(target))
      target.appendChild(element);
    else if (target.el && target.el.nativeElement)
      target.el.nativeElement.appendChild(element);
    else
      throw 'Cannot append ' + target + ' to ' + element;
  }

  public static removeChild(element: ElementType, target: any) {
    if (this.isElement(target))
      target.removeChild(element);
    else if (target.el && target.el.nativeElement)
      target.el.nativeElement.removeChild(element);
    else
      throw 'Cannot remove ' + element + ' from ' + target;
  }

  public static isElement(obj: any) {
    return (typeof HTMLElement === "object" ? obj instanceof HTMLElement :
      obj && typeof obj === "object" && obj !== null && obj.nodeType === 1 && typeof obj.nodeName === "string"
    );
  }

  public static calculateScrollbarWidth(): number {
    if (this.calculatedScrollbarWidth !== null)
      return this.calculatedScrollbarWidth;

    const scrollDiv = document.createElement("div");
    scrollDiv.className = "ui-scrollbar-measure";
    document.body.appendChild(scrollDiv);

    const scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
    document.body.removeChild(scrollDiv);

    this.calculatedScrollbarWidth = scrollbarWidth;

    return scrollbarWidth;
  }

  public static calculateScrollbarHeight(): number {
    if (this.calculatedScrollbarHeight !== null)
      return this.calculatedScrollbarHeight;

    const scrollDiv = document.createElement("div");
    scrollDiv.className = "ui-scrollbar-measure";
    document.body.appendChild(scrollDiv);

    const scrollbarHeight = scrollDiv.offsetHeight - scrollDiv.clientHeight;
    document.body.removeChild(scrollDiv);

    this.calculatedScrollbarWidth = scrollbarHeight;

    return scrollbarHeight;
  }

  public static invokeElementMethod(element: ElementType, methodName: string, args?: any[]): void {
    element[methodName].apply(element, args);
  }

  public static clearSelection(): void {
    const selection: Selection | null = window.getSelection?.();
    if (selection) {
      if (selection.empty) {
        selection.empty();
      } else if (selection.removeAllRanges && selection.rangeCount > 0 && selection.getRangeAt(0).getClientRects().length > 0) {
        selection.removeAllRanges();
      }
    }
  }

  public static getBrowser() {
    if (!this.browser) {
      const matched = this.resolveUserAgent();
      this.browser = {};

      if (matched.browser) {
        this.browser[matched.browser] = true;
        this.browser['version'] = matched.version;
      }

      if (this.browser['chrome']) {
        this.browser['webkit'] = true;
      } else if (this.browser['webkit']) {
        this.browser['safari'] = true;
      }
    }

    return this.browser;
  }

  public static resolveUserAgent() {
    const ua = navigator.userAgent.toLowerCase();
    const match = /(chrome)[ \/]([\w.]+)/.exec(ua) ||
      /(webkit)[ \/]([\w.]+)/.exec(ua) ||
      /(opera)(?:.*version|)[ \/]([\w.]+)/.exec(ua) ||
      /(msie) ([\w.]+)/.exec(ua) ||
      ua.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(ua) ||
      [];

    return {
      browser: match[1] || "",
      version: match[2] || "0"
    };
  }

  public static isInteger(value: unknown): boolean {
    if (Number.isInteger) {
      return Number.isInteger(value);
    }
    else {
      return typeof value === "number" && isFinite(value) && Math.floor(value) === value;
    }
  }

  public static isHidden(element: HTMLElement): boolean {
    return element.offsetParent === null;
  }

}
