import { Observable } from "../types/interfaces/observables/Observable.interface";

export const observableToPromise = <T>(observable: Observable<T>) => {
  return new Promise<T>((resolve, reject) => {
    observable.observe(this, (_, { data, success, error }) => {
      if (success) resolve(data);
      else reject(error.code);
    });
  });
};
