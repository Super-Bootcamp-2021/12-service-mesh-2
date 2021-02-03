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

function addWorkers(req, res) {
  const busboy = new Busboy({ headers: req.headers });
  let nama = '';
  let alamat = '';
  let email = '';
  let telp = '';
  let biografi = '';
  let photo = ""

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
            path.resolve(__dirname, `../../db/photos/${destname}`)
          );
          photo = destname;
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
    switch (fieldname) {
      case 'nama':
        nama = val;
        break;
      case 'alamat':
        alamat = val;
        break;
      case 'email':
        email = val;
        break;
      case 'telp':
        telp = val;
        break;
      case 'biografi':
        biografi = val;
        break;
    }
  });
  busboy.on('finish', async () => {
    const input = {
      nama: nama,
      email: email,
      alamat: alamat,    
      telp: telp,
      biografi: biografi,
      photo : photo,
    };
    await save(CONFIG.WORKER, input);
    res.end();
  });

  req.on('aborted', abort);
  busboy.on('error', abort);

  req.pipe(busboy);
}

function uploadFoto(req, res) {
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
            path.resolve(__dirname, `../../db/photos/${destname}`)
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
  addWorkers,
  uploadFoto,
};
