const JSONStream = require('JSONStream');
const getCurrentEventId = require('./getCurrentEventId');
const getStream = require('./getStream');


const tocqSource = ({ serverURL }) => async lastEventId => {
  const currentId = await getCurrentEventId(serverURL);
  const stream = getStream(serverURL, lastEventId, currentId);
  return stream.pipe(JSONStream.stringify());
};


module.exports = tocqSource;
