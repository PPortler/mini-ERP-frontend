const delayMs = 400; // ค่า default

export const delay = (ms?: number) => new Promise<void>(resolve => {
  setTimeout(resolve, ms ?? delayMs);
});