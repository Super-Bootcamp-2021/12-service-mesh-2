const redis = require('redis');

const client = redis.createClient();

const { promisifyAll } = require('bluebird');

promisifyAll(redis);
  
async function set(key, value) {
    try {
        await client.setAsync(key, value);        
        return 'succes set';
    } catch (err) {
        console.error(err);
    }
}

async function get(key) {
    try {
        const val = await client.getAsync(key);                    
        return val;
    } catch (err) {
        console.error(err);
    }
}

async function del(key) {
    try {
        await client.delAsync(key);   
        return 'succes delete';
    } catch (err) {
        console.error(err);
    }
}

module.exports = {
    set,
    get,
    del
}