const fs = require('fs');
const path = require('path');
const Busboy = require('busboy');
const { Writable } = require('stream');
const redis = require('redis');
const { promisify } = require('util');
const { randomFileName } = require('../utils');

function workersStore(req, res) {
  // Menyimpan data worker dari http request ke database redis
  let workerData = {};
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
            path.resolve(__dirname, `./file-storage/workers/${destname}`)
          );
          file.on('error', abort);
          store.on('error', abort);
          file.pipe(store);
          workerData.photo = filename;
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
    workerData[fieldname] = val;
  });

  busboy.on('finish', () => {
    //redis code
    const client = redis.createClient();
    const getAsync = promisify(client.get).bind(client);
    const setAsync = promisify(client.set).bind(client);

    client.on('error', (error) => {
      res.statusCode = 400;
      res.write = 'Bad request';
      res.end();
      console.error(error);
      client.end(true);
    });

    client.on('connect', async () => {
      try {
        const val = await getAsync('workers');
        let worker = {};
        if (!val) {
          let arrWorker = [];
          arrWorker.push(workerData);
          worker.workers = arrWorker;
          await setAsync('workers', JSON.stringify(worker));
        } else {
          let arrWorker = JSON.parse(val).workers;
          arrWorker.push(workerData);
          worker.workers = arrWorker;
          await setAsync('workers', JSON.stringify(worker));
        }
        res.statusCode = 200;
        res.write(JSON.stringify(worker));
        res.end();
        client.end(true);
      } catch (error) {
        console.log(error);
      }
    });
  });

  req.on('aborted', abort);
  busboy.on('error', abort);

  req.pipe(busboy);
}

function workersRead(req, res) {
  // Mengambil data dari database redis dengan key:workers
  const client = redis.createClient();
  const getAsync = promisify(client.get).bind(client);

  let message = 'Bad request';
  let statusCode = 400;

  const respond = () => {
    res.statusCode = statusCode;
    res.write(message);
    res.end();
  };

  client.on('error', (error) => {
    respond();
    console.error(error);
    client.end(true);
  });

  client.on('connect', async () => {
    try {
      const val = await getAsync('workers');
      console.log(val);
      statusCode = 200;
      message = val;
      respond();
      client.end(true);
    } catch (error) {
      console.log(error);
    }
  });
}

module.exports = {
  workersStore,
  workersRead,
};
