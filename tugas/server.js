const { createServer } = require('http')
const url = require('url')
const { stdout } = require('process')
const {saveWorker,getWorker,deleteWorker,photoService} = require('./worker-service');

//Worker service module here


//Task service module here

const server = createServer((req, res) => {
    let method = req.method
    // route service
    let message = 'tidak ditemukan data'
    let statusCode = 200
    const uri = url.parse(req.url, true)
    const respond = () => {
        res.statusCode = statusCode
        res.write(message)
        res.end()
    }

    switch (true) {
        case /^\/worker(\/\w+)?/.test(uri.pathname):
            if (method === 'GET') {
                getWorker(req,res);
            } else if (method === 'POST') {
                saveWorker(req,res);
            } else if (method === 'DELETE'){
                deleteWorker(req,res);
            }
            else {
                message = 'Method tidak tersedia'
                respond()
            }
            break
        case uri.pathname === '/task':
            if (method === 'GET') {
                // get task data
            } else if (method === 'POST') {
                // save worker data
            } else {
                message = 'Method tidak tersedia'
                respond()
            }
            break
        case /^\/photo\/\w+/.test(uri.pathname):
            if (method === 'GET') {
                photoService(req,res)
            } else {
                message = 'Method tidak tersedia'
                respond()
            }
            break
        case /^\/attachment\/\w+/.test(uri.pathname):
            if (method === 'GET') {
                // get attachment data
            } else {
                message = 'Method tidak tersedia'
                respond()
            }
            break
        default:
            statusCode = 404
            respond()
    }
})

const PORT = 9999
server.listen(PORT, () => {
    stdout.write(`server listening on port ${PORT}\n`)
})
