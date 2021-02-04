const fs = require('fs');
const path = require('path');
const Busboy = require('busboy');
const { Writable } = require('stream');
const { randomFileName } = require('../utils');
const { rpushRedis, lrangeRedis, lsetRedis } = require('./redis');

const pathDir = path.join(__dirname, '/../file-storage', 'tasks');
// TODO:
// COMPLETE: Make new task include information about name of task and name of worker
// COMPLETE: Can upload atachment for detail of tasks
// COMPLETE: Status flag for (type of task) - done and canceled task
// Filter tasks to show

function taskStore(req, res) {
  // Menyimpan task dari http request ke database redis
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
      case 'document':
        {
          const destname = randomFileName(mimetype);
          const store = fs.createWriteStream(path.join(pathDir, destname));
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

  const formData = new Map();
  busboy.on('field', (fieldname, val) => {
    formData.set(fieldname, val);
  });
  busboy.on('finish', () => {
    if (formData.size == 3) {
      if (
        formData.has('task_name') &&
        formData.has('worker_name') &&
        formData.has('status_flag')
      ) {
        lrangeRedis('tasks').then((data) => {
          var workerList = [];
          var lsetFlag = false;
          if (data.length == 0) {
            workerList.push(formData.get('worker_name'));
          } else {
            for (let index = 0; index < data.length; index++) {
              const element = data[index];
              var parseEl = JSON.parse(element);
              if (parseEl['task'] == formData.get('task_name')) {
                var lsetIndex = index;
                lsetFlag = true;
                workerList = parseEl['worker'];
                if (!parseEl['worker'].includes(formData.get('worker_name'))) {
                  workerList.push(formData.get('worker_name'));
                }
              }
            }
          }
          var dataPush = {};
          if (
            ['PROGRESS', 'DONE', 'CANCELLED'].includes(
              formData.get('status_flag')
            )
          ) {
            dataPush['task'] = formData.get('task_name');
            dataPush['worker'] = workerList;
            dataPush['status'] = formData.get('status_flag');
            if (lsetFlag) {
              lsetRedis('tasks', lsetIndex, JSON.stringify(dataPush));
            } else {
              rpushRedis('tasks', JSON.stringify(dataPush));
            }
          }
        });
      }
    }
    res.end();
  });

  req.on('aborted', abort);
  busboy.on('error', abort);

  req.pipe(busboy);
}

module.exports = {
  taskStore,
  // tasksDone,
};
