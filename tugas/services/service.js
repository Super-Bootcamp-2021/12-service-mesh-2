const { createServer } = require('http');
const url = require('url');
const { stdout } = require('process');
<<<<<<< HEAD
const {  addWorkers, readWorkers } = require('../lib/worker/main');
=======
const { addWorkers,uploadFoto } = require('../lib/worker/create-worker');
const { addTask } = require('../lib/task/create-task');
>>>>>>> ded788e141db665e0d92bac50cc64de3a3f6bd2a

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
    case uri.pathname === '/add-worker':
      if (method === 'POST') {
        addWorkers(req, res);
      } else {
        message = 'Method tidak tersedia';
        respond();
      }
      break;
    case uri.pathname === '/add-task':
      if (method === 'POST') {
        addTask(req, res);
      } else {
        message = 'Method tidak tersedia';
        respond();
      }
      break;
    case uri.pathname == '/read-worker' :
      if (method === 'GET') {
        readWorkers(req, res);
      }
      else {
        message = 'Method tidak tersedia';
        respond();
      }
    case uri.pathname === '/upload-photo':
        if (method === 'POST') {
          uploadFoto(req, res);
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

function start() {
  const PORT = 1979;
  server.listen(PORT, () => {
    stdout.write(`server listening on port ${PORT}\n`);
  });
}

module.exports = { server, start };
