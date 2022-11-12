export class Timer {
  private isCleared: boolean;
  private timeout: number;
  constructor(
    private readonly intervalFunction: Function,
    private readonly start: number,
    private readonly end: number
  ) {
    this.isCleared = false;
    this.timeout = 0;
  }

  private runInterval() {
    if (this.isCleared) return;
    const searchInterval = {
      start: Date.now(),
      end: 0,
    };
    const timeoutFunction = () => {
      this.intervalFunction();
      this.runInterval();
    };

    const delay =
      parseFloat(
        (Math.random() * (this.end - this.start) + this.start).toFixed(1)
      ) * 1000;
    searchInterval.end = searchInterval.start + delay;
    this.timeout = window.setTimeout(timeoutFunction, delay);
  }

  stop() {
    this.isCleared = true;
    clearTimeout(this.timeout);
  }

  run() {
    this.isCleared = false;
    this.intervalFunction();
    this.runInterval();
  }
}
