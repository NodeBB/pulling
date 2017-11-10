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

      zIndex: '-1',
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

    if (this.touch) {
      this.addTouchEvents();
    }
  }

  protected offset() {
    const panelPos = this.panel.getBoundingClientRect();
    return Math.abs(panelPos.left);
  }

  protected applyOffset(offset: number) {
    const sign = (this.side === 'left' ? 1 : -1);
    this.panel.style.transform = `translateX(${offset * sign}px)`;
  }

  private prevTransitionEnd: EventListener;

  protected afterTransitionend(callback: Function) {
    const after = () => {
      this.panel.removeEventListener('transitionend', after);
      callback();
    };
    this.panel.removeEventListener('transitionend', this.prevTransitionEnd);
    this.prevTransitionEnd = after;
    this.panel.addEventListener('transitionend', after, false);
  }
}

TouchPulling.modes['reveal'] = Reveal;
