const redis = require('redis');
const { promisify } = require('util');
const client = redis.createClient();

const getAsync = promisify(client.get).bind(client);
const setAsync = promisify(client.set).bind(client);
const delAsync = promisify(client.del).bind(client);

client.on('error', (error) => {
    console.error(error);
    client.end(true);
});

client.on('connect', () => {
    main();
});

async function main() {
    try {
        await setAsync('pekerjaan', JSON.stringify({ pekerjaan: [] }));
        const val = await getAsync('pekerjaan');
        console.log(val);
        // await delAsync(fieldname);
        client.end(true);
    } catch (err) {
        console.error(err);
    }
}

module.exports = {
    main
};