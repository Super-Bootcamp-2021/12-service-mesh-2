const fs = require('fs')
const path = require('path')
const mime = require('mime-types')
const Busboy = require('busboy')
const url = require('url')

const { createClient, getAsync, setAsync } = require('./redist-handler')

function saveWorker(req, res) {
    const busboy = new Busboy({ headers: req.headers })
    const client = createClient()
    const redisSet = setAsync(client)
    const redisGet = getAsync(client)

    let data = {
        id: '',
        name: '',
        address: '',
        email: '',
        phone: '',
        biografi: '',
        deleted: false,
    }

    function abort() {
        req.unpipe(busboy)
        if (!req.aborted) {
            res.statusCode = 413
            res.end()
        }
    }

    async function saveData(data, res) {
        try {
            const workers = JSON.parse(await redisGet('worker'))

            if (workers === null) {
                data.id = 1
                await redisSet('worker', JSON.stringify([data]))
            } else {
                data.id = workers.length + 1
                workers.push(data)
                await redisSet('worker', JSON.stringify(workers))
            }

            res.write(
                JSON.stringify({
                    status: 'success',
                    message: 'success add new data',
                })
            )
            res.statusCode = 200
            client.end(true)
            res.end()
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
            saveData(data, res)
        })
    })

    req.on('aborted', abort)
    busboy.on('error', abort)

    req.pipe(busboy)
}

async function getWorker(req, res) {
    const client = createClient()
    const redisGet = getAsync(client)

    function abort() {
        req.unpipe(busboy)
        if (!req.aborted) {
            res.statusCode = 413
            res.end()
        }
    }

    const data = JSON.parse(await redisGet('worker'))

    const message = JSON.stringify({
        status: 'success',
        message: 'success get data',
        data: data,
    })
    res.setHeader('Content-Type', 'application/json')
    res.statusCode = 200
    res.write(message)
    res.end()
    req.on('aborted', abort)
}

async function deleteWorker(req, res) {
    const uri = url.parse(req.url, true)
    const id = uri.pathname.replace('/worker/', '')
    const client = createClient()
    const redisGet = getAsync(client)
    const redisSet = setAsync(client)

    async function deleteData(id,res){
        try {
            const data = JSON.parse(await redisGet('worker'))
            let message
            let isFound = false

            for (let i = 0; i < data.length; i++) {
                if (data[i].id == id) {
                    data[i].deleted = true
                    isFound = true
                }
            }

            if (isFound) {
                await redisSet('worker', JSON.stringify(data))
                message = JSON.stringify({
                    status: 'success',
                    message: 'success delete data',
                })
                res.setHeader('Content-Type', 'application/json')
                res.statusCode = 200
                res.write(message)
                res.end()
            }
            message = JSON.stringify({
                status: 'error',
                message: 'data not found',
            })
            res.setHeader('Content-Type', 'application/json')
            res.statusCode = 404
            res.write(message)
            res.end()
        } catch (error) {
            message = JSON.stringify({
                status: 'error',
                message: error.toString(),
            })
            res.setHeader('Content-Type', 'application/json')
            res.statusCode = 400
            res.write(message)
            res.end()
        }
    }

    client.on('error', (error) => {
        client.end(true)
    })

    client.on('connect', () => {
        deleteData(id,res);
    })
}

module.exports = { saveWorker, getWorker, deleteWorker }
