const { createServer } = require('http');
const url = require('url');
const { stdout } = require('process');
const { readWorkers } = require('../lib/read-function');
const { deleteWorkers } = require('../lib/delete-function');

const server = createServer((req, res) => {
  let method = req.method;
  let message = 'tidak ditemukan data';
  let statusCode = 200;
  const uri = url.parse(req.url, true);
  const respond = () => {
    res.statusCode = statusCode;
    res.write(message);
    res.end();
  };
  switch (true) {
    case uri.pathname === '/add':
        if (method === 'POST') {
            uploadService(req, res);
        } else {
            message = 'Method tidak tersedia';
            respond();
        }
        break;
    case /^\/read\/\w+/.test(uri.pathname):
        if (method === 'GET') {
            readWorkers(req, res);
        } else {
            message = 'Method tidak tersedia';
            respond();
        }
        break;
    case /^\/delete\/\w+/.test(uri.pathname):
        if (method === 'DELETE') {
            deleteWorkers(req, res);
        } else {
            message = 'Method tidak tersedia';
            respond();
        }
        break;
    default:
      statusCode = 404;
      respond();
  }
});

const PORT = 9999;
server.listen(PORT, () => {
  stdout.write(`server listening on port ${PORT}\n`);
});
