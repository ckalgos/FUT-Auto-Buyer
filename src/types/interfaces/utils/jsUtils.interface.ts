export interface JSUtils {
  inherits(param1: unknown, param2: unknown): void;
  find<T>(param1: T[], cb: (param: T) => boolean): T;
  isEmpty(param: unknown): boolean;
}
