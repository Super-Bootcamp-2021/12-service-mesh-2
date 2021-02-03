const { CONFIG } = require('../../config');
const { del } = require('../../db/redis/redis');

function deleteWorkers() {
  del(CONFIG.WORKER);
  res.end()
}

module.exports = { deleteWorkers };
