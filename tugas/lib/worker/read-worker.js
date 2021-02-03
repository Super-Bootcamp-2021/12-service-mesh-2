const { CONFIG } = require('../../config');
const { read } = require('../../db/redis/redis');

async function readWorkers(req, res) {  
    const data = await read(CONFIG.WORKER);  
    const dataParsed = await JSON.stringify(data)
    res.write(JSON.stringify(JSON.parse(dataParsed)));
    res.end();
}

module.exports = {
  readWorkers,
};
