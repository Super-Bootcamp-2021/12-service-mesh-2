const fs = require('fs');
const path = require('path');
const mime = require('mime-types');
const Busboy = require('busboy');
const url = require('url');
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

function uploadService(req, res) {
    const busboy = new Busboy({ headers: req.headers });
  
    function abort() {
        req.unpipe(busboy);
        if (!req.aborted) {
            res.statusCode = 413;
            res.end();
        }
    }
    
    let nama_file = '';
    busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
        switch (fieldname) {
            case 'photo':
            {                
                const destname = randomFileName(mimetype);            
                nama_file += destname;
                const store = fs.createWriteStream(
                    path.resolve(__dirname, `./file-storage/${destname}`)
                );
                file.on('error', abort);
                store.on('error', abort);
                file.pipe(store);
            }
            break;
            default: {
            const noop = new Writable({
                write(chunk, encoding, callback) {
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
        res.write(nama_file);
        res.end();     
    });

    req.on('aborted', abort);
    busboy.on('error', abort);

    req.pipe(busboy);        
}
  
function readService(req, res) {
    try {
        const uri = url.parse(req.url, true);
        const filename = uri.pathname.replace('/read/', '');
        
        if (!filename) {
            res.statusCode = 400;
            res.write('request tidak sesuai');
            //res.end();
        } else {
        
            const file = path.resolve(__dirname, `./file-storage/${filename}`);
            const exist = fs.existsSync(file);
            
            if (!exist) {
                res.statusCode = 404;
                res.write('file tidak ditemukan');
                //res.end();
            } else {
                const fileRead = fs.createReadStream(file);
                res.setHeader('Content-Type', mime.lookup(filename));
                res.statusCode = 200;
                fileRead.pipe(res);
            }        
        }
    }
    catch(err) {
        console.log(err);
    }
}

function deleteService(req, res) {
    try {
        const uri = url.parse(req.url, true);
        const filename = uri.pathname.replace('/delete/', '');
    
        if (!filename) {
            res.statusCode = 400;
            res.write('request tidak sesuai');
            //res.end();
        } else {
            const file = path.resolve(__dirname, `./file-storage/${filename}`);
            const exist = fs.existsSync(file);
        
            if (!exist) {
                res.statusCode = 404;
                res.write('file tidak ditemukan');
                //res.end();
            } else {
                fs.unlink(file, function (err) {
                    if (err) throw err;
                    // if no error, file has been deleted successfully
                    console.log('File deleted!');
                });
        
                res.setHeader('Content-Type', mime.lookup(filename));
                res.statusCode = 200;
                //res.end();
            }
        }                            
    }
    catch(err) {
        console.log(err);
    }
}

  module.exports = {
    uploadService,
    readService,
    deleteService
};