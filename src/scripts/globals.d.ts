// Globals shared between the concatenated browser scripts (src/scripts/*.js).
interface DFApi {
  root: HTMLElement;
  reduce: MediaQueryList;
  each(list: ArrayLike<Element>, fn: (el: any, i: number) => void): void;
  onMedia(mq: MediaQueryList, fn: (e: MediaQueryListEvent) => void): void;
  motionOn(): boolean;
  onMotion(fn: () => void): void;
  watch(el: Element, fn: (on: boolean) => void, margin?: string): void;
  toTop(home?: boolean): void;
}
interface Window {
  DF: DFApi;
  PortfolioDemos: any;
  PortfolioWalkthrough: any;
}
