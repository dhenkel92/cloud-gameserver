export async function wait(forTime: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(null), forTime);
  });
}
