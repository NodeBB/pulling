import TouchPulling from './touch';

export default class Drawer extends TouchPulling {
  constructor(options: Options) {
    super(options);

    this.styles.base.menu = {
      transition: `transform ${this.timing}ms ${this.timingFunction}`,

      overflowX: 'hidden',
      overflowY: 'auto',

      position: 'fixed',
      [this.side]: `-${this.width}px`,
      top: '0',
      bottom: '0',
      width: `${this.width}px`,

      zIndex: '1',
    };
    this.styles.open.menu = {
      transform: `translateX(${this.side === 'right' ? '-' : ''}${this.width}px)`,
    };
    this.styles.closed.menu = {
      transform: `translateX(0)`,
    };

    Object.assign(this.menu.style, this.styles.base.menu, this.styles.closed.menu);
    Object.assign(this.panel.style, this.styles.base.panel, this.styles.closed.panel);

    this.initTransitionend();
  }

  protected offset() {
    const menuPos = this.menu.getBoundingClientRect();
    if (this.side === 'left') {
      return menuPos.left + this.width;
    }
    return window.innerWidth - menuPos.left;
  }

  protected applyOffset(offset: number) {
    const sign = (this.side === 'left' ? 1 : -1);
    this.menu.style.transform = `translateX(${offset * sign}px)`;
  }

  private onTransitionend: Function | null;

  protected afterTransitionend(callback: Function) {
    this.onTransitionend = callback;
  }

  private initTransitionend() {
    this.menu.addEventListener('transitionend', () => {
      if (this.onTransitionend) {
        this.onTransitionend();
      }

      this.onTransitionend = null;
    }, false);
  }
}

TouchPulling.modes['drawer'] = Drawer;
