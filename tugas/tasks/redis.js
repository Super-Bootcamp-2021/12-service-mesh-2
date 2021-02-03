const redis = require('redis');
const { promisify } = require('util');
const client = redis.createClient();

const lsetAsync = promisify(client.lset).bind(client);
const rpushAsync = promisify(client.rpush).bind(client);
const lrangeAsync = promisify(client.lrange).bind(client);

client.on('error', (error) => {
  console.error(error);
  client.end(true);
});

async function rpushRedis(key, value) {
  try {
    await rpushAsync(key, value);
  } catch (err) {
    console.error(err);
  }
}
async function lrangeRedis(key) {
  try {
    return await lrangeAsync(key, 0, -1);
  } catch (err) {
    console.error(err);
  }
}
async function lsetRedis(key, index, value) {
  try {
    return await lsetAsync(key, index, value);
  } catch (err) {
    console.error(err);
  }
}

module.exports = {
  rpushRedis,
  lrangeRedis,
  lsetRedis,
};
