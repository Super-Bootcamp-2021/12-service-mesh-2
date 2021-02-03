const { connect } = require('./db/redis/redis');
const { start } = require('./services/service');
function main() {
  connect();
  start();
}
main();
