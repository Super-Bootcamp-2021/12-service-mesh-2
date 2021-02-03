const { 
    uploadService,
    readService,
    deleteService 
} = require("../basic/service/upload-service");

const {
    set,
    get,
    del
} = require("../basic/db/redis");


async function saveWorkers(req, res, key, data) {
    // const filename = uploadService(req, res);
    // data['upload'] = filename;
    try {
        await set(key, JSON.stringify(data));    
        return 'succes dave data';
    }
    catch(err) {
        console.log(err);
    }
    
}

async function getWorkers(key) {
    try {
        return await get(key);
    }    
    catch(err) {
        console.log(err);
    }
}

async function delWorkers(key) {
    try {
        return await del(key);
    }    
    catch(err) {
        console.log(err);
    }
}

module.exports = {
    saveWorkers,
    getWorkers,
    delWorkers
}