const fs = require('fs');
const path = require('path');
const mime = require('mime-types');
const url = require('url');

function readWorkers(req, res) {
    const uri = url.parse(req.url, true);
    const filename = uri.pathname.replace('/read/', '');
    if (!filename) {
      res.statusCode = 400;
      res.write('request tidak sesuai');
      res.end();
    }
    const file = path.resolve(__dirname, `./profil-workers/${filename}`);
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
    readWorkers
}