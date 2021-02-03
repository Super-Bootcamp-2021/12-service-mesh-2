const { CONFIG } = require('../../config');
const { read } = require('../../db/redis/redis');

async function readWorkers(req, res) {  
    const data = await read(CONFIG.WORKER);  
    const dataParsed = await JSON.stringify(data);
    const dataFinal = await dataParsed.replace(/\\/g, '');
    res.write(dataFinal);
    res.end();
}

module.exports = {
  readWorkers,
};
