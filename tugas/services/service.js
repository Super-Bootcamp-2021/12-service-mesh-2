const { createServer } = require('http');
const { uploadFiles } = require('../lib/create-function');

const server = new createServer((req, res) => {
  uploadFiles(req, res);
});

const PORT = 1979;

server.listen(PORT, () => {
  process.stdout.write(`server listening on port ${PORT}\n`);
});
