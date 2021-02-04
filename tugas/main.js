const kv = require('./lib/kv');
const server = require('./worker/server');

/**
 * main routine
 * @returns {Promise<void>}
 */
async function main() {
  try {
    console.log('connect to KV service...');
    await kv.connect();
    console.log('KV connected');
  } catch (err) {
    console.error('KV connection failed');
    return;
  }

  console.log('running service...');
  server.run();
}

main();
