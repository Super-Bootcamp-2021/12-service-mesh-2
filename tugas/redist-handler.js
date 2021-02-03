const redis = require('redis');
const { promisify } = require('util');

// const getAsync = promisify(client.get).bind(client);
// const setAsync = promisify(client.set).bind(client);
// const delAsync = promisify(client.del).bind(client);

function createClient(){
    return redis.createClient();
}

function getAsync(client){
    return promisify(client.get).bind(client);
}

function setAsync(client){
    return promisify(client.set).bind(client);
}



module.exports={
    createClient, getAsync, setAsync
}
