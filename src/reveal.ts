import TouchPulling from './touch';

export default class Reveal extends TouchPulling {
  constructor(options: Options) {
    super(options);

    this.styles.base.menu = {
      overflowX: 'hidden',
      overflowY: 'auto',

      position: 'fixed',
      [this.side]: '0',
      top: '0',
      bottom: '0',
      width: `${this.width}px`,
    };
    this.styles.base.panel = {
      transition: `transform ${this.timing}ms ${this.timingFunction}`,
    };
    this.styles.open.panel = {
      transform: `translateX(${this.side === 'right' ? '-' : ''}${this.width}px)`,
    };
    this.styles.closed.panel = {
      transform: `translateX(0)`,
    };

    Object.assign(this.menu.style, this.styles.base.menu, this.styles.closed.menu);
    Object.assign(this.panel.style, this.styles.base.panel, this.styles.closed.panel);

    this.initTransitionend();
  }

  protected offset() {
    const panelPos = this.panel.getBoundingClientRect();
    return Math.abs(panelPos.left);
  }

  protected applyOffset(offset: number) {
    const sign = (this.side === 'left' ? 1 : -1);
    this.panel.style.transform = `translateX(${offset * sign}px)`;
  }

  private onTransitionend: Function | null;

  protected afterTransitionend(callback: Function) {
    this.onTransitionend = callback;
  }

  private initTransitionend() {
    this.panel.addEventListener('transitionend', () => {
      if (this.onTransitionend) {
        this.onTransitionend();
      }

      this.onTransitionend = null;
    }, false);
  }
}

TouchPulling.modes['reveal'] = Reveal;
