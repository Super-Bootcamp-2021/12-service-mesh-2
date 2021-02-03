const redis = require('redis');
const { promisify } = require('util');
const client = redis.createClient();

const getAsync = promisify(client.get).bind(client);
const setAsync = promisify(client.set).bind(client);
// const delAsync = promisify(client.del).bind(client);

client.on('error', (error) => {
  console.error(error);
  client.end(true);
});

async function setValue(fieldname, value) {
  try {
    let store = await getAsync(fieldname);
    let parsing = '';
    let newValue = '';
    if (store == null) {
      newValue = `${value}`;
    } else {
      parsing = JSON.parse(store);
      newValue = `${parsing},${value}`;
    }
    await setAsync(fieldname, JSON.stringify(newValue));
  } catch (err) {
    console.error(err);
  }
}
async function getValue(fieldname) {
  try {
    let store = await getAsync(fieldname);
    const result = JSON.parse(store).split(',');
    return result;
  } catch (err) {
    console.error(err);
  }
}

module.exports = {
  getValue,
  setValue,
};
