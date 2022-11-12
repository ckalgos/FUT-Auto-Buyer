export interface UTTabBarItemView {
  new (): UTTabBarItemView;
  init(): void;
  setTag(param: number): void;
  setText(param: string): void;
  addClass(param: string): void;
}
