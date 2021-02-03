const http = require('http');
const PORT = 7000;

function attachTask(request, response) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: PORT,
            path: '/store',
            method: 'POST',
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }

        const req = http.request(options, (res) => {
            let data = "";

            res.on("data", (chunk) => {
                data += chunk.toString();
            });

            res.on("end", () => {
                resolve(data);
            });

            res.on("error", (err) => {
                reject(err);
            })
        })

        req.write();
        req.end();
    })
}

function createTask(key, data) {
    return new Promise((resolve, reject) => {
        console.log(key, data);
        const req = http.request(`http://localhost:${PORT}/set?key=${key}&value=${data}`, (res) => {
            let data = "";
            res.on("data", (chunk) => {
            data += chunk.toString();
            });
            res.on("end", () => {
            resolve(data);
            });
            res.on("error", (err) => {
            reject(err);
            });
        });
        req.end();
    });
}

function getTask(key) {
    return new Promise((resolve, reject) => {
        const req = http.request(`http://localhost:${PORT}/set?key=${key}`, (res) => {
            let data = "";
            res.on("data", (chunk) => {
            data += chunk.toString();
            });
            res.on("end", () => {
            resolve(data);
            });
            res.on("error", (err) => {
            reject(err);
            });
        });
        req.end();
    });
}

module.exports = {
    createTask,
}