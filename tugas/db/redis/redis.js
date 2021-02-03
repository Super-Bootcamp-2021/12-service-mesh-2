const redis = require('redis');
const client = redis.createClient();
const { promisify } = require('util');

const hvalsAsync = promisify(client.hvals).bind(client);

function connect() {
  return new Promise((resolve, reject) => {
    client.on('connect', () => resolve());
    client.on('error', (error) => {
      reject(error);
      client.end(true);
    });
  });
}

async function save(db, data) {
  await client.hmset(db, (data.job) ? data.job : data.email , JSON.stringify(data));
}

async function del(db) {
  await client.del(db);
}

async function read(db) {
  let value = await hvalsAsync(db);
  return value

}

async function update(db, data) {
  await client.hset(db, (data.job) ? data.job : data.email, dataJSON.stringify(data));
}

module.exports = {
  connect,
  save,
  del,
  read,
  update,
};
