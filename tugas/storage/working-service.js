const fs = require('fs');
const path = require('path');
const mime = require('mime-types');
const Busboy = require('busboy');
const url = require('url');
const { setValue, getValue, delValue } = require('../kv/redis');

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

function storeProfileService(req, res) {
  const busboy = new Busboy({ headers: req.headers });
  let newObj = {};

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
          newObj[fieldname] = filename;
          const destname = randomFileName(mimetype);
          const store = fs.createWriteStream(
            path.resolve(__dirname, `./file-storage/${destname}`)
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
  busboy.on('field', (fieldname, val) => {
    newObj[fieldname] = val;
  });
  busboy.on('finish', async () => {
    await setValue(newObj);
    res.write('data berhasil di tambahkan');
    res.end();
  });

  req.on('aborted', abort);
  busboy.on('error', abort);

  req.pipe(busboy);
}

async function getValueService(req, res) {
  const uri = url.parse(req.url, true);
  const filename = uri.pathname.replace('/find/', '');
  if (!filename) {
    res.statusCode = 400;
    res.write('request tidak sesuai');
    res.end();
  }
  const value = await getValue(filename);
  res.setHeader('Content-Type', 'application/json');
  const data = JSON.stringify(value);
  res.statusCode = 200;
  res.write(data);
  res.end();
}
async function delValueService(req, res) {
  const uri = url.parse(req.url, true);
  const filename = uri.pathname.replace('/del/', '');
  if (!filename) {
    res.statusCode = 400;
    res.write('request tidak sesuai');
    res.end();
  }
  const value = await delValue(filename);
  if (!value) {
    res.statusCode = 404;
    res.write('data tidak ditemukan');
    res.end();
  }
  res.setHeader('Content-Type', 'application/json');
  res.statusCode = 200;
  res.write(value);
  res.end();
}

module.exports = {
  storeProfileService,
  getValueService,
  delValueService,
};
