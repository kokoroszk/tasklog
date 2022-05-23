export const preventDuplicateExec = <T extends (...args: any) => void>(f: T) => {
  let flg = false;
  return async (...args: Parameters<typeof f>) => {
    if (flg) return;
    flg = true;
    await f(...args);
    flg = false;
  };
};
