const { createServer } = require('http')
const url = require('url')
const { stdout } = require('process')

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
        case uri.pathname === '/worker':
            if (method === 'GET') {
                // get worker data 
            } else if (method === 'POST') {
                // save worker data
            } else {
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
                // get photo data
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
