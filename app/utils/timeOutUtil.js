export const setRandomInterval = (intervalFunction, start, end) => {
  let timeout;
  let isCleared = false;

  const runInterval = () => {
    if (isCleared) return;
    const timeoutFunction = () => {
      intervalFunction();
      runInterval();
    };

    const delay = Math.round(Math.random() * (end - start) + start) * 1000;
    timeout = setTimeout(timeoutFunction, delay);
  };

  runInterval();

  return {
    clear() {
      isCleared = true;
      clearTimeout(timeout);
    },
  };
};
