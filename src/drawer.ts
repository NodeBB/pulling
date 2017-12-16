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

  private prevTransitionEnd: EventListener;

  protected afterTransitionend(callback: Function) {
    const after = () => {
      this.menu.removeEventListener('transitionend', after);
      callback();
    };
    this.menu.removeEventListener('transitionend', this.prevTransitionEnd);
    this.prevTransitionEnd = after;
    this.menu.addEventListener('transitionend', after, false);
  }
}

TouchPulling.modes['drawer'] = Drawer;
