const fs = require('fs');
const path = require('path');
const mime = require('mime-types');

function randomFileName(mimetype) {
  return (
    new Date().getTime() +
    '-' +
    Math.round(Math.random() * 1000) +
    '.' +
    mime.extension(mimetype)
  );
}

function saveFile(file, mimetype) {
  const destname = randomFileName(mimetype);
  const store = fs.createWriteStream(
    path.resolve(__dirname, `../file-storage/${destname}`)
  );
  return new Promise((resolve, reject) => {
    store.on('finish', () => {
      resolve(destname);
    });
    store.on('error', (err) => {
      reject(err);
    });
    file.pipe(store);
  });
}

module.exports = {
  saveFile,
};
