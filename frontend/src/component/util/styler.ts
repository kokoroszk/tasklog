class stylerclass {
  constructor(private buf: string[]) {}
  add = (className: string) => {
    this.buf.push(className);
    return this;
  };
  build = () => this.buf.join(' ');
}

export const styler = (...classNames: string[]) => new stylerclass(classNames);
