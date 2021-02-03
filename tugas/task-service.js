const fs = require('fs')
const path = require('path')
const mime = require('mime-types')
const Busboy = require('busboy')
const url = require('url')

const { createClient, getAsync, setAsync, delAsync } = require('./redist-handler')

class TaskService {
    static saveTask(req, res){
        const busboy = new Busboy({ headers: req.headers });
        const client = createClient();
        let data = { delete: false, finish: false };

        busboy.on('field', (fieldname, val) => {
            data[fieldname] = val
        })

        busboy.on('finish', () => {

            client.on('error', (error) => {
                console.error(error)
                client.end(true)
            })

            client.on('connect', () => {
                saveData(data, res);
            })

        })

        busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
            switch (fieldname) {
              case 'attachment':
                {
                  const destname = randomFileName(mimetype);
                  const store = fs.createWriteStream(
                    path.resolve(__dirname, `./storage/attachment/${destname}`)
                  );
                  file.on('error', abort);
                  store.on('error', abort);
                  file.pipe(store);
                  data["attachment"] = "localhost:9999/attachment/" + destname;
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

        req.on('aborted', abort)
        busboy.on('error', abort)

        req.pipe(busboy)
    }

    static async getTask(req, res){
        const client = createClient();
        const redisGet = getAsync(client);

        const data = JSON.parse(await redisGet('task'));
        const message = JSON.stringify({ "status": "success", "message": "success get data", "data": data });
        res.setHeader('Content-Type', 'application/json');
        res.statusCode = 200;
        res.write(message);
        res.end();
        req.on('aborted', abort);
    }

    static attachmentService(req, res) {
        const uri = url.parse(req.url, true);
        const filename = uri.pathname.replace('/attachment/', '');
        if (!filename) {
          res.statusCode = 400;
          res.write('request tidak sesuai');
          res.end();
        }
        const file = path.resolve(__dirname, `./storage/attachment/${filename}`);
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
}

function abort() {
    req.unpipe(busboy)
    if (!req.aborted) {
        res.statusCode = 413
        res.end()
    }
}

async function saveData(data, res) {
    const client = createClient();
    const redisSet = setAsync(client);
    try {
        await redisSet('task', JSON.stringify(data));
        res.write(JSON.stringify({ "status": "success", "message": "success add new data" }));
        res.statusCode = 200;
        client.end(true);
        res.end();
    } catch (err) {
        console.error(err)
    }

}

function randomFileName(mimetype) {
    return (
      new Date().getTime() +
      '-' +
      Math.round(Math.random() * 1000) +
      '.' +
      mime.extension(mimetype)
    );
  }



module.exports = TaskService;
