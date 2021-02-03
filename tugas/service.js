const { createServer } = require('http');
const url = require('url');
const { stdout } = require('process');
const { workerStore, workersRead } = require('./workers/workers-service');
const { taskStore, tasksRead } = require('./tasks/tasks-service');

const server = createServer((req, res) => {
  let method = req.method;
  // route service
  let message = 'tidak ditemukan data';
  let statusCode = 200;
  const uri = url.parse(req.url, true);
  const respond = () => {
    res.statusCode = statusCode;
    res.write(message);
    res.end();
  };
  switch (true) {
    case uri.pathname === '/workerstore':
      if (method === 'POST') {
        workerStore(req, res);
      } else {
        message = 'Method tidak tersedia';
        respond();
      }
      break;
		case uri.pathname === '/taskstore':
      if (method === 'POST') {
        taskStore(req, res);
      } else {
        message = 'Method tidak tersedia';
        respond();
      }
      break;
		case uri.pathname === '/workersread':
      if (method === 'GET') {
        workersRead(req, res);
      } else {
        message = 'Method tidak tersedia';
        respond();
      }
      break;
		case uri.pathname === '/tasksread':
      if (method === 'GET') {
        tasksRead(req, res);
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
