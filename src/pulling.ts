import { assertArg } from './util';

const timingFunctions: timingFunctions[] = [
  'linear', 'ease', 'ease-in', 'ease-out',
  'ease-in-out', 'step-start', 'step-end',
];

export default abstract class Pulling {
  static modes: {
    [key: string]: new (options: Options) => Pulling;
  } = {};

  static create(options: Options) {
    const mode = options.mode || Object.keys(Pulling.modes)[0] || 'drawer';
    if (!Pulling.modes[mode]) {
      const modes = Object.keys(Pulling.modes).map(x => `"${x}"`).join(', ');
      throw TypeError(`${'`mode`'} must be one of ${modes}`);
    }

    return new Pulling.modes[mode](options);
  }

  protected menu: HTMLElement;
  protected panel: HTMLElement;
  protected side: sides;
  protected mode: modes;
  protected margin: number;
  protected timing: number;
  protected timingFunction: timingFunctions;
  protected width: number;
  protected sensitivity: number;
  protected slope: number;
  protected openPanelClass: string | null;

  protected styles: Styles = {
    base: {
      menu: {},
      panel: {},
    },
    open: {
      menu: {},
      panel: {},
    },
    closed: {
      menu: {},
      panel: {},
    },
  };

  protected constructor(options: Options) {
    if (!Object.values(Pulling.modes).some(x => this instanceof x)) {
      throw TypeError(
        'Calling this constructor is not allowed. ' +
        'Use `Pulling.create` instead',
      );
    }

    const {
      menu,
      panel,
      side,
      mode,
      margin,
      timing,
      timingFunction,
      width,
      sensitivity,
      slope,
      touch,
      openPanelClass,
    } = options;

    this.menu = menu;
    this.panel = panel;
    this.side = side || 'left';
    this.mode = mode || 'drawer';
    this.margin = margin || 25,
    this.timing = timing || 200;
    this.timingFunction = timingFunction || 'ease';
    this.width = width || 256;
    this.sensitivity = sensitivity || 0.25;
    this.slope = slope || 0.5;
    this.openPanelClass = openPanelClass || null;

    assertArg(
      menu instanceof Element,
      '`menu` must be of type `Element`',
    );
    assertArg(
      panel instanceof Element,
      '`panel` must be of type `Element`',
    );
    assertArg(
      this.side === 'left' || this.side === 'right',
      '`side` must be equal to "left" or "right"',
    );
    assertArg(
      typeof this.margin === 'number',
      '`margin` must be of type "number"',
    );
    assertArg(
      typeof this.timing === 'number',
      '`timing` must be of type "number"',
    );
    assertArg(
      timingFunctions.includes(this.timingFunction),
      `${'`timingFunction`'} must be one of ${timingFunctions.map(x => `"${x}"`).join(', ')}`,
    );
    assertArg(
      typeof this.width === 'number',
      '`width` must be of type "number"',
    );
    assertArg(
      typeof this.sensitivity === 'number',
      '`sensitivity` must be of type "number"',
    );
    assertArg(
      typeof this.slope === 'number',
      '`slope` must be of type "number"',
    );
  }

  protected handlers: {
    beforeclose: Function[],
    closed: Function[],
    beforeopen: Function[],
    opened: Function[],
    touchstart: Function[],
    touchmove: Function[],
    touchend: Function[],
  } = {
    beforeclose: [],
    closed: [],
    beforeopen: [],
    opened: [],
    touchstart: [],
    touchmove: [],
    touchend: [],
  };

  /** Trigger event listeners for the event */
  protected emit(eventName: eventNames, e?: Event) {
    this.handlers[eventName].forEach(handler => handler.call(this, e));
  }

  /** Add an event handler for the event */
  on(eventName: eventNames, handler: Function) {
    this.handlers[eventName].push(handler);
    return this;
  }

  /** Remove all event handlers for an event */
  off(eventName: eventNames, handler?: Function) {
    if (handler) {
      this.handlers[eventName] = this.handlers[eventName].filter((handle) => {
        return handle !== handler;
      });
    } else {
      this.handlers[eventName] = [];
    }
    return this;
  }

  state = {
    opened: false,
    opening: false,
    closed: true,
    closing: false,
  };

  /** Open the menu */
  open(e?: Event) {
    this.emit('beforeopen', e);
    if (this.disabled) {
      return this;
    }

    if (this.state.opened) {
      return this;
    }

    this.state.closed = false;
    this.state.closing = false;
    this.state.opening = true;
    this.state.opened = false;

    if (this.openPanelClass) {
      document.documentElement.classList.add(this.openPanelClass);
    }

    const offset = this.offset();
    if (offset > 0) {
      const duration = `${this.timing * (1 - offset / this.width)}ms`;

      this.menu.style.transitionDuration = duration;
      this.panel.style.transitionDuration = duration;
    }

    Object.assign(this.menu.style, this.styles.open.menu);
    Object.assign(this.panel.style, this.styles.open.panel);

    const after = () => {
      this.state.opening = false;
      this.state.opened = true;

      Object.assign(this.menu.style, this.styles.open.menu);
      Object.assign(this.panel.style, this.styles.open.panel);

      this.emit('opened');
    };
    if (offset === this.width) {
      after();
    } else {
      this.afterTransitionend(after);
    }

    return this;
  }

  /** Close the menu */
  close(e?: Event) {
    this.emit('beforeclose', e);
    if (this.disabled) {
      return this;
    }

    if (this.state.closed) {
      this.state.closing = false;
      return this;
    }

    this.state.closed = false;
    this.state.closing = true;
    this.state.opening = false;
    this.state.opened = false;

    const offset = this.offset();
    if (offset > 0) {
      const duration = `${this.timing * offset / this.width}ms`;

      this.menu.style.transitionDuration = duration;
      this.panel.style.transitionDuration = duration;
    }

    Object.assign(this.menu.style, this.styles.closed.menu);
    Object.assign(this.panel.style, this.styles.closed.panel);

    const after = () => {
      this.state.closing = false;
      this.state.closed = true;

      Object.assign(this.menu.style, this.styles.closed.menu);
      Object.assign(this.panel.style, this.styles.closed.panel);

      if (this.openPanelClass) {
        document.documentElement.classList.remove(this.openPanelClass);
      }

      this.emit('closed');
    };
    if (offset === 0) {
      after();
    } else {
      this.afterTransitionend(after);
    }

    return this;
  }

  toggle(condition: boolean) {
    if (condition === true) {
      this.open();
    } else if (condition === false) {
      this.close();
    } else {
      this.toggle(this.state.closed || this.state.closing);
    }
    return this;
  }

  protected disabled = false;

  /** Disable the menu functionality */
  disable() {
    this.disabled = true;
    return this;
  }

  /** Enabled to menu functionality */
  enable() {
    this.disabled = false;
    return this;
  }

  protected afterTransitionend(callback: Function) {}

  /** get offset from the default (closed) position */
  protected offset() {
    return 0;
  }
}
