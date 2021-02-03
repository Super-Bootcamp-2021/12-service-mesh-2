const { read, save } = require('../lib/redis');

const ERROR_REGISTER_DATA_INVALID = 'data registrasi pekerja tidak lengkap';
const ERROR_WORKER_NOT_FOUND = 'pekerja tidak ditemukan';

/**
 * Worker type definition
 * @typedef {Object} Worker
 * @property {string} name
 * @property {number} age
 * @property {string} bio
 * @property {string} address
 * @property {string} photo
 */

/**
 * register new worker
 * @param {Worker} data worker profile
 * @returns {Promise<Worker>} new worker profile with id
 */
async function register(data) {
  if (!data.name || !data.age || !data.bio || !data.address || !data.photo) {
    throw ERROR_REGISTER_DATA_INVALID;
  }
  let workers = await read('worker');
  if (!workers) {
    workers = [];
  }
  const worker = {
    id: Math.round(Math.random() * 1000).toString(),
    name: data.name,
    age: parseInt(data.age.toString(), 10),
    bio: data.bio,
    address: data.address,
    photo: data.photo,
  };
  workers.push(worker);
  await save('worker', workers);
  return worker;
}

/**
 * get list of registered workers
 * @returns {Promise<Worker[]>} list of registered workers
 */
async function list() {
  let workers = await read('worker');
  if (!workers) {
    workers = [];
  }
  return workers;
}

/**
 * remove a worker by an id
 * @param {string} id worker id
 * @returns {Promise<Worker>} removed worker
 */
async function remove(id) {
  let workers = await read('worker');
  if (!workers) {
    throw ERROR_WORKER_NOT_FOUND;
  }
  const idx = workers.findIndex((w) => w.id === id);
  if (idx === -1) {
    throw ERROR_WORKER_NOT_FOUND;
  }
  const deleted = workers.splice(idx, 1);
  await save('worker', workers);
  return deleted;
}

module.exports = {
  register,
  list,
  remove,
  ERROR_REGISTER_DATA_INVALID,
  ERROR_WORKER_NOT_FOUND,
};
