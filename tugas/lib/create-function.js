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
  
  function addWorkers(req, res) {
    const busboy = new Busboy({ headers: req.headers });
    
    let profil = 

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
            const store = fs.createWriteStream(
              path.resolve(__dirname, `./profil-workers/${destname}`)
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