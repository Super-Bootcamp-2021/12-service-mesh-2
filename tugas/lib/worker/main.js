const {addWorkers,uploadFoto} = require('./create-worker')
const {readWorkers} = require('./read-worker')
require('./delete-worker')


module.exports = {addWorkers, readWorkers,uploadFoto}