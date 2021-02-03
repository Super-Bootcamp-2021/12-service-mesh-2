const redis = require('redis');

const client = redis.createClient();

function connect() {
  return new Promise((resolve, reject) => {
    client.on('connect', () => resolve());
    client.on('error', (error) => {
      reject(error);
      client.end(true);
    });
  });
}

async function save(db, data){
  client.set(db, JSON.stringify(data))
}


async function del(db, data){
  client.del(db, JSON.stringify(data))
}

async function read(db, data){
  client.get(db, JSON.stringify(data))
}

async function update(db, data){
  client.keys(db, JSON.stringify(data))
}

module.exports = {
  connect, 
  save,
  del,
  read,
  update
}