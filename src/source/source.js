const JSONStream = require('JSONStream');
const getCurrentEventId = require('./getCurrentEventId');
const getStream = require('./getStream');


const tocqSource = ({ serverURL }) => async lastEventId => {
  const currentId = await getCurrentEventId(serverURL);
  const stream = getStream(serverURL, lastEventId, currentId);
  return {
    stream: stream.pipe(JSONStream.stringify(), { end: true }),
    currentId,
  };
};


module.exports = tocqSource;
