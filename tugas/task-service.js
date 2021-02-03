const fs = require('fs')
const path = require('path')
const mime = require('mime-types')
const Busboy = require('busboy')
const url = require('url')

const { createClient, getAsync, setAsync, delAsync } = require('./redist-handler')

function saveTask(req, res) {
    const busboy = new Busboy({ headers: req.headers });
    const client = createClient();
    const redisSet = setAsync(client);
    let data = {delete: false, finish: false};

    function abort() {
        req.unpipe(busboy)
        if (!req.aborted) {
            res.statusCode = 413
            res.end()
        }
    }

    async function saveData(data, res) {
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

    req.on('aborted', abort)
    busboy.on('error', abort)

    req.pipe(busboy)
}

async function getTask(req, res) {
    const client = createClient();
    const redisGet = getAsync(client);

    function abort() {
        req.unpipe(busboy)
        if (!req.aborted) {
            res.statusCode = 413
            res.end()
        }
    }


    const data = JSON.parse(await redisGet('task'));
    const message = JSON.stringify({ "status": "success", "message": "success get data", "data": data });
    res.setHeader('Content-Type', 'application/json');
    res.statusCode = 200;
    res.write(message);
    res.end();
    req.on('aborted', abort);
}


module.exports = { saveTask, getTask };