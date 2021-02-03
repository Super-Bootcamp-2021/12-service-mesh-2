const { addWorkers, uploadFoto } = require('./create-worker');
const { deleteWorkers } = require('./delete-worker');
const { readWorkers } = require('./read-worker');
module.exports = { addWorkers, uploadFoto, deleteWorkers, readWorkers };
