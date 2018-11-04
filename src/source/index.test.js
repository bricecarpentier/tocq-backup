const index = require('./index');
const source = require('./source');

jest.mock('./source');


beforeEach(() => {
  source.mockReset();
})


it('should return the source module', () => {
  source.mockName = 'toto';
  expect(index).mockName = 'toto';
});
