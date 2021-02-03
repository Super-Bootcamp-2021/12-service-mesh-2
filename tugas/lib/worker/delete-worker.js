const { CONFIG } = require('../../config');
const { del } = require('../../db/redis/redis');

function deleteWorkers(res) {
  del(CONFIG.WORKER);
  res.end()
}

module.exports = { deleteWorkers };
