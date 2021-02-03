const fs = require('fs');
const path = require('path');
const mime = require('mime-types');
const Busboy = require('busboy');
const url = require('url');
const {
  Writable
} = require('stream');
const redis = require('redis');
const {
  promisify
} = require('util');

const client = redis.createClient();
const getAsync = promisify(client.get).bind(client);
const setAsync = promisify(client.set).bind(client);


function randomFileName(mimetype) {
  return (
    new Date().getTime() +
    '-' +
    Math.round(Math.random() * 1000) +
    '.' +
    mime.extension(mimetype)
  );
}

function workersStore(req, res) {
  // Menyimpan data worker dari http request ke database redis
  const busboy = new Busboy({
    headers: req.headers
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
      case 'photo': {
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
    console.log(val);
  });
  busboy.on('finish', () => {
    res.end();
  });

  req.on('aborted', abort);
  busboy.on('error', abort);

  req.pipe(busboy);
}

function workersRead(req, res) {
  // Mengambil data dari database redis dengan key:workers
  const client = redis.createClient();
  const getAsync = promisify(client.get).bind(client);

  client.on('error', (error) => {
    console.error(error);
    client.end(true);
  });

  client.on('connect', () => {
    try {
      const val = await getAsync('workers');
      console.log(val);
    } catch (error) {
      console.log(error)
    }
  });
}

module.exports = {
  workersStore,
  workersRead,
};