const fs = require('fs');
const path = require('path');
const url = require('url');

function deleteWorkers(req, res) {
  const uri = url.parse(req.url, true);
  const filename = uri.pathname.replace('/delete/', '');
  if (!filename) {
    res.statusCode = 400;
    res.write('request tidak sesuai');
    res.end();
  }

  const file = path.resolve(__dirname, `./db/profil/${filename}`);
  const exist = fs.existsSync(file);
  if (!exist) {
    res.statusCode = 404;
    res.write('file tidak ditemukan');
    res.end();
  }

  const remove = fs.unlink(
    path.resolve(__dirname, `./db/profil/${filename}`),
    (err) => {
      if (err) {
        res.statusCode = 400;
        res.write('delete error');
        res.end();
        return;
      }
      res.statusCode = 200;
      res.write('Delete Sukses');
    }
  );

  remove.pipe(res);
}

module.exports = {
  deleteWorkers,
};
