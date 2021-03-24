import Pulling from './pulling';

export default class TouchPulling extends Pulling {
  constructor(options: Options) {
    super(options);

    this.touch = options.touch !== false;
    this.ignoreScrollables = options.ignoreScrollables !== false;

    if (this.touch) {
      this.addTouchEvents();
    }
  }
  protected touch: boolean;
  protected ignoreScrollables: boolean;

  protected touched = false;

  /** set offset */
  protected applyOffset(offset: number) {}

  protected initTouchEvents() {
    // tslint:disable-next-line no-this-assignment
    const { width, margin, side, slope, sensitivity, menu, panel } = this;

    const sign = (side === 'left' ? 1 : -1);

    let startClientX = 0;
    let startClientY = 0;

    let lastClientX = 0;

    let startOffset = 0;

    let prevTime = 0;
    let lastTime = 0;

    let prevClientX = 0;

    let firstMove = false;

    const scrollable = (elem: HTMLElement | null): boolean => {
      if (
        !elem ||
        elem === document.documentElement ||
        elem === document.body
      ) {
        return false;
      }

      const { overflowX, overflowY } = getComputedStyle(elem);

      return overflowX === 'auto' ||
        overflowX === 'scroll' ||
        (overflowX === 'visible' && overflowY !== 'visible') ||
        scrollable(elem.parentElement);
    };

    const onTouchstart = (e: TouchEvent) => {
      const target = e.target as HTMLElement;

      if (this.ignoreSelector && (target).matches(this.ignoreSelector)) {
        return;
      }

      // ignore when the element is scrollable
      if (this.ignoreScrollables && scrollable(target)) {
        return;
      }

      this.emit('touchstart', e);
      if (this.disabled) {
        return;
      }

      this.touched = false;
      if (e.touches.length !== 1) {
        return;
      }

      const { clientX, clientY } = e.touches[0];
      const offset = this.offset();
      const region = margin + offset;

      if (side === 'left' && clientX <= region ||
        side === 'right' && window.innerWidth - clientX <= region) {
        this.touched = true;

        startClientX = clientX;
        startClientY = clientY;

        lastClientX = clientX;

        startOffset = offset;

        lastTime = Date.now();

        firstMove = true;
      }
    };

    const onTouchmove = (e: TouchEvent) => {
      this.emit('touchmove', e);

      if (this.disabled || !this.touched) {
        return;
      }

      const { clientX, clientY } = e.touches[0];
      const diffX = (clientX - startClientX) * sign;

      if (Math.abs(diffX) < 10) {
        return;
      }

      if (firstMove) {
        const diffY = clientY - startClientY;
        const currentSlope = Math.abs(diffY / diffX);
        if (currentSlope > slope) {
          this.touched = false;
          return;
        }

        if (this.state.closed && diffX > 0) {
          this.emit('beforeopen');
        } else if (this.state.opened) {
          this.emit('beforeopen');
        }

        menu.style.transition = '';
        panel.style.transition = '';
      }

      if (this.state.opened && diffX > 0 || this.state.closed && diffX < 0) {
        lastClientX = clientX;
        lastTime = Date.now();

        return;
      }

      this.state.opened = false;
      this.state.closed = false;

      const dx = (clientX - lastClientX) * sign;

      const opening = dx > 0;
      this.state.opening = opening;
      this.state.closing = !opening;

      const offset = Math.min(Math.max(0, startOffset + diffX), width);
      this.applyOffset(offset);

      prevClientX = lastClientX;
      lastClientX = clientX;

      prevTime = lastTime;
      lastTime = Date.now();
      firstMove = false;
    };

    const onTouchend = (e: TouchEvent) => {
      if (!this.touched) {
        return;
      }

      this.touched = false;
      if (firstMove) {
        return;
      }

      this.emit('touchend', e);

      Object.assign(this.panel.style, this.styles.base.panel);
      Object.assign(this.menu.style, this.styles.base.menu);

      const offset = this.offset();
      const { clientX } = e.changedTouches[0];

      let x1;
      let t1;

      if (clientX === lastClientX) {
        x1 = prevClientX;
        t1 = prevTime;
      } else {
        x1 = lastClientX;
        t1 = lastTime;
      }

      const x2 = clientX;
      const t2 = Date.now();

      const speed = (x2 - x1) / (t2 - t1) * sign;

      if (
        offset > width / 2 &&
        speed > -sensitivity ||
        speed > sensitivity
      ) {
        this.open(e);
      } else {
        this.close(e);
      }
    };

    return {
      onTouchstart,
      onTouchmove,
      onTouchend,
    };
  }
  protected touchEvents: {
    onTouchstart(e: TouchEvent): void,
    onTouchmove(e: TouchEvent): void,
    onTouchend(e: TouchEvent): void,
  };
  protected addTouchEvents() {
    if (!this.touchEvents) {
      this.touchEvents = this.initTouchEvents();
    }
    document.documentElement.addEventListener('touchstart', this.touchEvents.onTouchstart, false);
    document.documentElement.addEventListener('touchmove', this.touchEvents.onTouchmove, false);
    document.documentElement.addEventListener('touchend', this.touchEvents.onTouchend, false);
  }
  protected removeTouchEvents() {
    document.documentElement.removeEventListener('touchstart', this.touchEvents.onTouchstart);
    document.documentElement.removeEventListener('touchmove', this.touchEvents.onTouchmove);
    document.documentElement.removeEventListener('touchend', this.touchEvents.onTouchend);
  }

  protected ignores: string[] = [];
  protected ignoreSelector: string = '';

  /** Ignore touch events from elements matching a given selector */
  ignore(selector: string) {
    this.ignores.push(selector);
    this.ignoreSelector = this.ignores.join(', ');
    return this;
  }
  /**
   * Remove selector from ignore list
   * _Does not_ override `ignore`
   */
  unignore(selector: string) {
    this.ignores = this.ignores.filter(s => s !== selector);
    this.ignoreSelector = this.ignores.join(', ');
    return this;
  }

  /** enable touch functionality */
  enableTouch() {
    if (!this.touch) {
      this.addTouchEvents();
      this.touch = true;
    }
    return this;
  }

  /** disable touch functionality */
  disableTouch() {
    if (this.touch) {
      this.removeTouchEvents();
      this.touch = false;
    }
    return this;
  }
}
