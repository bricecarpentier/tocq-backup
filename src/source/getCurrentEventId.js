const fetch = require('fetch-json');


const getCurrentEventId = async serverURL => {
  const url = `${serverURL}/status`;
  const data = await fetch.get(url);
  return data.current;
};


module.exports = getCurrentEventId;
