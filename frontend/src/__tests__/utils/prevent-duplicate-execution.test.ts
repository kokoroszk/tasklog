import { preventDuplicateExec } from 'utils/prevent-duplicate-execution';

describe('preventDuplicateExec', () => {
  it('ラップした関数が実行可能', async () => {
    const mock = jest.fn();
    const callMock = preventDuplicateExec((n: number) => mock(n + 1));
    await callMock(10);
    expect(mock).toBeCalledTimes(1);
    expect(mock).toBeCalledWith(11);
  });

  it('ラップした関数を同時に二回実行不可能', async () => {
    const mock = jest.fn();
    const callMock = preventDuplicateExec(async (n: number) => {
      await new Promise((resolve) => setTimeout(resolve, 10));
      mock(n + 1);
    });
    await Promise.all([callMock(10), callMock(20)]);
    expect(mock).toBeCalledTimes(1);
    expect(mock).toBeCalledWith(11);
  });

  it('ラップした関数を順番に二回実行可能', async () => {
    const mock = jest.fn();
    const callMock = preventDuplicateExec(async (n: number) => {
      await new Promise((resolve) => setTimeout(resolve, 10));
      mock(n + 1);
    });
    await callMock(10);
    await callMock(20);
    expect(mock).toBeCalledTimes(2);
    expect(mock).nthCalledWith(1, 11);
    expect(mock).nthCalledWith(2, 21);
  });
});
