const { createServer } = require("http");
const url = require("url");

const { stdout } = require("process");
const { 
    uploadService,
    readService,
    deleteService 
} = require("./service/upload-service");

const {
    set,
    get,
    del
} = require("./db/redis");

const server = createServer(async (req, res) => {
    let method = req.method;

    // route
    let message = "404 not found";
    let statusCode = 200;
    
    const respond = () => {
        res.statusCode = statusCode;
        res.write(message);
        res.end();
    };

    const uri = url.parse(req.url, true);
    
    switch (true) {
        case /^\/store/.test(uri.pathname):
            console.log(req.headers);
            if (method === 'POST') {
                message = uploadService(req, res);                  
            } else {
                message = 'Method tidak tersedia';   
                respond();             
            }
            break;            
        case /^\/read\/\w+/.test(uri.pathname):
            if (method === 'GET') {
                message = readService(req, res);
            } else {
                message = 'Method tidak tersedia';
                respond();
            }
            break;
        case /^\/delete\/\w+/.test(uri.pathname):
            if (method === 'GET') {
                deleteService(req, res);
            } else {
                message = 'Method tidak tersedia';
                respond();                
            }
            break;
        case /^\/set/.test(uri.pathname):
            if (method === 'GET') {
                message = await set(uri.query["key"],uri.query["value"]);        
            } else {
                message = 'Method tidak tersedia';                
                respond();
            }            
            break;
        case /^\/get/.test(uri.pathname):
            if (method === 'GET') {
                message = await get(uri.query["key"]);        
            } else {
                message = 'Method tidak tersedia';            
                respond();    
            } 
            
            break;
        case /^\/del/.test(uri.pathname):
            if (method === 'GET') {
                message = await del(uri.query["key"]);        
            } else {
                message = 'Method tidak tersedia';                
                respond();
            } 
            
            break;
        default:
            statusCode = 404;            
            respond();
            break;
    }
    // res.statusCode = statusCode;
    // res.write(message);
    // res.end();
});

const PORT = 7000;
server.listen(PORT, () => {
    stdout.write(`server listening on port ${PORT}`);
})