const { startRedis } = require('./redis');
const { serve } = require('./lib/server');

async function main() {
  await startRedis('connect');
  serve();
}

main();
