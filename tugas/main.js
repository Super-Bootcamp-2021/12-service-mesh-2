const redis = require('./lib/redis');
const server = require('./worker/server');

/**
 * main routine
 * @returns {Promise<void>}
 */
async function main() {
  try {
    console.log('connect to redis service...');
    await redis.connect();
    console.log('redis connected');
  } catch (err) {
    console.error('redis connection failed');
    return;
  }

  console.log('running service...');
  server.run();
}

main();
