const fs = require('fs');
const path = require('path');
const mime = require('mime-types');
const Busboy = require('busboy');
const { Writable } = require('stream');
const { save } = require('../../db/redis/redis');
const { CONFIG } = require('../../config');

function randomFileName(mimetype) {
  return (
    new Date().getTime() +
    '-' +
    Math.round(Math.random() * 1000) +
    '.' +
    mime.extension(mimetype)
  );
}

function addTask(req, res) {
  const busboy = new Busboy({ headers: req.headers });

  let job = '';
  let worker = '';

  function abort() {
    req.unpipe(busboy);
    if (!req.aborted) {
      res.statusCode = 413;
      res.end();
    }
  }

  busboy.on('field', (fieldname, val) => {
    switch (fieldname) {
      case 'job':
        job = val;
        break;
      case 'worker':
        worker = val;
        break;
      case 'worker':
        status = (val === "") ? 'unfinished' : val;
        break;

      default:
        break;
    }
  });
  busboy.on('finish', async () => {
    const input = {
      job: job,
      worker: worker,
      status : status,
    };
    await save(CONFIG.TASK, input);
    console.log(input);
    res.end();
  });

  req.on('aborted', abort);
  busboy.on('error', abort);

  req.pipe(busboy);
}

function uploadAttachment(req, res) {
  const busboy = new Busboy({ headers: req.headers });

  function abort() {
    req.unpipe(busboy);
    if (!req.aborted) {
      res.statusCode = 413;
      res.end();
    }
  }

  busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
    switch (fieldname) {
      case 'photo':
        {
          const destname = randomFileName(mimetype);
          const store = fs.createWriteStream(
            path.resolve(__dirname, `../../db/task-files/${destname}`)
          );
          file.on('error', abort);
          store.on('error', abort);
          file.pipe(store);
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

  busboy.on('finish', async () => {
    res.end();
  });

  req.on('aborted', abort);
  busboy.on('error', abort);

  req.pipe(busboy);
}

module.exports = {
  addTask,
  uploadAttachment,
};
