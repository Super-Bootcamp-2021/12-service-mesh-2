const fs = require('fs');
const path = require('path');
const mime = require('mime-types');
const Busboy = require('busboy');
const url = require('url');
const { Writable } = require('stream');
const { setData, delData, getData } = require('../redis');

function randomFileName(mimetype) {
    return (
        new Date().getTime() +
        '-' +
        Math.round(Math.random() * 1000) +
        '.' +
        mime.extension(mimetype)
    );
}

async function addTaskService(req, res) {
    const busboy = new Busboy({ headers: req.headers });
    // let obj = {};
    // let data = JSON.parse(await getData('data'));

    // if (!data) {
    //     data = { data: [] };
    // }

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
                        path.resolve(__dirname, `./file-storage/${destname}`)
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
                        path.resolve(__dirname, `./file-storage/${destname}`)
                    );
                    file.on('error', abort);
                    store.on('error', abort);
                    file.pipe(store);
                }
                break;
            default:
                {
                    const noop = new Writable({
                        write(chunk, encding, callback) {
                            setImmediate(callback);
                        },
                    });
                    file.pipe(noop);
                }
        }
    });

    //const state = [];
    let formData = new Map();
    busboy.on('field', async(fieldname, val) => {
        // await setData('data', val);
        // obj = {
        //     [`${fieldname}`]: val
        // }
        formData.set(fieldname, val);
        console.log(fieldname, val);
        formData.set(fieldname = 'status', val = 'belum selesai');

    });

    busboy.on('finish', async() => {
        // state.push([`${obj}`]);
        // state.push({
        //     ['status']: 'belum selesai'
        // });
        // console.log('objnya adalah', obj)
        // const b = await setData('data', JSON.stringify(data));
        // console.log('data b : ', b);
        // const a = await getData('data');
        // console.log('datanya b: ', a);

        let obje = Object.fromEntries(formData);
        const a = await setData('data', JSON.stringify(obje));
        console.log('set data object: ', a);
        const a2 = await getData('data');
        console.log('get data: ', a2);
        res.end();
    });

    req.on('aborted', abort);
    busboy.on('error', abort);

    req.pipe(busboy);
}

async function finishService(req, res) {
    const busboy = new Busboy({ headers: req.headers });

    function abort() {
        req.unpipe(busboy);
        if (!req.aborted) {
            res.statusCode = 413;
            res.end();
        }
    }

    let formData = new Map();
    busboy.on('field', async(fieldname, val) => {
        formData.set(fieldname, val);
        formData.set(fieldname = 'status', val = 'selesai');
        console.log(fieldname, val);
    });

    busboy.on('finish', async() => {
        let obje = Object.fromEntries(formData);
        const a = await setData('data', JSON.stringify(obje));
        console.log('set data object : ', a);
        const a2 = await getData('data');
        console.log('get data: ', a2);
        res.end();
    });

    req.on('aborted', abort);
    busboy.on('error', abort);

    req.pipe(busboy);
}

async function cancelService(req, res) {
    const busboy = new Busboy({ headers: req.headers });

    function abort() {
        req.unpipe(busboy);
        if (!req.aborted) {
            res.statusCode = 413;
            res.end();
        }
    }

    let formData = new Map();
    busboy.on('field', async(fieldname, val) => {
        formData.set(fieldname, val);
        formData.set(fieldname = 'status', val = 'batal');
        console.log(fieldname, val);
    });

    busboy.on('finish', async() => {
        let obje = Object.fromEntries(formData);
        const a = await setData('data', JSON.stringify(obje));
        console.log('set data object : ', a);
        const a2 = await getData('data');
        console.log('get data: ', a2);
        res.end();
    });

    req.on('aborted', abort);
    busboy.on('error', abort);

    req.pipe(busboy);
}

function readService(req, res) {
    const uri = url.parse(req.url, true);
    const filename = uri.pathname.replace('/read/', '');
    if (!filename) {
        res.statusCode = 400;
        res.write('request tidak sesuai');
        res.end();
    }
    const file = path.resolve(__dirname, `./file-storage/${filename}`);
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
    addTaskService,
    readService,
    finishService,
    cancelService,
};