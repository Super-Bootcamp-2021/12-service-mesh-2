const fs = require('fs');
const path = require('path');
const mime = require('mime-types');
const Busboy = require('busboy');
const url = require('url');
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

function saveFile(){
  
}

function uploadService(req, res) {
  const busboy = new Busboy({ headers: req.headers });

  function abort() {
    req.unpipe(busboy);
    if (!req.aborted) {
      res.statusCode = 413;
      res.end();
    }
  }

  let data = {};


  busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
    switch (fieldname) {
      case 'photo':
        {
          const destname = randomFileName(mimetype);
          const store = fs.createWriteStream(
            path.resolve(__dirname, `./photo/${destname}`)
          );
          file.on('error', abort);
          store.on('error', abort);
          file.pipe(store);
          data["photo"] = "localhost:9999/photo/" + destname;

        }
        break;
      case 'attachment':
        {
          const destname = randomFileName(mimetype);
          const store = fs.createWriteStream(
            path.resolve(__dirname, `./attachment/${destname}`)
          );
          file.on('error', abort);
          store.on('error', abort);
          file.pipe(store);
          data["photo"] = "localhost:9999/attachment/" + destname;
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
    data[fieldname] = val;
  });
  busboy.on('finish', () => {
    res.write(JSON.stringify(data));
    res.end();
  });

  req.on('aborted', abort);
  busboy.on('error', abort);

  req.pipe(busboy);
}

function readService(req, res) {
  const uri = url.parse(req.url, true);
  const filename = uri.pathname.replace('/read/', '');
  if (!filename) {
    res.statusCode = 400;
    res.write('request tidak sesuai');
    res.end();
  }
  const file = path.resolve(__dirname, `./file-storage/${filename}`);
  const exist = fs.existsSync(file);
  if (!exist) {
    res.statusCode = 404;
    res.write('file tidak ditemukan');
    res.end();
  }
  const fileRead = fs.createReadStream(file);
  res.setHeader('Content-Type', mime.lookup(filename));
  res.statusCode = 200;
  fileRead.pipe(res);
}

module.exports = {
  uploadService,
  readService,
};
