const { createServer } = require("http");
const url = require("url");

const { stdout } = require("process");
const { createTask } = require("./basic.client");


const server = createServer((req, res) => {
    let method = req.method;

    let message = "404 not found";
    let statusCode = 200;

    const uri = url.parse(req.url, true);

    switch (true) {
        case /^\/task\/store/.test(uri.pathname):
            if (method === 'POST') {
                if (req.headers["content-type"] !== "application/json") {
                    statusCode = 400; // bad request
                } else {
                    let data = "";
                    req.on("data", (chunk) => {
                        data += chunk.toString();
                    });

                    req.on("end", () => {
                        const { nama } = JSON.parse(data)
                        message = createTask(nama, data);        
                    });
                    
                }               
            } else {
                message = 'Method tidak tersedia';                
            }    
            break;

        case /^\/task\/done/.test(uri.pathname):
            if (method === 'POST') {
                if (req.headers["content-type"] !== "application/json") {
                    statusCode = 400; // bad request
                } else {
                    let data = "";
                    req.on("data", (chunk) => {
                        data += chunk.toString();
                    });

                    req.on("end", () => {
                        const { nama } = JSON.parse(data)
                        message = createTask(nama, data);        
                    });
                    
                }               
            } else {
                message = 'Method tidak tersedia';                
            }    
            break;
    
        default:
            break;
    }

    res.statusCode = statusCode;
    res.write(message);
    res.end();
});


const PORT = 3232;
server.listen(PORT, () => {
    stdout.write(`server task listening on port ${PORT}`);
})