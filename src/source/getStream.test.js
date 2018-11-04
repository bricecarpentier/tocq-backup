/* eslint-env jest */
const EventSource = require('eventsource');
const { finished, Readable } = require('stream');
const getStream = require('./getStream');


jest.mock('eventsource');


beforeEach(() => {
  EventSource.mockClear();
});


const mockEventSource = () => {
  const es = { close: jest.fn() };
  EventSource.mockImplementationOnce(() => es);

  return es;
}


it('should create an EventSource object with the subscribe url and Last-Event-ID', () => {
  const es = mockEventSource();

  getStream('http://tocq.test', 42, 99);
  expect(EventSource).toHaveBeenCalledWith(
    'http://tocq.test/subscribe',
    { headers: { 'Last-Event-ID': 42 },
  });
  expect(es.onmessage).toBeDefined();
  expect(es.onerror).toBeDefined();
});


it('should return a readable stream', () => {
  const es = mockEventSource();
  const stream = getStream('http://tocq.test', 42, 99);
  expect(stream).toBeInstanceOf(Readable);
});


it('push messages to the stream', () => {
  const es = mockEventSource();
  const stream = getStream('http://tocq.test', 42, 44);

  es.onmessage({ data: JSON.stringify({ type: 'type1', sequenceId: 42 }) });
  es.onmessage({ data: JSON.stringify({ type: 'type2', sequenceId: 43 }) });
  es.onmessage({ data: JSON.stringify({ type: 'type1', sequenceId: 44 }) });

  let chunk;
  chunk = stream.read();
  expect(chunk).toEqual({ type: 'type1', sequenceId: 42 });
  chunk = stream.read();
  expect(chunk).toEqual({ type: 'type2', sequenceId: 43 });
});


it('closes the stream when sequenceId equals the to parameter', async () => {
  const es = mockEventSource();
  const stream = getStream('http://tocq.test', 42, 44);

  es.onmessage({ data: JSON.stringify({ type: 'type1', sequenceId: 42 }) });
  es.onmessage({ data: JSON.stringify({ type: 'type2', sequenceId: 43 }) });
  es.onmessage({ data: JSON.stringify({ type: 'type1', sequenceId: 44 }) });

  await finished(stream);
  expect(es.close).toHaveBeenCalled();
});


it('closes the stream an error occurs', async () => {
  const es = mockEventSource();
  const stream = getStream('http://tocq.test', 42, 44);

  es.onerror(new Error());

  await finished(stream);
  expect(es.close).toHaveBeenCalled();
});

