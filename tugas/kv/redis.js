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

async function setValue(profile) {
  try {
    await setAsync(profile.name, JSON.stringify(profile));
  } catch (err) {
    console.error(err);
  }
}
async function getValue(fieldname) {
  try {
    let store = await getAsync(fieldname);
    const result = JSON.parse(store);
    return result;
  } catch (err) {
    console.error(err);
  }
}
async function delValue(fieldname) {
  try {
    await delAsync(fieldname);
    const result = 'Berhasil di hapus';
    return result;
  } catch (err) {
    console.error(err);
  }
}

module.exports = {
  getValue,
  setValue,
  delValue,
};
