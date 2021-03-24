interface Styles {
  base: {
    menu: Partial<CSSStyleDeclaration>,
    panel: Partial<CSSStyleDeclaration>,
  };
  open: {
    menu: Partial<CSSStyleDeclaration>,
    panel: Partial<CSSStyleDeclaration>,
  };
  closed: {
    menu: Partial<CSSStyleDeclaration>,
    panel: Partial<CSSStyleDeclaration>,
  };
}

interface ObjectConstructor {
  values(obj: any): any[];
  entries(obj: any): [string, any][];
  assign(first: any, ...objects: any[]): any;
}

interface Array<T> {
  includes(value: T): boolean;
}

type sides = 'left' | 'right';
type modes = 'drawer' | 'reveal';
type timingFunctions = 'linear' | 'ease' | 'ease-in' | 'ease-out' |
  'ease-in-out' | 'step-start' | 'step-end';
type eventNames = 'beforeclose' | 'closed' |'beforeopen' | 'opened' |
  'touchstart' | 'touchmove' | 'touchend';

interface Options {
  /** DOM element of menu */
  menu: HTMLElement;
  /** DOM element of panel */
  panel: HTMLElement;

  /**
   * side menu should display on
   * (default: `left`)
   */
  side?: sides;

  /**
   * whether the menu slide over the panel (`drawer`)
   * or the panel should slide to reveal the menu (`reveal`)
   * (default: `drawer`)
   */
  mode?: modes;

  /**
   * the number of pixels from the edge of the viewport
   * in which a touch event will be accepted
   * (default: `25`)
   */
  margin?: number;

  /**
   * milliseconds of the transition animation for opening and closing,
   * in the case where it isn't pulled out manually
   * (default: `200`)
   */
  timing?: number;

  /**
   * CSS3 transition timing function
   * (default: `ease`)
   */
  timingFunction?: timingFunctions;

  /**
   * width of menu in pixels
   * (default: `256`)
   */
  width?: number;

  /**
   * the speed needed to activate a flick
   * (default: `0.25`)
   */
  sensitivity?: number;

  /**
   * maximum ratio of vertical touch movement to horizontal touch
   * movement that should be accepted
   * (default: `0.5`)
   */
  slope?: number;

  /**
   * Enable touch functionality
   * (default: `true`)
   */
  touch?: boolean;

  /**
   * Ignore horizontally scrollable elements
   * (default: `true`)
   */
  ignoreScrollables?: boolean;

  /**
   * Class to add to the `<html>` element when the panel is open or opening
   * (default: `null`)
   */
   openPanelClass?: string;
}