const redis = require('redis');
const client = redis.createClient();

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
  await client.hmset(db,data.email.toString(), JSON.stringify(data));
}

async function del(db, data) {
  await client.del();
}

async function read(db) {
  await client.get(db);
}

async function update(db, data) {
  await client.keys(db, JSON.stringify(data));
}

module.exports = {
  connect,
  save,
  del,
  read,
  update,
};
