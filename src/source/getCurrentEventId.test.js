/* eslint-env jest */
const fetch = require('fetch-json');
const getCurrentEventId = require('./getCurrentEventId');


jest.mock('fetch-json');


beforeEach(() => {
  fetch.get.mockClear();
})


it('should fail if the fetch requests fails', async () => {
  const errorSymbol = Symbol('error');
  fetch.get.mockRejectedValue(errorSymbol);

  try {
    await getCurrentEventId('whatever');
  } catch (error) {
    expect(error).toBe(errorSymbol);
  }
});


it('should resolve with the current event id', async () => {
  fetch.get.mockResolvedValue({ status: 'OK', current: 42 });

  expect(await getCurrentEventId('whatever')).toBe(42);
  expect(fetch.get).toHaveBeenCalledWith('whatever/status');
});
