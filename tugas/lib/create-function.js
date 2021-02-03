const fs = require('fs');
const path = require('path');
const mime = require('mime-types');
const Busboy = require('busboy');
const { Writable } = require('stream');

function randomFileName(mimetype) {
  return (
    new Date().getTime() +
    '-' +
    Math.round(Math.random() * 1000) +
    '.' +
    mime.extension(mimetype)
  );
}

function uploadFiles(req, res) {
  const busboy = new Busboy({
    headers: req.headers,
  });

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
            path.resolve(__dirname, `./data/photos/${destname}`)
          );
          file.on('error', abort);
          store.on('error', abort);
          file.pipe(store);
        }
        break;
      case 'task':
        {
          const destname = randomFileName(mimetype);
          const store = fs.createWriteStream(
            path.resolve(__dirname, `./data/task-files/${destname}`)
          );
          file.on('error', abort);
          store.on('error', abort);
          file.pipe(store);
        }
        break;
      default: {
        const noop = new Writable({
          write(chunk, encoding, callback) {
            setImmediate(callback);
          },
        });
        file.pipe(noop);
      }
    }
  });

  busboy.on('field', (fieldname, val) => {
    console.log(val);
  });
  busboy.on('finish', () => {
    res.end();
  });

  req.on('aborted', abort);
  busboy.on('error', abort);

  req.pipe(busboy);
}

module.exports = {
  uploadFiles,
};
