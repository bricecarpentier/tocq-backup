const EventSource = require('eventsource');
const { Readable } = require('stream');


const end = (es, stream) => {
  stream.destroy();
  es.close();
};


const getStream = (serverURL, from, to) => {
  const headers = { 'Last-Event-ID': from };
  const es = new EventSource(`${serverURL}/subscribe`, { headers });

  const stream = new Readable({ objectMode: true, read() {} });
  es.onmessage = data => {
    const event = JSON.parse(data.data);
    stream.push(event);
    if (event.sequenceId === to) {
      end(es, stream);
    }
  }
  es.onerror = () => end(es, stream);

  return stream;
}


module.exports = getStream;
