// Globals shared between the concatenated browser scripts (src/scripts/*.js).
interface DFApi {
  root: HTMLElement;
  reduce: MediaQueryList;
  each(list: ArrayLike<Element>, fn: (el: any, i: number) => void): void;
  onMedia(mq: MediaQueryList, fn: (e: MediaQueryListEvent) => void): void;
  motionOn(): boolean;
  onMotion(fn: () => void): void;
  watch(el: Element, fn: (on: boolean) => void, margin?: string): void;
}
interface Window {
  DF: DFApi;
  DFTerminal: any;
  PortfolioDemos: any;
  PortfolioWalkthrough: any;
}
