/* eslint-env jest */
const { PassThrough, Readable, Stream } = require('stream');
const source = require('./source');
const getCurrentEventId = require('./getCurrentEventId');
const getStream = require('./getStream');


jest.mock('./getCurrentEventId');
jest.mock('./getStream');


const URL = 'http://tocq.test';


beforeEach(() => {
  getCurrentEventId.mockClear();
  getStream.mockClear();
});


it('returns a closure', () => {
  expect(typeof source({ serverURL: URL })).toBe('function');
});


it('returns a stream from the specified event to the current one', async () => {
  const uut = source({ serverURL: URL });
  getCurrentEventId.mockResolvedValue(42);
  const rs = new Readable({ objectMode: true, read() {} });
  getStream.mockReturnValue(rs);

  const { stream, currentId } = await uut(40);

  expect(stream).toBeInstanceOf(Stream);
  expect(currentId).toBe(42);
  expect(getStream).toHaveBeenCalledWith(URL, 40, 42);
  
  let s = '';
  stream.on('data', chunk => s += chunk);
  
  stream.resume();
  rs.push({ type: 'type1', sequenceId: 40 });
  rs.push({ type: 'type1', sequenceId: 41 });
  rs.push({ type: 'type1', sequenceId: 42 });
  rs.emit('end');

  const expected = `[
{"type":"type1","sequenceId":40}
,
{"type":"type1","sequenceId":41}
,
{"type":"type1","sequenceId":42}
]
`;
  expect(s).toBe(expected);
});

