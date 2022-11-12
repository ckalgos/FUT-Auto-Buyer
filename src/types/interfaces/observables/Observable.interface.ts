interface ObservableError {
  code: string;
}

interface ObservableResponse<T> {
  success: boolean;
  data: T;
  error: ObservableError;
}

export interface Observable<T> {
  observe(
    context?: unknown,
    cb?: (
      sender: { unobserve(...args: unknown[]): void },
      response: ObservableResponse<T>
    ) => void
  ): void;
}

export interface EAObservable<T = unknown> extends Observable<T> {
  new (): EAObservable<T>;
  notify(r: unknown): void;
}
