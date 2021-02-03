const { createServer } = require('http');
const url = require('url');
const { stdout } = require('process');
const { uploadFiles,addWorkers } = require('../lib/create-function');

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
            addWorkers(req, res);
        } else {
            message = 'Method tidak tersedia';
            respond();
        }
        break;
    case uri.pathname === '/upload':
          if (method === 'POST') {
              uploadFiles(req, res);
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

const PORT = 1979;
server.listen(PORT, () => {
  stdout.write(`server listening on port ${PORT}\n`);
});

