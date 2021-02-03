const Busboy = require('busboy');
const url = require('url');
const { Writable } = require('stream');
const {
  register,
  list,
  remove,
  ERROR_REGISTER_DATA_INVALID,
  ERROR_WORKER_NOT_FOUND,
} = require('./worker');
const { saveFile } = require('../lib/storage');
// eslint-disable-next-line no-unused-vars
const { IncomingMessage, ServerResponse } = require('http');

/**
 * service to register new worker
 * @param {IncomingMessage} req
 * @param {ServerResponse} res
 */
function registerSvc(req, res) {
  const busboy = new Busboy({ headers: req.headers });

  const data = {
    name: '',
    age: 0,
    bio: '',
    address: '',
    photo: '',
  };

  let finished = false;

  function abort() {
    req.unpipe(busboy);
    if (!req.aborted) {
      res.statusCode = 413;
      res.end();
    }
  }

  busboy.on('file', async (fieldname, file, filename, encoding, mimetype) => {
    switch (fieldname) {
      case 'photo':
        try {
          data.photo = await saveFile(file, mimetype);
        } catch (err) {
          abort();
        }
        try {
          const worker = await register(data);
          res.setHeader('content-type', 'application/json');
          res.write(JSON.stringify(worker));
        } catch (err) {
          if (err === ERROR_REGISTER_DATA_INVALID) {
            res.statusCode = 401;
          } else {
            res.statusCode = 500;
          }
          res.write(err);
        }
        if (finished) {
          res.end();
        }
        break;
      default: {
        const noop = new Writable({
          write(chunk, encding, callback) {
            setImmediate(callback);
          },
        });
        file.pipe(noop);
      }
    }
  });

  busboy.on('field', (fieldname, val) => {
    if (['name', 'age', 'bio', 'address'].includes(fieldname)) {
      data[fieldname] = val;
    }
  });

  busboy.on('finish', async () => {
    finished = true;
  });

  req.on('aborted', abort);
  busboy.on('error', abort);

  req.pipe(busboy);
}

/**
 * service to get list of workers
 * @param {IncomingMessage} req
 * @param {ServerResponse} res
 */
async function listSvc(req, res) {
  const workers = await list();
  res.setHeader('content-type', 'application/json');
  res.write(JSON.stringify(workers));
  res.end();
}

/**
 * service to remove a worker by it's id
 * @param {IncomingMessage} req
 * @param {ServerResponse} res
 */
async function removeSvc(req, res) {
  const uri = url.parse(req.url, true);
  const id = uri.query['id'];
  if (!id) {
    res.statusCode = 401;
    res.write('parameter id tidak ditemukan');
    res.end();
    return;
  }
  try {
    const worker = await remove(id);
    res.setHeader('content-type', 'application/json');
    res.statusCode = 200;
    res.write(JSON.stringify(worker));
    res.end();
  } catch (err) {
    if (err === ERROR_WORKER_NOT_FOUND) {
      res.statusCode = 404;
      res.write(err);
      res.end();
      return;
    }
    res.statusCode = 500;
    res.end();
    return;
  }
}

module.exports = {
  listSvc,
  registerSvc,
  removeSvc,
};
