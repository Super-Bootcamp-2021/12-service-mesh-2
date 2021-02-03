const fs = require('fs');
const path = require('path');
const mime = require('mime-types');
const Busboy = require('busboy');
const redis = require('redis');
const { promisify } = require('util');
const { Writable } = require('stream');
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
            path.resolve(__dirname, `./db/photos/${destname}`)
          );
          file.on('error', abort);
          store.on('error', abort);
          file.pipe(store);
        }
        break;
      case 'attachment':
        {
          const destname = randomFileName(mimetype);
          const store = fs.createWriteStream(
            path.resolve(__dirname, `./db/task-files/${destname}`)
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

  busboy.on('field', async (fieldname, val) => {
    // switch (fieldname) {
    //   case 'task':
    try {
      await setAsync('worker', JSON.stringify({
        nama: val,
      }));
      let value = await getAsync('worker');
      console.log(value);
      client.end(true);
    } catch (err) {
      console.error(err);
      client.end(true);
    }
    //     break;
    //   case 'nama':
    //     try {
    //       await setAsync('name', val);
    //       let value = await getAsync('name');
    //       console.log(value);
    //       client.end(true);
    //     } catch (err) {
    //       console.error(err);
    //       client.end(true);
    //     }
    // }
  });
  busboy.on('finish', () => {
    res.end();
  });

  req.on('aborted', abort);
  busboy.on('error', abort);

  req.pipe(busboy);
}

function addWorkers(req, res) {
    const busboy = new Busboy({ headers: req.headers });
    
    let profil = ""
    let nama = ""
    let alamat = ""
    let email = ""
    let telp = ""
    let biografi = ""

    function abort() {
      req.unpipe(busboy);
      if (!req.aborted) {
        res.statusCode = 413;
        res.end();
      }
    }
    
    busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
      switch (fieldname) {
        case 'profil':
          {
            const destname = randomFileName(mimetype);
            profil = destname;
            const store = fs.createWriteStream(
              path.resolve(__dirname, `./db/profil/${destname}`)
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
        switch(fieldname){
            case "nama":
                nama = val;
                break;
            case "alamat":
                alamat = val;
                break;
            case "email":
                email = val;
                break;
            case "telp":
                telp = val;
                break;
            case "biografi":
                biografi = val;
                break;
        }
      console.log(val);
    });
    busboy.on('finish', () => {
        const input = JSON.stringify({
            "profil":profil,
            "nama":nama,
            "alamat":alamat,
            "email":email,
            "telp":telp,
            "biografi":biografi
        });
        res.write(input);
        res.end();
    });
  
    req.on('aborted', abort);
    busboy.on('error', abort);
  
    req.pipe(busboy);
  }

module.exports = {
  uploadFiles,
  addWorkers
};

