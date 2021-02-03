const fs = require('fs');
const path = require('path');
const mime = require('mime-types');
// eslint-disable-next-line no-unused-vars
const { Readable } = require('stream');

/**
 * generate random file name
 * @param {string} mimetype mimetype
 * @returns {string} generated file name
 */
function randomFileName(mimetype) {
  return (
    new Date().getTime() +
    '-' +
    Math.round(Math.random() * 1000) +
    '.' +
    mime.extension(mimetype)
  );
}

/**
 * save file to file system
 * @param {Readable} file readable file stream
 * @param {string} mimetype mime type
 * @returns {Promise<string>} generated filename
 */
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
