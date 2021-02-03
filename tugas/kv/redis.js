const redis = require('redis');
const { promisify } = require('util');
const client = redis.createClient();

const getAsync = promisify(client.get).bind(client);
const setAsync = promisify(client.set).bind(client);
const delAsync = promisify(client.del).bind(client);

let db = {
  worker: {},
  task: {},
};

client.on('error', (error) => {
  console.error(error);
  client.end(true);
});

client.on('connect', async (error) => {
  const store = await getAsync('db');
  if (store === null) {
    db = {
      worker: {},
      task: {},
    };
  }
  else {
    db = JSON.parse(store);
  }
});

function setWorker(obj){
  db.worker[obj.name] = {
    pekerja: obj.pekerja,
    email: obj.email,
    alamat: obj.alamat,
    telp: obj.telp,
    biografi: obj.biografi,
    filename: obj.photo,
  };
}


function setTask(obj){
  db.task[obj.name] = {
    pekerja: obj.pekerja,
    status: obj.status,
  };
}



// function setTask(db) {
//   db.task[fieldname] = value;
// }

async function setValueToDb() {
  try {
    await setAsync('db', JSON.stringify(db));
  } catch (err) {
    console.error(err);
  }
}
async function getValue() {
  try {
    let store = await getAsync('db');
    const result = JSON.parse(store);
    return result;
  } catch (err) {
    console.error(err);
  }
}
async function getValueByName(nama) {
  try {
    let store = await getAsync('db');
    const result = JSON.parse(store);
    return result.worker[nama];
  } catch (err) {
    console.error(err);
  }
}

async function upTaskByName(nama) {
  try {
    let store = await getAsync('db');
    const result = JSON.parse(store);
    result.task[nama].status = 1;
    return result;
  } catch (err) {
    console.error(err);
  }
}

async function getTaskByName(nama) {
  try {
    let store = await getAsync('db');
    const result = JSON.parse(store);
    return result.task[nama];
  } catch (err) {
    console.error(err);
  }
}
async function delValueWorker(value) {
  try {
    delete db.worker[value];
    const result = 'Berhasil di hapus';
    return result;
  } catch (err) {
    console.error(err);
  }
}

module.exports = {
  getValue,
  setWorker,
  setTask,
  setValueToDb,
  upTaskByName,
  delValueWorker,
  getValueByName,
  getTaskByName,
};
