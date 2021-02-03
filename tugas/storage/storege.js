const fs = require('fs');
const path = require('path');
const mime = require('mime-types');
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

function upload(obj, fieldname, file, mimetype, abort) {
  switch (fieldname) {
    case 'photo':
      {
        const destname = randomFileName(mimetype);
        const store = fs.createWriteStream(
          path.resolve(__dirname, `./file-storage/${destname}`)
        );
        file.on('error', abort);
        store.on('error', abort);
        file.pipe(store);
        obj.photo = destname;
      }
      break;
    case 'attach':
      {
        const destname = randomFileName(mimetype);
        const store = fs.createWriteStream(
          path.resolve(__dirname, `./file-storage/${destname}`)
        );
        file.on('error', abort);
        store.on('error', abort);
        file.pipe(store);
        obj.attach = destname;
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
}
function readServicePhoto(req, res, obj) {
  const filename = obj.photo;
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
  res.setHeader('Content-Type', 'application/json', mime.lookup(filename));
  res.statusCode = 200;
  fileRead.pipe(res);
}
function readServiceTask(req, res, obj) {
  const filename = obj.attach;
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
  res.setHeader('Content-Type', 'application/json', mime.lookup(filename));
  res.statusCode = 200;
  fileRead.pipe(res);
  res.end();
}
module.exports = {
  upload,
  readServiceTask,
  readServicePhoto,
};
