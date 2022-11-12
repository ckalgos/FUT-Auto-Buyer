export const runHooks = <T extends (...args: any) => any>(
  hooks: T[],
  params: Parameters<T>[number]
) => {
  for (const hook of hooks) {
    const errorMessage = hook(params);
    if (errorMessage) {
      return errorMessage;
    }
  }
  return null;
};
