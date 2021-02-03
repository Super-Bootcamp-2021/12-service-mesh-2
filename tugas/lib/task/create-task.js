const fs = require('fs');
const path = require('path');
const mime = require('mime-types');
const Busboy = require('busboy');
const { Writable } = require('stream');
const { save } = require('../../db/redis/redis');
const { CONFIG } = require('../../config');

function addTask(req, res) {
  const busboy = new Busboy({ headers: req.headers });

  let job = '';
  let worker = '';

  function abort() {
    req.unpipe(busboy);
    if (!req.aborted) {
      res.statusCode = 413;
      res.end();
    }
  }

  busboy.on('field', (fieldname, val) => {
    switch (fieldname) {
      case 'job':
        job = val;
        break;
      case 'worker':
        worker = val;
        break;
      default:
        break;
    }
  });
  busboy.on('finish', async () => {
    const input = JSON.stringify({
      job: job,
      worker: worker
    });
    await save(CONFIG.TASK, JSON.stringify({ task: [input] }));
    res.end();
  });

  req.on('aborted', abort);
  busboy.on('error', abort);

  req.pipe(busboy);
}

module.exports = {
  addTask,
};
