const { createServer } = require("http");
const url = require("url");

const { stdout } = require("process");

const {
    saveWorkers,
    getWorkers,
    delWorkers
} = require("./basic.client");

const server = createServer( async (req, res) => {
    let method = req.method;

    let message = "404 not found";
    let statusCode = 200;
    const respond = () => {
        res.statusCode = statusCode;
        res.write(message);
        res.end();
    };

    const uri = url.parse(req.url, true);

    switch (true) {
        case /^\/workers\/save/.test(uri.pathname):            
            if (method === 'POST') {
                let data = {
                    nama: uri.query["nama"],
                    alamat: uri.query["alamat"],
                    email: uri.query["email"],
                    telepon: uri.query["telepon"],
                    bigorafi: uri.query["biografi"],
                }
                message = await saveWorkers(req, res, uri.query["key"], data);
                //res.write(message);
                
            } else {
                message = 'Method tidak tersedia';   
                respond();             
            }
            break;   

        case /^\/workers\/get/.test(uri.pathname):
            if (method === 'GET') {               
                message = await getWorkers(uri.query["key"]);
                //res.write(message);
                
            } else {
                message = 'Method tidak tersedia';   
                respond();             
            }
            break;
        
        case /^\/workers\/del/.test(uri.pathname):
            if (method === 'GET') {               
                message = await delWorkers(uri.query["key"]);
                //res.write(message);
                
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
    //res.end();

    res.statusCode = statusCode;
    res.write(message);
    res.end();
});


const PORT = 3232;
server.listen(PORT, () => {
    stdout.write(`server task listening on port ${PORT}`);
})