const { createServer } = require("http");
const url = require("url");

const { stdout } = require("process");

const {
    saveTask,
    getTask,
    delTask
} = require("./basic.client");

const server = createServer( async (req, res) => {
    let method = req.method;

    let message = "404 not found";
    let statusCode = 200;

    const uri = url.parse(req.url, true);

    switch (true) {
        case /^\/task\/save/.test(uri.pathname):            
            if (method === 'GET') {
                let data = {
                    nama: uri.query["nama"],
                    alamat: uri.query["alamat"],
                    email: uri.query["email"],
                    telepon: uri.query["telepon"],
                    bigorafi: uri.query["biografi"],
                }
                message = await saveTask(uri.query["key"], JSON.stringify(data));                
                
            } else {
                message = 'Method tidak tersedia';                         
            }
            break;   

        case /^\/task\/get/.test(uri.pathname):
            if (method === 'GET') {               
                message = await getTask(uri.query["key"]);                                
            } else {
                message = 'Method tidak tersedia';                       
            }
            break;
        
        case /^\/task\/del/.test(uri.pathname):
            if (method === 'GET') {               
                message = await delTask(uri.query["key"]);                                
            } else {
                message = 'Method tidak tersedia';                       
            }
            break;
    
        default:
            statusCode = 404;                    
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